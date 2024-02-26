const express = require("express");
const router = express.Router();

const addMessage = require("../controllers/portfolio.controller");

router.post("/add", addMessage);

module.exports = router;
