const getUser = require("../services/getUser");

const getUserNickname = async (request, response) => {
    console.log("Getting user...");
    const { payload } = request;

    const user = await getUser(payload.nickname);
    console.log(`użytkownik uzyskany`);
    response.status(200).json({ user: user.rows[0] });
};

module.exports = {
    getUserNickname,
};