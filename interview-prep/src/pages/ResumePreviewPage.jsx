import React, { useContext, useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ResumeInfoContext } from '../context/ResumeInfoContext';
import ResumePreview from '../resumeComponents/ResumePreview';
import ReactToPdf from 'react-to-pdf';
import axios from 'axios';
import { toast } from 'react-toastify';
import Header from '../components/Header';

function ResumePreviewPage() {
  const { resumeId: routeResumeId } = useParams();
  const navigate = useNavigate();
  const context = useContext(ResumeInfoContext);
  const [resumeInfo, setResumeInfo] = useState(context?.resumeInfo || null);
  const resumeRef = useRef(null);
  const [refReady, setRefReady] = useState(false);

  // Check if the resumeRef is attached
  useEffect(() => {
    if (resumeRef.current) setRefReady(true);
  }, []);

  // Fetch resume data if not available from context
  useEffect(() => {
    if (!resumeInfo) {
      const fetchResumeData = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/resume/${routeResumeId}`);
          setResumeInfo({ ...response.data, resumeId: routeResumeId });
        } catch (error) {
          toast.error('Failed to load resume data');
          console.error(error);
        }
      };
      fetchResumeData();
    }
  }, [resumeInfo, routeResumeId]);

  // Loading state while resume data is being fetched
  if (!resumeInfo) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Print handler
  const handlePrint = () => window.print();

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div className="overflow-x-hidden">
        {/* Full-width Header Section with Back Button */}
        <div className="w-full no-print">
          <div className="px-8 py-4">
            <button
              onClick={() => navigate('/resume')}
              className="text-blue-500 hover:text-blue-600"
            >
              &larr; Back
            </button>
          </div>
          <Header />
        </div>

        {/* Centered Content Section */}
        <div className="p-8 max-w-4xl mx-auto">
          {/* Non-PDF Elements */}
          <div className="no-print">
            <div className="my-10 text-center">
              <h2 className="text-2xl font-medium">Your Resume is Ready! 🎉</h2>
              <p className="text-gray-400 mt-2">Download your resume below.</p>
            </div>
          </div>

          {/* Resume PDF Content */}
          <div ref={resumeRef} className="bg-white">
            <ResumePreview />
          </div>

          {/* Action Buttons */}
          <div className="no-print flex justify-center gap-4 mt-6">
            {refReady && (
              <ReactToPdf
                targetRef={resumeRef}
                filename="resume.pdf"
                options={{ orientation: 'portrait', unit: 'in', format: 'letter' }}
              >
                {({ toPdf }) => (
                  <button
                    onClick={toPdf}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
                  >
                    Download PDF
                  </button>
                )}
              </ReactToPdf>
            )}
            <button
              onClick={handlePrint}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded transition-colors"
            >
              Print
            </button>
          </div>
        </div>
      </div>
    </ResumeInfoContext.Provider>
  );
}

export default ResumePreviewPage;
