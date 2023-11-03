const express = require("express");
const CLicenseVerify = require("../controllers/licenseVerify.controller");

const licenseVerifyRouter = express.Router();

licenseVerifyRouter.post("/license_verify", CLicenseVerify);

module.exports = licenseVerifyRouter;
