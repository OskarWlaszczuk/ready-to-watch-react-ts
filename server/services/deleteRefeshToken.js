const pool = require("../db");

const deleteRefeshToken = async (nickname) => {
    await pool.query(
        "UPDATE users SET refresh_token_hash = NULL WHERE nickname = $1",
        [nickname]
    );
};

module.exports = deleteRefeshToken;