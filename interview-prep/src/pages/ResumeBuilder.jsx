import React from 'react';
import FormSection from '../reumeComponents/FormSection';
import ResumePreview from '../reumeComponents/ResumePreview';
import { ResumeInfoContext } from '../context/ResumeInfoContext';

const ResumeBuilder = () => {
  const [resumeInfo, setResumeInfo] = React.useState({
    personalDetails: {},
    summary: '',
    experience: [],
    education: [],
    skills: [],
    themeColor: '#000000', // Default theme color
  });

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div className="flex h-screen p-4 gap-4">
        {/* Left Column: Form Section */}
        <div className="w-1/2 overflow-y-auto p-4">
          <FormSection />
        </div>

        {/* Right Column: Resume Preview */}
        <div className="w-1/2 overflow-y-auto p-4">
          <ResumePreview />
        </div>
      </div>
    </ResumeInfoContext.Provider>
  );
};

export default ResumeBuilder;