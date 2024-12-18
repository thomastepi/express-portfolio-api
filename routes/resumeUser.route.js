const express = require("express");
import("node-fetch");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken");

const {
  login,
  register,
  update,
  build,
  guestSession,
} = require("../controllers/resumeUser.controller");

router.post("/login", login);
router.post("/register", register);
router.patch("/update", authenticateToken, update);
router.post("/build", authenticateToken, build);
router.post("/guest-log", guestSession);

module.exports = router;
