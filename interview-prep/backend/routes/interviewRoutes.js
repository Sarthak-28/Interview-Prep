const express = require("express");
const router = express.Router();
const {
  saveInterview,
  getInterview,
  getInterviewQuestions, // New controller function
} = require("../controllers/interviewController");

// Route to save interview data
router.post("/saveInterview", saveInterview);

// Route to get interview data by mockId
router.get("/:mockId", getInterview);

// Route to get interview questions by mockId
router.get("/:mockId/questions", getInterviewQuestions);

module.exports = router;
