import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'; 
import { useUser } from "@clerk/clerk-react";
import Header from '../components/Header';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MoreVertical, Edit as EditIcon } from 'lucide-react';

const Resume = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [resumeTitle, setResumeTitle] = useState('');
  const [existingResumes, setExistingResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

  // State to track which resume's dropdown is open (by resumeId)
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/resume/user/${user?.primaryEmailAddress?.emailAddress}`
        );
        setExistingResumes(response.data);
      } catch (error) {
        toast.error('Failed to load resumes');
      }
    };
    if (user) fetchResumes();
  }, [user]);

  const handleCreateResume = async () => {
    if (!resumeTitle.trim()) {
      toast.error('Please enter a resume title');
      return;
    }
    setLoading(true);
    try {
      const resumeId = uuidv4();
      const response = await axios.post('http://localhost:5000/resume/create', {
        title: resumeTitle,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        resumeId,
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.primaryEmailAddress?.emailAddress || ''
      });
      if (response.status === 201) {
        toast.success('Resume created successfully');
        navigate('/resume-builder', { 
          state: { 
            resumeId,
            initialData: response.data 
          }
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create resume');
    } finally {
      setLoading(false);
      setOpenDialog(false);
    }
  };

  const handleAction = (action, resume) => {
    switch (action) {
      case 'Edit':
        navigate('/resume-builder', { state: { resumeId: resume.resumeId, initialData: resume } });
        break;
      case 'View':
        // Implement view functionality here.
        break;
      case 'Download':
        // Implement download functionality here.
        break;
      case 'Delete':
        // Implement delete functionality here.
        break;
      default:
        break;
    }
    // Close the dropdown after any action.
    setActiveDropdown(null);
  };

  return (
    <>
      <Header />
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Resumes</h1>
          <p className="text-sm text-gray-500">Start creating your AI-powered resume for your next job role</p>
        </div>
        {/* Resume Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* New Resume Card */}
          <div 
            onClick={() => setOpenDialog(true)}
            className="border border-dashed border-gray-400 p-6 rounded-xl hover:shadow-lg transition transform hover:scale-105 cursor-pointer flex flex-col justify-center items-center bg-white"
          >
            <div className="text-4xl text-gray-500">+</div>
            <p className="mt-4 text-sm text-gray-600">New Resume</p>
          </div>
          {/* Existing Resume Cards */}
          {existingResumes.map((resume) => (
            <div 
              key={resume.resumeId}
              className="border border-gray-200 p-6 rounded-xl hover:shadow-lg transition transform hover:scale-105 cursor-pointer bg-white relative"
              onClick={() => navigate('/resume-builder', { state: { resumeId: resume.resumeId, initialData: resume } })}
            >
              <div className="flex justify-center items-center h-48">
                {/* Display an edit icon as a placeholder */}
                <EditIcon className="w-16 h-16 text-gray-500" />
              </div>
              <div className="mt-4 text-center">
                <h2 className="text-xl font-semibold mb-2 text-gray-800">{resume.title}</h2>
                <p className="text-sm text-gray-500">
                  Created: {new Date(resume.createdAt).toLocaleDateString()}
                </p>
              </div>
              {/* Dropdown for actions */}
              <div className="absolute top-2 right-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveDropdown(activeDropdown === resume.resumeId ? null : resume.resumeId);
                  }}
                  className="focus:outline-none"
                >
                  <MoreVertical className="w-6 h-6 text-gray-500 hover:text-gray-700" />
                </button>
                {activeDropdown === resume.resumeId && (
                  <div className="absolute right-0 mt-2 w-36 bg-white shadow-md rounded p-2 z-10">
                    <ul>
                      <li 
                        onClick={() => handleAction('Edit', resume)} 
                        className="hover:bg-gray-100 p-2 cursor-pointer flex items-center gap-2"
                      >
                        <EditIcon className="w-4 h-4" /> Edit
                      </li>
                      <li 
                        onClick={() => handleAction('View', resume)} 
                        className="hover:bg-gray-100 p-2 cursor-pointer"
                      >
                        View
                      </li>
                      <li 
                        onClick={() => handleAction('Download', resume)} 
                        className="hover:bg-gray-100 p-2 cursor-pointer"
                      >
                        Download
                      </li>
                      <li 
                        onClick={() => handleAction('Delete', resume)} 
                        className="hover:bg-gray-100 p-2 cursor-pointer"
                      >
                        Delete
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {/* Modal for Creating New Resume */}
        {openDialog && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-lg">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Resume</h2>
              <p className="mb-2 text-gray-700">Add a title for your new resume</p>
              <input
                type="text"
                placeholder="Ex. Full Stack Resume"
                value={resumeTitle}
                onChange={(e) => setResumeTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg mb-6 focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setOpenDialog(false)}
                  className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateResume}
                  disabled={!resumeTitle || loading}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Resume'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Resume;
