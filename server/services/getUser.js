const pool = require("../db");

const getUser = async (nickname) => {
    const user = await pool.query(
        "SELECT * FROM users WHERE nickname = $1",
        [nickname]
    );

    return user.rows[0];
};

module.exports = getUser