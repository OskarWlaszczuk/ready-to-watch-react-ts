const generateAccessToken = require("../services/generateAccessToken");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateTokensWithHash = async (payload) => {
    const accessToken = generateAccessToken(payload);
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    return { accessToken, refreshToken, hashedRefreshToken };
};

module.exports = generateTokensWithHash;