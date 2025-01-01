import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "./../components/Header";
import { FaVideo } from "react-icons/fa"; // Import icons
import Webcam from "react-webcam"; // Import react-webcam
import DisabledWebcam from "./../assets/Images/CameraDisabled_Icon.png";
import { useNavigate } from "react-router-dom";

const InterviewPage = () => {
  const { mockId } = useParams(); // Retrieve mockId from URL params
  const [interviewData, setInterviewData] = useState(null); // State to store fetched data
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling
  const [webcamEnabled, setWebcamEnabled] = useState(false); // State to toggle webcam
  const [webcamSupported, setWebcamSupported] = useState(true); // State for webcam support
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterviewData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/interview/${mockId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch interview data");
        }
        const data = await response.json();
        setInterviewData(data);
      } catch (err) {
        console.error("Error fetching interview data:", err);
        setError(err.message);
      } finally {
        setLoading(false); 
      }
    };

    fetchInterviewData();

    // Check if webcam is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setWebcamSupported(false);
    }
  }, [mockId]); // Dependency array ensures this runs only when mockId changes

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>; 
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
  {/* Header */}
  <Header />

  {/* Main Content */}
  <div className="flex flex-col md:flex-row items-center justify-center mt-10 mx-4 md:mx-auto bg-white shadow-md rounded-lg p-6 max-w-7xl w-full">
    {/* Left Section */}
    <div className="md:w-2/3 w-full text-left">
      <h2 className="text-xl font-bold">Let’s Get Started</h2>
      <p className="mt-4 text-lg">
        <strong>Job Role/ Job Position:</strong> {interviewData.jobPosition}
      </p>
      <p className="mt-2 text-lg">
        <strong>Job Description/ Tech Stack:</strong> {interviewData.jobDesc}
      </p>
      <p className="mt-2 text-lg">
        <strong>Years of Experience:</strong> {interviewData.jobExperience}
      </p>
      <div className="mt-6 bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-lg">
        <h3 className="text-yellow-800 font-semibold">Information</h3>
        <p className="mt-2 text-yellow-700">
          Enable Video Web Cam and Microphone to Start your AI Generated Mock
          Interview. It has 5 questions which you can answer, and at the end,
          you will get a report based on your answers.
        </p>
        <p className="mt-2 text-yellow-700">
          <strong>NOTE:</strong> We never record your video. Webcam access can
          be disabled at any time if you want.
        </p>
      </div>
    </div>

    {/* Right Section */}
    <div className="md:w-1/3 w-full mt-6 md:mt-0 flex flex-col items-center">
      {/* Webcam Area */}
      {/* Webcam Area */}
{webcamSupported && (
  <div
    className="hidden md:flex items-center justify-center border-2 border-gray-300 rounded-lg overflow-hidden"
    style={{ width: 300, height: 200 }}
  >
    {webcamEnabled ? (
      <Webcam
        className="rounded-lg"
        style={{ width: "100%", height: "100%" }}
        mirrored={true}
        videoConstraints={{
          facingMode: "user",
        }}
      />
    ) : (
      <img
        className="object-cover"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        src={DisabledWebcam}
        alt="Webcam Disabled Placeholder"
      />
    )}
  </div>
)}

{/* Buttons */}
{webcamSupported ? (
  <button
    className="hidden md:block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 mt-6 rounded"
    onClick={() => setWebcamEnabled((prev) => !prev)}
  >
    {webcamEnabled ? "Disable Webcam" : "Enable Webcam"}
  </button>
) : (
  <div className="hidden md:block text-red-500 mt-6">
    Webcam is not supported on this device.
  </div>
)}


      {/* Start Interview Button */}
      <button
        className="bg-purple-500 hover:bg-purple-600 text-white font-bold mt-10 py-3 px-6 rounded-lg shadow-lg"
        onClick={() => navigate(`/interview/${mockId}/questions`)}
      >
        Start Interview
      </button>

    </div>
  </div>
</div>


  );
};

export default InterviewPage;
