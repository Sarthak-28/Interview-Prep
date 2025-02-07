const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  userEmail: { type: String, required: true },
  resumeId: { type: String, required: true, unique: true },
  userName: { type: String, default: '' },
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  jobTitle: { type: String, default: '' },
  address: { type: String, default: '' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  summary: { type: String, default: '' },

  experience: {
    type: [
      {
        title: { type: String },
        companyName: { type: String },
        city: { type: String },
        state: { type: String },
        startDate: { type: String },
        endDate: { type: String },
        workSummery: { type: String }
      }
    ],
    default: []
  },

  education: {
    type: [
      {
        universityName: { type: String },
        degree: { type: String },
        major: { type: String },
        startDate: { type: String },
        endDate: { type: String },
        description: { type: String }
      }
    ],
    default: []
  },

  skills: {
    type: [
      {
        name: { type: String },
        rating: { type: String },
      }
    ],
    default: []
  },
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Resume", resumeSchema);
