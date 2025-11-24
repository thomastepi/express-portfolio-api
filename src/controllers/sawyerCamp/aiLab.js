const runImageAnalysis = require("../../lib/sawerCamp/runImageAnalysis");
const runAiCropPlanner = require("../../lib/sawerCamp/runAiCropPlanner");
const { JobModel } = require("../../models/sawyerCamp/aiLab.model");

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

async function startCropPlannerJob(req, res) {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "No prompt provided." });
  }

  try {
    const job = await JobModel.create({
      type: "cropPlanner",
      prompt,
      status: "pending",
      startedAt: new Date(),
    });

    res.status(202).json({ jobId: job._id });
  } catch (e) {
    console.log("Error creating job: ", e);
    res
      .status(500)
      .json({ error: "Something went wrong. Please try again later" });
  }
}

async function getJobStatus(req, res) {
  const { jobId } = req.params;
  const job = await JobModel.findById(jobId);
  if (!job) {
    return res.status(400).json({ error: "Job not found" });
  }

  res.json({ status: job.status, result: job.result, error: job.error });
}

module.exports = {
  analyzeImage,
  aiCropPlanner,
  startCropPlannerJob,
  getJobStatus,
};
