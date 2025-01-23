const express = require("express");
const router = express.Router();
const {
  saveInterview,
  getInterview,
  getInterviewQuestions,
  saveAnswers 
} = require("../controllers/interviewController");

// Route to save interview data
router.post("/saveInterview", saveInterview);

// Route to get interview data by mockId
router.get("/:mockId", getInterview);

// Route to get interview questions by mockId
router.get("/:mockId/questions", getInterviewQuestions);

// Route to save answers
router.put("/:mockId/answers", saveAnswers); 

module.exports = router;