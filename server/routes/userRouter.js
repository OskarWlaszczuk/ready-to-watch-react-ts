require("dotenv").config();
const express = require("express");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");
const {getUser} = require("../controllers/user");

const authenticateToken = (request, response, next) => {
    const authHeader = request.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) {
        console.log("token doesn't exist");
        return response.sendStatus(401);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, userPayload) => {
        if (error) {
            console.log("token expired");
            return response.sendStatus(403);
        }

        request.userPayload = userPayload;
        next();
    });
};

userRouter.route("/")
    .get(authenticateToken, getUser);

module.exports = userRouter;