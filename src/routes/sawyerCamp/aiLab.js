const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  analyzeImage,
  aiCropPlanner,
} = require("../../controllers/sawyerCamp/aiLab");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

router.post("/analyze-image", upload.single("image"), analyzeImage);
router.post("/ai-crop-planner", aiCropPlanner);

module.exports = router;
