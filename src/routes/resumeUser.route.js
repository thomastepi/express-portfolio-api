const express = require("express");
import("node-fetch");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken");
const userRateLimit = require("../middleware/userRateLimit");
const reCAPTCHAVerify = require("../middleware/authenticateRecaptcha");

const {
  login,
  register,
  update,
  build,
  guestSession,
} = require("../controllers/resumeUser.controller");

router.post("/login", reCAPTCHAVerify, login);
router.post("/register", reCAPTCHAVerify, register);
router.patch("/update", authenticateToken, update);
router.post("/build", authenticateToken, userRateLimit, build);
router.post("/guest-log", guestSession);

module.exports = router;
