const mongoose = require("mongoose");

const userTemplateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    html: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "user-resume-templates", timestamps: true }
);

module.exports = mongoose.model("UserTemplate", userTemplateSchema);
