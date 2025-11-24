const mongoose = require("mongoose");

const jobSchema = mongoose.Schema(
  {
    type: { type: String, required: true },
    prompt: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "done", "error"],
      default: "pending",
    },
    result: { type: mongoose.Schema.Types.Mixed },
    error: { type: String },
  },
  { collection: "ai-crop-planner-job", timestamps: true, strict: false }
);

const JobModel = mongoose.model("Job", jobSchema);

module.exports = { JobModel };
