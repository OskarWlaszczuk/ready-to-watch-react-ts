const pool = require("../db");

const getUser = async (request, response) => {
    const user = await pool.query(
        "SELECT nickname, id FROM users WHERE id = $1",
        [request.userPayload.id]
    );

    response.json({ user: user.rows[0] });
};

module.exports = {
    getUser,
};