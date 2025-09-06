require("dotenv").config();
const express = require("express");
const secureUserRouter = express.Router();
const jwt = require("jsonwebtoken");
const { getUserNickname } = require("../controllers/secureUser");
const util = require("util");
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

secureUserRouter.route("/")
    .get(authenticateToken, getUserNickname);

module.exports = secureUserRouter;