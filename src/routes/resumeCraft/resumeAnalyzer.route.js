const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  resumeAnalyzer,
  tailoredResume,
} = require("../../controllers/resumeCraft/resumeAnalyzer.controller");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

router.post("/analyze-resume", upload.single("file"), resumeAnalyzer);
router.post("/tailored-resume", upload.single("file"), tailoredResume);

module.exports = router;
