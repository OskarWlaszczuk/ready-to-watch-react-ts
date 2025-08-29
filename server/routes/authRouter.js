const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const util = require("util");
const verifyJwt = util.promisify(jwt.verify);
const {
    refreshToken,
    register,
    logout,
    login
} = require("../controllers/auth");
require("dotenv").config();

const authRouter = express.Router();

const validateRefreshToken = async (token) => {
    if (!token) {
        return { valid: false, status: 400, code: "MISSING_TOKEN", message: "Refresh token is required" };
    }

    try {
        const payload = await verifyJwt(token, process.env.REFRESH_TOKEN_SECRET);

        const result = await pool.query(
            "SELECT refresh_token_hash FROM users WHERE nickname = $1",
            [payload.nickname]
        );

        const isUserExists = result.rows.length > 0;
        if (!isUserExists) {
            return {
                valid: false,
                status: 404,
                code: "USER_NOT_FOUND",
                message: "User not found",
            }
        }

        const hashedToken = result.rows[0].refresh_token_hash;
        const hasTokenStored = !!hashedToken;
        if (!hasTokenStored) {
            return {
                valid: false,
                status: 401,
                code: "TOKEN_NOT_STORED",
                message: "Session expired, please log in again",
            }
        }

        const isTokenValid = await bcrypt.compare(token, hashedToken);
        if (!isTokenValid) {
            return {
                valid: false,
                status: 401,
                code: "INVALID_TOKEN",
                message: "Refresh token invalid or expired",
            }
        }

        return { valid: true, payload };

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return { valid: false, status: 401, code: "JWT_EXPIRED", message: "Token expired" };
        }
        if (error.name === "JsonWebTokenError") {
            return { valid: false, status: 403, code: "INVALID_JWT", message: "Invalid token" };
        }
        throw error;
    }
};

const verifyRefreshToken = async (request, response, next) => {
    try {
        const { token } = request.body;
        const result = await validateRefreshToken(token);

        if (!result.valid) {
            return response
                .status(result.status)
                .json({
                    success: false,
                    code: result.code,
                    message: result.message
                });
        }

        request.user = result.payload;
        next();

    } catch (error) {
        console.error("Error in verifyToken middleware:", error.message);
        return response.status(500).json({
            success: false,
            code: "SERVER_ERROR",
            message: "Internal server error"
        });
    }
};

authRouter.route("/login").post(login);
authRouter.route("/logout").delete(verifyRefreshToken, logout);
authRouter.route("/register").post(register);
authRouter.route("/refresh").post(verifyRefreshToken, refreshToken);

module.exports = authRouter;