const pool = require("../db");

const getUser = async (nickname) => (
    await pool.query(
        "SELECT * FROM users WHERE nickname = $1",
        [nickname]
    )
);

module.exports = getUser