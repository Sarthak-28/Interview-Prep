import React from 'react';

function ResumePreview() {
  const resumeInfo = {
    themeColor: '#C65BCF',
    experience: [{ job: "Software Engineer at ABC Corp (2019 - Present)" }],
    education: [{ degree: "Bachelor of Computer Science, XYZ University (2015 - 2019)" }],
    skills: ["JavaScript", "React", "Node.js", "MongoDB"]
  };

  return (
    <div className="shadow-lg h-full p-14 border-t-[20px]" style={{ borderColor: resumeInfo.themeColor }}>
      {/* Personal Detail */}
      <div>
        <h2>Personal Details</h2>
        <p>Name: John Doe</p>
        <p>Email: john@example.com</p>
        <p>Phone: +1234567890</p>
      </div>

      {/* Summary */}
      <div>
        <h2>Summary</h2>
        <p>Experienced software developer with a passion for building web applications.</p>
      </div>

      {/* Professional Experience */}
      {resumeInfo.experience.length > 0 && (
        <div>
          <h2>Experience</h2>
          {resumeInfo.experience.map((exp, index) => (
            <p key={index}>{exp.job}</p>
          ))}
        </div>
      )}

      {/* Education */}
      {resumeInfo.education.length > 0 && (
        <div>
          <h2>Education</h2>
          {resumeInfo.education.map((edu, index) => (
            <p key={index}>{edu.degree}</p>
          ))}
        </div>
      )}

      {/* Skills */}
      {resumeInfo.skills.length > 0 && (
        <div>
          <h2>Skills</h2>
          <p>{resumeInfo.skills.join(", ")}</p>
        </div>
      )}
    </div>
  );
}

export default ResumePreview;
