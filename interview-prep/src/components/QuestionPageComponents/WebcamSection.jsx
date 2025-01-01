import React from 'react';

const WebcamSection = () => {
  return (
    <div className="hidden md:flex md:w-1/3 w-full mt-6 md:mt-0 flex-col items-center">
      <div
        className="border-2 border-gray-300 rounded-lg flex items-center justify-center overflow-hidden"
        style={{ width: 300, height: 200 }}
      >
        <p className="text-gray-500">Enable Webcam</p>
      </div>
      <button
        className="mt-6 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
      >
        Enable Webcam
      </button>
    </div>
  );
};

export default WebcamSection;
