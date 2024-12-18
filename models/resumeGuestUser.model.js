const mongoose = require("mongoose");

const guestSessionSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { collection: "guest-sessions", timestamps: true }
);

const GuestSessionModel = mongoose.model("GuestSession", guestSessionSchema);

module.exports = GuestSessionModel;
