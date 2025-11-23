const runImageAnalysis = require("../../lib/sawerCamp/runImageAnalysis");
const runAiCropPlanner = require("../../lib/sawerCamp/runAiCropPlanner");

async function analyzeImage(req, res) {
  const file = req.file;
  const { description } = req.body;
  if (!file) {
    return res.status(400).json({ error: "No image uploaded." });
  }

  const allowedTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
    "image/gif",
  ];
  if (!allowedTypes.includes(file.mimetype)) {
    return res.status(400).json({
      error: "Unsupported file type. Please upload PNG, JPEG, WEBP or GIF.",
    });
  }

  const base64Image = file.buffer.toString("base64");
  const mimeType = file.mimetype;

  try {
    const analysisResult = await runImageAnalysis(
      base64Image,
      mimeType,
      description
    );
    res.status(200).json(analysisResult);
  } catch (error) {
    console.error("Error during image analysis:", error);
    res.status(500).json({ error: error.message });
  }
}

async function aiCropPlanner(req, res) {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "No prompt provided." });
  }
  try {
    const cropPlan = await runAiCropPlanner(prompt);
    res.status(200).json(cropPlan);
  } catch (error) {
    console.error("Error during AI crop planning:", error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { analyzeImage, aiCropPlanner };
