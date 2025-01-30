const express = require("express");
const router = express.Router();
const {
  saveInterview,
  getInterview,
  getInterviewQuestions,
  saveAnswers,
  saveUserAnswer,
  getFeedback // Add this new controller function
} = require("../controllers/interviewController");

// Route to save interview data
router.post("/saveInterview", saveInterview);

// Route to get interview data by mockId
router.get("/:mockId", getInterview);

// Route to get interview questions by mockId
router.get("/:mockId/questions", getInterviewQuestions);

// Route to save answers
router.put("/:mockId/answers", saveAnswers);

// Route to save user answers
router.post("/saveUserAnswer", saveUserAnswer);

// Route to get feedback data
router.get("/feedback/:mockId", getFeedback); // Add this new route

module.exports = router;