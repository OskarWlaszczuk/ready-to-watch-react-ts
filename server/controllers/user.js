const pool = require("../db");

const getUser = async (request, response) => {
    const user = await pool.query(
        "SELECT nickname, id FROM users WHERE nickname = $1",
        [request.userPayload.nickname]
    );

    response.json({ user: user.rows[0] });
};

module.exports = {
    getUser,
};