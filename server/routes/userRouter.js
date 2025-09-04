require("dotenv").config();
const express = require("express");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");
const { getUser } = require("../controllers/user");
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

userRouter.route("/")
    .get(authenticateToken, getUser);

module.exports = userRouter;