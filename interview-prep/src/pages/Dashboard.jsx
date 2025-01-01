import React, { useState } from 'react';
import Header from './../components/Header';
import AddNewInterview from '../components/AddNewInterview';

const Dashboard = () => {
  const [showCard, setShowCard] = useState(false);

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/*Temp Interview cards */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="font-semibold text-xl mb-2">Interview 1</h3>
            <p className="text-gray-600">Date: December 10, 2024</p>
            <p className="text-gray-600">Position: Software Engineer</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="font-semibold text-xl mb-2">Interview 2</h3>
            <p className="text-gray-600">Date: December 5, 2024</p>
            <p className="text-gray-600">Position: Product Manager</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
