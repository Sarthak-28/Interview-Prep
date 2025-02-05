const express = require("express");
const router = express.Router();
const { createResume, getResume } = require("../controllers/resumeController");

// Route to create a new resume
router.post("/create", createResume);

// Route to get resume data by resumeId
router.get("/:resumeId", getResume);

module.exports = router;