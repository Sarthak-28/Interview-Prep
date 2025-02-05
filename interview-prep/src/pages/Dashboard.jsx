import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./../components/Header";
import AddNewInterview from "../components/AddNewInterview";
import { useUser } from "@clerk/clerk-react";

const Dashboard = () => {
  const { user } = useUser();
  const [showCard, setShowCard] = useState(false);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [interviewToDelete, setInterviewToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
  
    if (user) {
      fetchUserInterviews();
    }
  }, [user]);
  
  const fetchUserInterviews = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/interview/userInterviews?userEmail=${encodeURIComponent(
          user?.primaryEmailAddress?.emailAddress
        )}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user interviews");
      }

      const data = await response.json();

      if (data.length === 0) {
        setInterviews([]); // Set to empty array if no interviews exist
      } else {
        const completedInterviews = data.filter(
          (interview) => interview.answers && interview.answers.length > 0
        );
        setInterviews(completedInterviews); // Filter completed interviews
      }
    } catch (err) {
      console.error("Error fetching user interviews:", err);
      setError("An error occurred while fetching interviews.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInterview = (interviewId) => {
    setInterviewToDelete(interviewId); // Pass interview._id (MongoDB _id)
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    if (interviewToDelete) {
      try {
        const response = await fetch(
          `http://localhost:5000/interview/delete/${interviewToDelete}`,
          { method: "DELETE" }
        );
        if (!response.ok) throw new Error("Failed to delete interview");
        
        // Refresh the interview list
        await fetchUserInterviews(); 
        
        // Use replace to update the current history entry so the stale page is not reachable via back
        navigate('/dashboard', { replace: true });
        
        setShowDeleteConfirmation(false);
      } catch (error) {
        setError("Delete failed. Please try again.");
      }
    }
  };
  
  

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setInterviewToDelete(null);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  return (
    <div>
      <Header />
      {/* Start a New Interview Section */}
      <section className="p-8 bg-gray-100 h-[60%] sm:h-[70%] lg:h-[80%] w-full mx-auto rounded-lg">
        <h2 className="text-3xl font-bold mb-6">Start a New Interview</h2>
        <button
          onClick={() => setShowCard(true)}
          className="w-[30%] sm:w-[20%] md:w-[15%] lg:w-[12%] h-[50%] sm:h-[60%] md:h-[75%] lg:h-[80%] text-lg sm:text-base md:text-xl text-gray-600 flex items-center justify-center border-2 border-gray-300 shadow-md"
        >
          <p className="text-gray-400 text-sm sm:text-lg md:text-xl">+ Start a new interview</p>
        </button>
        {showCard && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <AddNewInterview onClose={() => setShowCard(false)} />
          </div>
        )}
      </section>
      {/* Previous Interviews Section */}
      <section className="p-8 mt-8 bg-gray-100 w-[98%] mx-auto rounded-lg border border-gray-300">
  <h2 className="text-3xl font-bold mb-6">Previous Interviews</h2>
  {interviews.length === 0 ? (
    <div className="text-gray-600 text-center">
      No previous interviews available.
    </div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {interviews.map((interview) => (
        <div
          key={interview._id}
          className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
        >
          {/* Job Position and Overall Rating */}
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-l">Job Position: {interview.jobPosition}</h3>
            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {interview.overallRating || 'N/A'}⭐
            </span>
          </div>

          {/* Job Experience */}
          <p className="text-sm text-gray-600 mb-2">
            Experience: {interview.jobExperience} years
          </p>

          {/* Date of Interview */}
          <p className="text-gray-600 text-sm mb-2">
            Date: {new Date(interview.createdAt).toLocaleDateString()}
          </p>

          {/* Job Description */}
          <p className="text-gray-600 text-sm mb-2">
            Job Description: {interview.jobDesc}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600"
              onClick={() =>
                navigate(`/feedbackpage`, { state: { mockId: interview.mockIdRef } })
              }
              aria-label="View Feedback"
            >
              View Feedback
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600"
              onClick={() => navigate(`/interview/${interview.mockIdRef}/questions`)}
              aria-label="Retry Interview"
            >
              Retry Interview
            </button>
            <button
  onClick={(e) => {
    e.stopPropagation();
    handleDeleteInterview(interview.interviewId); // Use interviewId from aggregation
  }}
>
  Delete
</button>
          </div>
        </div>
      ))}
    </div>
  )}
</section>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-xl font-semibold mb-4">Delete Interview</h3>
            <p className="mb-4">Are you sure you want to delete this interview? This action cannot be undone.</p>
            <div className="flex justify-between">
              <button
                onClick={cancelDelete}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;