const express = require("express");
const router = express.Router();
const { createResume, getResume, updateResume  } = require("../controllers/resumeController");

// Route to create a new resume
router.post("/create", createResume);

// Route to get resume data by resumeId
router.get("/:resumeId", getResume);

router.put("/updateResume/:resumeId", updateResume);


module.exports = router;