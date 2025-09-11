require("dotenv").config();
const express = require("express");
const secureUserRouter = express.Router();
const jwt = require("jsonwebtoken");
const { getUserNickname, getUserAccontDate } = require("../controllers/secureUser");
const util = require("util");
const getUser = require("../services/getUser");
const verifyJwt = util.promisify(jwt.verify);

const authenticateToken = async (request, response, next) => {
    const authHeader = request.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1];

    if (!accessToken) {
        console.log("token doesn't exist");
        return response
            .status(401)
            .json({
                success: false,
                message: "Unathorized"
            });
    }

    try {
        const payload = await verifyJwt(accessToken, process.env.ACCESS_TOKEN_SECRET);
        request.payload = payload;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return { valid: false, status: 403, code: "JWT_EXPIRED", message: "Access token expired, refresh it" };
        }
    }
};

const isUserExists = async (request, response, next) => {
    console.log('Checking is user exists...');
    const { payload } = request;

    const result = await getUser(payload.nickname);
    if (result.rows.length === 0) {
        return response
            .status(400)
            .json({ success: false, message: "User doesn't exist" });
    }

    next();
};

secureUserRouter.route("/nickname").get(authenticateToken, isUserExists, getUserNickname);
secureUserRouter.route("/accountDate").get(authenticateToken, isUserExists, getUserAccontDate);

module.exports = secureUserRouter;