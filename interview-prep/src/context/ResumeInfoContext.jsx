import { createContext, useState } from 'react';

export const ResumeInfoContext = createContext(null);

export const ResumeInfoProvider = ({ children }) => {
  const [resumeInfo, setResumeInfo] = useState({
    personalDetails: {},
    summary: '',
    experience: [],
    education: [],
    skills: [],
    themeColor: '#000000', // Default theme color
  });

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      {children}
    </ResumeInfoContext.Provider>
  );
};