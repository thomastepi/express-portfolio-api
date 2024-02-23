const express = require("express");
import("node-fetch");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken");

const {
  login,
  register,
  update,
  build,
} = require("../controllers/resumeUser.controller");

router.post("/login", login);
router.post("/register", register);
router.patch("/update", authenticateToken, update);
router.post("/build", authenticateToken, build);

module.exports = router;
