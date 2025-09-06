const bcrypt = require("bcrypt");
const getUser = require("../services/getUser");
const generateAccessToken = require("../services/generateAccessToken");
const deleteRefeshToken = require("../services/deleteRefeshToken");
const saveRefreshToken = require("../services/saveRefreshToken");
const addNewUser = require("../services/addNewUser");
const formatErrorResponse = require("../utils/formatErrorResponse");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const refreshToken = async (request, response) => {
    console.log("refreshing token...");
    const { nickname } = request.user;
    const accessToken = generateAccessToken({ nickname });

    console.log(`Access token odświeżony: ${accessToken}`);
    response.status(200).json({ accessToken });
};

const logout = async (request, response) => {
    console.log("loagoutting user...");
    const { nickname } = request.user;
    const refreshToken = request.cookies?.refreshToken;
    console.log(`cookies przed wylogowaniem: ${refreshToken}`);

    await deleteRefeshToken(nickname)
    response.clearCookie(process.env.COOKIE_NAME, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: process.env.COOKIE_PATH,
    });

    console.log(`cookies po wylogowaniu: ${refreshToken}`);
    console.log("user logouted");

    response.sendStatus(204);
};

const login = async (request, response) => {
    console.log("logging user...");
    const { nickname, password } = request.body;

    try {
        const result = await getUser(nickname);

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

        const tokenPayload = { nickname };

        const accessToken = generateAccessToken(tokenPayload);
        const refreshToken = jwt.sign(
            tokenPayload,
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.REFRESH_TTL }
        );
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

        await saveRefreshToken(nickname, hashedRefreshToken);
        //zmienić ustawienia w prod
        response.cookie(process.env.COOKIE_NAME, refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: process.env.COOKIE_PATH,
            maxAge: 7 * 24 * 3600 * 1000,
        });

        const user = {
            nickname,
            password,
        };

        console.log("user logined");
        response
            .status(201)
            .json({
                success: true,
                data: {
                    user,
                    accessToken,
                }
            });

    } catch (error) {
        console.error("error in login controller", error.message);
        response.status(500).json({ success: false, message: "Internal server error" });
    }
};

const register = async (request, response) => {
    const { nickname, password } = request.body;

    try {
        const result = await getUser(nickname);

        const isUserExists = result.rows.length > 0;

        if (isUserExists) {
            return response.status(400).json(formatErrorResponse("User exists"));
        }

        const tokenPayload = { nickname };

        const accessToken = generateAccessToken(tokenPayload);
        const refreshToken = jwt.sign(tokenPayload, process.env.REFRESH_TOKEN_SECRET);

        response.cookie(process.env.COOKIE_PATH, refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: process.env.COOKIE_PATH,
            maxAge: 7 * 24 * 3600 * 1000,
        });

        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        const hashedPassword = await bcrypt.hash(password, 10);

        await addNewUser(
            nickname,
            hashedPassword,
            hashedRefreshToken
        );

        const newUser = {
            nickname,
            password,
        };

        response
            .status(201)
            .json({
                success: true,
                data: {
                    newUser,
                    accessToken,
                }
            });

    } catch (error) {
        console.log(error);
        response
            .status(500)
            .json(formatErrorResponse("Internal serveer error"));
    }
};

module.exports = {
    refreshToken,
    register,
    logout,
    login
};