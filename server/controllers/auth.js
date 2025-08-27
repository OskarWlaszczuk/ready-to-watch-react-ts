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

//refresh token trzymać w bazie danych
let refreshTokens = [];

const refreshToken = (request, response) => {
    const refreshToken = request.body.token;
    if (refreshToken == null) return response.sendStatus(401);
    if (!refreshTokens.includes(refreshToken)) return response.sendStatus(403);

    //tutaj wyciągać refresh token z bazy danych

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, userPayload) => {
        if (error) return response.sendStatus(403);
        const accessToken = generateAccessToken({ id: userPayload.id });
        response.json({ accessToken });
    });
};

const register = async (request, response) => {
    const { nickname, password } = request.body;

    try {
        const user = await pool.query(
            "SELECT nickname, id FROM users WHERE nickname = $1",
            [nickname]
        );
        const isUserAvailable = user.rows.length > 0;

        if (isUserAvailable) {
            return response.status(400).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await pool.query(
            "INSERT INTO users (nickname, password) VALUES($1, $2) RETURNING nickname",
            [nickname, hashedPassword]
        );

        response.json({ success: true, user: newUser });
    } catch (error) {
        response
            .status(500)
            .json({ success: false, message: "User not created" });
    }
};

const logout = (request, response) => {
    refreshTokens = refreshTokens.filter(token => token !== request.body.token);
    response.sendStatus(204);
};

const login = async (request, response) => {
    const { nickname, password } = request.body;

    try {
        const selectedUser = await pool.query(
            "SELECT * FROM users WHERE nickname = $1",
            [nickname]
        );

        if (selectedUser.rows.length === 0) {
            return response.status(401).json({ success: false, message: "User not found" });
        }

        const isValidPassword = await bcrypt.compare(password, selectedUser.rows[0].password);
        if (!isValidPassword) {
            return response.status(401).json({ success: false, message: "Invalid password" });
        }

        const userPayload = { id: selectedUser.rows[0].id, };
        const accessToken = generateAccessToken(userPayload);
        const refreshToken = jwt.sign(userPayload, process.env.REFRESH_TOKEN_SECRET);

        //dodawać refesh token do bazy danych!
        refreshTokens.push(refreshToken);
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