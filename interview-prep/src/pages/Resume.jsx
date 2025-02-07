import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'; 
import { useUser } from "@clerk/clerk-react";
import Header from '../components/Header';

const Resume = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resumeTitle, setResumeTitle] = useState('');
  const { user } = useUser();
  const navigate = useNavigate();

  const handleCreateResume = async () => {
    if (resumeTitle.trim()) {
      const resumeId = uuidv4(); 
      const userEmail = user?.primaryEmailAddress?.emailAddress

      try {
        const response = await axios.post('http://localhost:5000/resume/create', {
          title: resumeTitle,
          userEmail,
          resumeId,
        });

        if (response.status === 201) {
          // Redirect to ResumeBuilder.jsx with resumeId and resumeTitle
          navigate('/resume-builder', { state: { title: resumeTitle, resumeId } });
        }
      } catch (error) {
        console.error("Error creating resume:", error);
      }
    }
  };

  return (
    <>
      <Header />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">My Resumes</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Placeholder for existing resumes */}
          <div className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold">Resume No.1</h2>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create New Resume
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Create New Resume</h2>
              <input
                type="text"
                placeholder="Enter Resume Title"
                value={resumeTitle}
                onChange={(e) => setResumeTitle(e.target.value)}
                className="border p-2 w-full mb-4"
              />
              <button
                onClick={handleCreateResume}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Create
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Resume;