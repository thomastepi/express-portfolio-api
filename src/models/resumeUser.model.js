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

module.exports = UserModel;
