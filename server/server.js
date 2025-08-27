const express = require('express');
const cors = require("cors");
const app = express();
const path = require("path");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.use("/auth", authRouter);
app.use("/user", userRouter);

app.listen(5000, () => {
    console.log("server is listening on port 5000...");
});