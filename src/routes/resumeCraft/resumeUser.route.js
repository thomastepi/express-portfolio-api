const express = require("express");
import("node-fetch");
const router = express.Router();
const authenticateToken = require("../../middleware/authenticateToken");
const pickLimiter = require("../../middleware/userRateLimit");
const reCAPTCHAVerify = require("../../middleware/authenticateRecaptcha");
const {
  login,
  googleOAuth,
  register,
  update,
  updateEmail,
  build,
  guestSession,
  forgetPassword,
  resetPassword,
  deleteUser,
} = require("../../controllers/resumeCraft/resumeUser.controller");
const ensureGuestId = require("../../middleware/ensureGuestId");

router.post("/login", reCAPTCHAVerify, login);
router.post("/google-oauth", googleOAuth);
router.post("/register", register);
router.patch("/update", authenticateToken, update);
router.patch("/update-email", authenticateToken, updateEmail);
router.post("/forget-password", reCAPTCHAVerify, forgetPassword);
router.post("/reset-password", reCAPTCHAVerify, resetPassword);
router.delete("/delete-user", authenticateToken, deleteUser);
router.post("/build", authenticateToken, ensureGuestId, pickLimiter, build);
router.post("/guest-log", guestSession);

module.exports = router;
