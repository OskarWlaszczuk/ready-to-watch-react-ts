const express = require("express");
const {
    refreshToken,
    register,
    logout,
    login
} = require("../controllers/auth");
const authRouter = express.Router();

authRouter.route("/login").post(login);
authRouter.route("/logout").delete(logout);
authRouter.route("/register").post(register);
authRouter.route("/refresh").post(refreshToken);


module.exports = authRouter;