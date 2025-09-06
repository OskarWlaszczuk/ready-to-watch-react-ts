const pool = require("../db");

const saveRefreshToken = async (nickname, hashedRefreshToken) => {
    await pool.query(
        "UPDATE users SET refresh_token_hash = $1 WHERE nickname = $2",
        [hashedRefreshToken, nickname]
    );
};

module.exports = saveRefreshToken;