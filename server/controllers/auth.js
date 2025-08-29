const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");
require("dotenv").config();

const generateAccessToken = (userPayload) => {
    const accessToken = jwt.sign(
        userPayload,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "50s" }
    );

    return accessToken;
};

const refreshToken = async (request, response) => {
    console.log("refreshing token...");
    const { nickname } = request.user;
    const accessToken = generateAccessToken({ nickname });

    response.status(200).json({ accessToken });
};

const register = async (request, response) => {
    const { nickname, password } = request.body;

    try {
        const result = await pool.query(
            "SELECT nickname FROM users WHERE nickname = $1",
            [nickname]
        );

        const isUserExists = result.rows.length > 0;
        if (isUserExists) {
            return response.status(400).json({ success: false, message: "User already exists" });
        }

        const userPayload = { nickname };

        const accessToken = generateAccessToken(userPayload);
        const refreshToken = jwt.sign(userPayload, process.env.REFRESH_TOKEN_SECRET);

        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await pool.query(
            "INSERT INTO users (nickname, password, refresh_token_hash) VALUES($1, $2, $3) RETURNING nickname",
            [nickname, hashedPassword, hashedRefreshToken]
        );

        response
            .status(201)
            .json({ success: true, user: newUser, accessToken, refreshToken });
    } catch (error) {
        console.log(error);
        response
            .status(500)
            .json({ success: false, message: "Internal serveer error" });
    }
};

const logout = async (request, response) => {
    console.log("loagoutting user...");
    const { nickname } = request.user;

    await pool.query(
        "UPDATE users SET refresh_token_hash = NULL WHERE nickname = $1",
        [nickname]
    );

    console.log("user logouted");
    response.sendStatus(204);
};

const login = async (request, response) => {
    const { nickname, password } = request.body;

    try {
        const result = await pool.query(
            "SELECT * FROM users WHERE nickname = $1",
            [nickname]
        );

        const isUserExists = result.rows.length > 0;
        if (!isUserExists) {
            return response
                .status(400)
                .json({ success: false, message: "User doesn't exist" });
        }

        const isValidPassword = await bcrypt.compare(password, result.rows[0].password);
        if (!isValidPassword) {
            return response
                .status(401)
                .json({ success: false, message: "Invalid password" });
        }

        const userPayload = { nickname: result.rows[0].nickname };

        const accessToken = generateAccessToken(userPayload);
        const refreshToken = jwt.sign(userPayload, process.env.REFRESH_TOKEN_SECRET);
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

        await pool.query(
            "UPDATE users SET refresh_token_hash = $1 WHERE nickname = $2",
            [hashedRefreshToken, nickname]
        );

        response.json({ accessToken, refreshToken });
    } catch (error) {
        console.error(error);
        response.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = {
    refreshToken,
    register,
    logout,
    login
};