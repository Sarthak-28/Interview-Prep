import React, { useState, useContext } from 'react';
import { ResumeInfoContext } from '../context/ResumeInfoContext';
import { ArrowLeft, ArrowRight, Home } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

function FormSection() {
  const [activeFormIndex, setActiveFormIndex] = useState(1);
  const [enableNext, setEnableNext] = useState(true);
  const { resumeId } = useParams();
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);

  const handleNext = () => {
    if (activeFormIndex < 6) {
      setActiveFormIndex(activeFormIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (activeFormIndex > 1) {
      setActiveFormIndex(activeFormIndex - 1);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-5">
          <Link to="/dashboard">
            <button className="p-2 border rounded"><Home /></button>
          </Link>
        </div>
        <div className="flex gap-2">
          {activeFormIndex > 1 && (
            <button className="p-2 border rounded" onClick={handlePrevious}>
              <ArrowLeft />
            </button>
          )}
          <button
            disabled={!enableNext}
            className="p-2 border rounded flex gap-2"
            onClick={handleNext}
          >
            Next <ArrowRight />
          </button>
        </div>
      </div>

      {/* Render Active Form Section with Hardcoded Data */}
      {activeFormIndex === 1 && <div>Personal Details Form (Hardcoded Data)</div>}
      {activeFormIndex === 2 && <div>Summary Form (Hardcoded Data)</div>}
      {activeFormIndex === 3 && <div>Experience Form (Hardcoded Data)</div>}
      {activeFormIndex === 4 && <div>Education Form (Hardcoded Data)</div>}
      {activeFormIndex === 5 && <div>Skills Form (Hardcoded Data)</div>}
    </div>
  );
}

export default FormSection;
