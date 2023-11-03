const express = require("express");
const cors = require("cors");
const licenseVerifyRouter = require("./routes/licenseVerify.route");
const app = express();

app.use(cors());
app.use(express.json());

app.use(licenseVerifyRouter);

module.exports = app;
