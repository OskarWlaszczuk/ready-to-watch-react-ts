const express = require('express');
const cors = require("cors");
const app = express();
const path = require("path");
const authRouter = require("./routes/authRouter");
const secureUserRouter = require("./routes/secureUserRouter");
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.use("/api/auth", authRouter);
app.use("/api/secure/user", secureUserRouter);

app.listen(5000, () => {
    console.log("server is listening on port 5000...");
});