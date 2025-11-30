require("dotenv").config();
const mongoose = require("mongoose");
const { JobModel } = require("./src/models/sawyerCamp/aiLab.model");
const runAiCropPlanner = require("./src/lib/sawerCamp/runAiCropPlanner");

async function processNextJob() {
  const job = await JobModel.findOneAndUpdate(
    { type: "cropPlanner", status: "pending" },
    { status: "processing" },
    { new: true }
  );

  if (!job) {
    await new Promise((r) => setTimeout(r, 2000));
    return;
  }

  try {
    const result = await runAiCropPlanner(job.prompt);
    job.status = "done";
    job.result = result;
    await job.save();
  } catch (err) {
    job.status = "error";
    job.error = err.message;
    await job.save();
  }
}

async function main() {
  mongoose.connect(process.env.MONGODB_URI);
  const connection = mongoose.connection;
  connection.on("connected", () => {
    console.log("MongoDB connected successfully");
  });
  connection.on("error", (e) => {
    console.log("MongoDb connection failed", e);
  });
  while (true) {
    await processNextJob();
  }
}

main().catch((e) => {
  console.error("Worker crashed", e);
  process.exit(1);
});
