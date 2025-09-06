const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateAccessToken = (userPayload) => {
    const accessToken = jwt.sign(
        userPayload,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
    );

    return accessToken;
};

module.exports = generateAccessToken;