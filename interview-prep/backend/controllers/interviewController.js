const Interview = require("../models/Interview");
const UserAnswer = require("../models/UserAnswer");

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
      answers: [] // Initialize empty answers array
    });

    await newInterview.save();
    res.status(201).json({
      message: "Interview data saved successfully",
      mockId: newInterview.mockId,
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
      questions: interview.jsonMockResp,
    });
  } catch (error) {
    console.error("Error fetching interview questions:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.saveAnswers = async (req, res) => {
  try {
    const { mockId } = req.params;
    const { answers } = req.body;

    const interview = await Interview.findOneAndUpdate(
      { mockId },
      { $set: { answers } },
      { new: true }
    );

    if (!interview) {
      return res.status(404).json({ message: "Interview not found!" });
    }

    res.json({ 
      message: "Answers saved successfully",
      updatedInterview: interview
    });
  } catch (error) {
    console.error("Error saving answers:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.saveUserAnswer = async (req, res) => {
  try {
    const { mockIdRef, userEmail, createdAt, answers } = req.body;

    const newUserAnswer = new UserAnswer({
      mockIdRef,
      userEmail,
      createdAt,
      answers, // This will be an array of objects containing question, correctAns, userAns, feedback, and rating
    });

    await newUserAnswer.save();
    res.status(201).json({ message: "User answers saved successfully" });
  } catch (error) {
    console.error("Error saving user answers:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getFeedback = async (req, res) => {
  try {
    const { mockId } = req.params;

    // Fetch the user answers based on mockId
    const userAnswers = await UserAnswer.find({ mockIdRef: mockId });

    if (!userAnswers || userAnswers.length === 0) {
      return res.status(404).json({ message: "Feedback not found!" });
    }

    // Format the feedback data
    const feedbackData = {
      overallRating: "4.5", // You can calculate this based on your logic
      questions: userAnswers[0].answers.map(answer => ({
        question: answer.question,
        userAnswer: answer.userAns,
        correctAnswer: answer.correctAns,
        feedback: answer.feedback,
        rating: answer.rating,
      })),
    };

    res.json(feedbackData);
  } catch (error) {
    console.error("Error fetching feedback data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};