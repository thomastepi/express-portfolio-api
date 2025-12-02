const { runResumeAnalyzer } = require("../../lib/resumeCraft/runResponses");
const {
  generateResumeAnalyzerPrompt,
  generateTailoredResumePrompt,
} = require("../../utils/resumeCraft/prompts");
const { sendError } = require("../../utils/resumeCraft/htttpErrors");

async function resumeAnalyzer(req, res) {
  const file = req.file;
  const { jobDescription } = req.body;
  if (!file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  if (file.size > 50 * 1024 * 1024) {
    return res.status(400).json({ error: "File size is too large." });
  }

  const allowedTypes = ["application/pdf"];
  if (!allowedTypes.includes(file.mimetype)) {
    return res.status(400).json({ error: "Unsupported file type." });
  }

  const base64String = file.buffer.toString("base64");
  const filename = file.originalname;

  try {
    const analysisResult = await runResumeAnalyzer(
      generateResumeAnalyzerPrompt(jobDescription),
      base64String,
      filename
    );
    res.status(200).json(analysisResult);
  } catch (error) {
    console.log("Error during resume analysis: ", error);
    sendError(res, error);
  }
}

const tailoredResume = async (req, res) => {
  file = req.file;
  const { jobDescription, prevAnalysis } = req.body;

  if (!file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  if (file.size > 50 * 1024 * 1024) {
    return res.status(400).json({ error: "File size is too large." });
  }

  const allowedTypes = ["application/pdf"];
  if (!allowedTypes.includes(file.mimetype)) {
    return res.status(400).json({ error: "Unsupported file type." });
  }

  const base64String = file.buffer.toString("base64");
  const filename = file.originalname;
  try {
    const tailoredResumeData = await runResumeAnalyzer(
      generateTailoredResumePrompt(jobDescription, prevAnalysis),
      base64String,
      filename
    );
    res.status(200).json(tailoredResumeData);
  } catch (error) {
    console.log("Error during resume analysis: ", error);
    sendError(res, error);
  }
};

module.exports = { resumeAnalyzer, tailoredResume };
