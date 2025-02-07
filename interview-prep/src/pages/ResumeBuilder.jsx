import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import FormSection from '../resumeComponents/FormSection';
import ResumePreview from '../resumeComponents/ResumePreview';
import { ResumeInfoContext } from '../context/ResumeInfoContext';

// Default resume object to ensure all keys exist
const defaultResume = {
  resumeId: '',
  title: '',
  userName: '',
  firstName: '',
  lastName: '',
  jobTitle: '',
  address: '',
  phone: '',
  email: '',
  summary: '',
  experience: [],
  education: [],
  skills: [],
};

const ResumeBuilder = () => {
  const location = useLocation();
  const navState = location.state; // Get data passed from the Resume page

  // Initialize resumeInfo with default values instead of an empty object
  const [resumeInfo, setResumeInfo] = useState(defaultResume);

  useEffect(() => {
    if (navState && navState.resumeId) {
      // Update the context with resumeId and title from navigation state, keeping other defaults
      setResumeInfo((prev) => ({
        ...prev,
        resumeId: navState.resumeId,
        title: navState.title,
      }));
    }
  }, [navState]);

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div className="flex h-screen p-4 gap-4">
        {/* Form Section */}
        <div className="w-1/2 overflow-y-auto p-4">
          <FormSection />
        </div>

        {/* Resume Preview */}
        <div className="w-1/2 overflow-y-auto p-4">
          <ResumePreview />
        </div>
      </div>
    </ResumeInfoContext.Provider>
  );
};

export default ResumeBuilder;
