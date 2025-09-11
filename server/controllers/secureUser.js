const getUser = require("../services/getUser");

const getUserNickname = async (request, response) => {
    console.log("Getting user nickname...");
    const { payload } = request;

    const result = await getUser(payload.nickname)

    response.status(200).json({ user: result.rows[0].nickname });
};

const getUserAccontDate = async (request, response) => {
    console.log("Getting user account date...");
    const { payload } = request;

    const result = await getUser(payload.nickname)

    response.status(200).json({ user: result.rows[0].accountDate });
};

module.exports = {
    getUserNickname,
    getUserAccontDate,
};