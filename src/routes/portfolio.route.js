const express = require("express");
const router = express.Router();
const reCAPTCHAVerify = require("../middleware/authenticateRecaptcha");

const addMessage = require("../controllers/portfolio.controller");

router.post("/add", reCAPTCHAVerify, addMessage);

module.exports = router;
