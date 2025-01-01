// controllers/interviewController.js
const Interview = require("../models/Interview");

exports.saveInterview = async (req, res) => {
  try {
    const {
      mockId,
      jsonMockResp,
      jobPosition,
      jobDesc,
      jobExperience,
      createdBy,
      createdAt,
    } = req.body;

    if (!mockId || !jsonMockResp || !jobPosition || !jobDesc || !jobExperience || !createdBy || !createdAt) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const newInterview = new Interview({
      mockId,
      jsonMockResp,
      jobPosition,
      jobDesc,
      jobExperience,
      createdBy,
      createdAt,
    });

    await newInterview.save();
    res.status(201).json({
      message: "Interview data saved successfully",
      mockId: newInterview.mockId, // Return mockId here
    });
  } catch (error) {
    console.error("Error saving interview data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getInterview = async (req, res) => {
  try {
    const { mockId } = req.params;

    const interview = await Interview.findOne({ mockId });
    if (!interview) {
      return res.status(404).json({ message: "Interview not found!" });
    }

    res.json(interview);
  } catch (error) {
    console.error("Error fetching interview data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


exports.getInterviewQuestions = async (req, res) => {
  try {
    const { mockId } = req.params;

    const interview = await Interview.findOne({ mockId });
    if (!interview) {
      return res.status(404).json({ message: "Interview not found!" });
    }

    res.json({
      mockId: interview.mockId,
      questions: interview.jsonMockResp, // Return only questions
    });
  } catch (error) {
    console.error("Error fetching interview questions:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


  