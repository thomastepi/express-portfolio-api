const express = require("express");
const router = express.Router();

const sendEmail = require("../../controllers/sawyerCamp/contactUs.controller");

router.post("/send-email", sendEmail);

module.exports = router;
