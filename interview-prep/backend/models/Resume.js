const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  userEmail: { type: String, required: true },
  resumeId: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Resume", resumeSchema);