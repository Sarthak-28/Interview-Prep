// In backend/routes/resumeRoutes.js
const express = require("express");
const router = express.Router();
const { createResume, getResume, updateResume, getResumesByUser } = require("../controllers/resumeController");

// Route to create a new resume
router.post("/create", createResume);

// Route to get resumes by user email (add this route first)
router.get("/user/:userEmail", getResumesByUser);

// Route to get resume data by resumeId
router.get("/:resumeId", getResume);

// Route to update resume
router.put("/updateResume/:resumeId", updateResume);

module.exports = router;
