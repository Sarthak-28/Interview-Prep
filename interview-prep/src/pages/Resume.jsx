import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'; 
import { useUser } from "@clerk/clerk-react";
import Header from '../components/Header';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Edit as EditIcon, Download as DownloadIcon, Trash2 } from 'lucide-react';

const Resume = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [resumeTitle, setResumeTitle] = useState('');
  const [existingResumes, setExistingResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

  // New state for deletion
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState(null);

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
      case 'Download':
        // Navigate to ResumePreviewPage for downloading the resume
        navigate(`/my-resume/${resume.resumeId}/view`);
        break;
      case 'Delete':
        // Set the resume to delete and show confirmation modal
        setResumeToDelete(resume.resumeId);
        setShowDeleteConfirmation(true);
        break;
      default:
        break;
    }
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:5000/resume/deleteResume/${resumeToDelete}`);
      if (response.status === 200) {
        toast.success("Resume deleted successfully");
        // Remove the deleted resume from state
        setExistingResumes(existingResumes.filter(r => r.resumeId !== resumeToDelete));
      }
    } catch (error) {
      toast.error("Failed to delete resume");
    } finally {
      setShowDeleteConfirmation(false);
      setResumeToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setResumeToDelete(null);
  };

  return (
    <>
      <Header />
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Resumes</h1>
          <p className="text-sm text-gray-500">
            Start creating your AI-powered resume for your next job role
          </p>
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
              {/* Action Buttons */}
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={(e) => { 
                    e.stopPropagation();
                    handleAction('Edit', resume);
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded"
                  title="Edit"
                >
                  <EditIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => { 
                    e.stopPropagation();
                    handleAction('Download', resume);
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white p-1 rounded"
                  title="Download"
                >
                  <DownloadIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => { 
                    e.stopPropagation();
                    handleAction('Delete', resume);
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white p-1 rounded"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex justify-center items-center h-48">
                <EditIcon className="w-16 h-16 text-gray-500" />
              </div>
              <div className="mt-4 text-center">
                <h2 className="text-xl font-semibold mb-2 text-gray-800">{resume.title}</h2>
                <p className="text-sm text-gray-500">
                  Created: {new Date(resume.createdAt).toLocaleDateString()}
                </p>
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

        {/* Delete Confirmation Modal */}
        {showDeleteConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                Delete Resume
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this resume? This action cannot be undone.
              </p>
              <div className="flex justify-between">
                <button
                  onClick={cancelDelete}
                  className="w-1/2 mr-2 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-full transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="w-1/2 ml-2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-full transition-colors duration-300"
                >
                  Yes, Delete
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
