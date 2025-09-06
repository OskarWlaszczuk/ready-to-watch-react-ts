const pool = require("../db");

const addNewUser = async (nickname, hashedPassword, hashedRefreshToken) => {
    await pool.query(
        "INSERT INTO users (nickname, password, refresh_token_hash) VALUES($1, $2, $3) RETURNING nickname",
        [nickname, hashedPassword, hashedRefreshToken]
    );
};

module.exports = addNewUser;