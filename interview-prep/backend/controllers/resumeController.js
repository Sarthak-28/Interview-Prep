const Resume = require("../models/Resume");

exports.createResume = async (req, res) => {
  try {
    const { title, userEmail, resumeId } = req.body;

    if (!title || !userEmail || !resumeId) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const newResume = new Resume({
      title,
      userEmail,
      resumeId
    });

    await newResume.save();
    res.status(201).json({ message: "Resume created successfully", resumeId });
  } catch (error) {
    console.error("Error creating resume:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getResume = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findOne({ resumeId });
    if (!resume) {
      return res.status(404).json({ message: "Resume not found!" });
    }

    res.json(resume);
  } catch (error) {
    console.error("Error fetching resume data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateResume = async (req, res) => {
    try {
        const { resumeId } = req.params;
        const updatedData = req.body.data;

        const updatedResume = await Resume.findOneAndUpdate(
            { resumeId: resumeId }, 
            { $set: updatedData },
            { new: true, runValidators: true }
        );

        if (!updatedResume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        res.json({ message: 'Resume updated successfully', updatedResume });
    } catch (error) {
        res.status(500).json({ message: 'Error updating resume', error });
    }
};

