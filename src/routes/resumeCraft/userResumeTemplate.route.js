const express = require("express");
const router = express.Router();
const {
  createUserResumeTemplate,
  getAllUserResumeTemplates,
  deleteTemplate,
} = require("../../controllers/resumeCraft/userResumeTemplate.controller");
const authenticateToken = require("../../middleware/authenticateToken");

router.post("/create", authenticateToken, createUserResumeTemplate);
router.get("/get", authenticateToken, getAllUserResumeTemplates);
router.delete("/delete/:id", authenticateToken, deleteTemplate);

module.exports = router;
