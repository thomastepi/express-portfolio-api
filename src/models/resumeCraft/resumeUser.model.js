const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
    },
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    email: { type: String, default: "" },
    mobileNumber: { type: String, default: "" },
    portfolio: { type: String, default: "" },
    summary: { type: String, default: "" },
    address: { type: String, default: "" },
    education: { type: Array, default: [] },
    skills: { type: Array, default: [] },
    experience: { type: Array, default: [] },
    projects: { type: Array, default: [] },
    certifications: { type: Array, default: [] },
    languages: { type: Array, default: [] },
  },
  { collection: "resume-users", timestamps: true, strict: false }
);

const UserModel = mongoose.model("User", userSchema);

const tokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["reset", "verify", "refresh"],
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    usedAt: {
      type: Date,
      default: null,
    },
  },
  { collection: "resume-user-tokens", timestamps: true }
);

const TokenModel = mongoose.model("Token", tokenSchema);

module.exports = { UserModel, TokenModel };
