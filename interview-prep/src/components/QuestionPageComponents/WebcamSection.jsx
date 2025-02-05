import React, { useState, useRef } from 'react';

const WebcamSection = () => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const videoRef = useRef(null);

  // Start the webcam and recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      setRecordedChunks([]); // Reset previous recordings

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          setRecordedChunks((prev) => prev.concat(event.data));
        }
      };

      recorder.onstop = () => {
        // Create a Blob from the recorded chunks
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        setRecordedBlob(blob);
        // Show prompt asking if the user wants to save the recording
        setShowSavePrompt(true);
      };

      recorder.start();
      setRecording(true);
    } catch (error) {
      console.error("Error starting webcam recording:", error);
    }
  };

  // Stop the recording and the webcam stream
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  };

  // Handle saving the recording to the user's computer
  const handleSaveRecording = () => {
    if (recordedBlob) {
      // Create a URL for the Blob and trigger a download
      const url = URL.createObjectURL(recordedBlob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `interview_${new Date().toISOString()}.webm`;
      document.body.appendChild(a);
      a.click();
      // Cleanup: revoke the object URL and hide the prompt
      URL.revokeObjectURL(url);
      setRecordedBlob(null);
      setShowSavePrompt(false);
    }
  };

  // Discard the recorded video if the user cancels
  const handleDiscardRecording = () => {
    setRecordedBlob(null);
    setShowSavePrompt(false);
  };

  return (
    <div className="hidden md:flex md:w-1/3 w-full mt-6 md:mt-0 flex-col items-center">
      <div
        className="border-2 border-gray-300 rounded-lg flex items-center justify-center overflow-hidden"
        style={{ width: 300, height: 200 }}
      >
        {/* Display live stream or nothing */}
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="w-full h-full object-cover" 
        />
      </div>
      <div className="mt-6">
        {!recording ? (
          <button
            onClick={startRecording}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
          >
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
          >
            Stop Recording
          </button>
        )}
      </div>

      {/* Save Prompt Modal */}
      {showSavePrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-xl font-semibold mb-4">Save Recording</h3>
            <p className="mb-4">
              Would you like to save your interview recording to your computer?
            </p>
            <div className="flex justify-between">
              <button
                onClick={handleDiscardRecording}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRecording}
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
              >
                Save Recording
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebcamSection;
