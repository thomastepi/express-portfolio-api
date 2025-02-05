const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    lastName: { type: String, default: "lastName" },
    location: { type: String, default: "myCity" },
  },
  {
    collection: "book-mart-users",
    timestamps: true,
  }
);

const BookUser = mongoose.model("BookUser", schema);

module.exports = BookUser;