const express = require("express");
import("node-fetch");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken");
const userRateLimit = require("../middleware/userRateLimit");
const reCAPTCHAVerify = require("../middleware/authenticateRecaptcha");

const {
  login,
  googleOAuth,
  register,
  update,
  build,
  guestSession,
} = require("../controllers/resumeUser.controller");

router.post("/login", reCAPTCHAVerify, login);
router.post("/google-oauth", googleOAuth);
router.post("/register", register);
router.patch("/update", authenticateToken, update);
router.post("/build", authenticateToken, userRateLimit, build);
router.post("/guest-log", guestSession);

module.exports = router;
