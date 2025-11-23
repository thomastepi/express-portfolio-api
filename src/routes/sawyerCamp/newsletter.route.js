const express = require("express");
const router = express.Router();
const sendEmail = require("../../controllers/sawyerCamp/newsletter.controller");

router.post("/send-email", sendEmail);

module.exports = router;
