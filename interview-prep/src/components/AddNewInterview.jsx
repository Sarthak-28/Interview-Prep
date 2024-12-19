import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { chatSession } from "../../utils/GeminiAIModal";

const AddNewInterview = ({ onClose }) => {
  const [jobRole, setJobRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [error, setError] = useState(null); // New state for error handling
  const [isLoading, setIsLoading] = useState(false); // New state for loading

  const handleYearsOfExperienceChange = (e) => {
    const value = e.target.value;
    if (value >= 0 && value <= 50) {
      setYearsOfExperience(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Log form data to the console
    const formData = {
      jobRole,
      jobDescription,
      yearsOfExperience,
    };
    console.log("Form Data:", formData);

    const InputPrompt = `Job Position: ${jobRole}, Job Description: ${jobDescription}, Years of Experience: ${yearsOfExperience}. Depend on Job Position, Job Description and Year of Experience, Give us 5 interview questions along with answer in JSON format. Give us question and answer as field in JSON`;

    try {
      const result = await chatSession.sendMessage(InputPrompt);
      console.log(await result.response.text());
    } catch (error) {
      setError("Error fetching interview questions.");
    }

    setIsLoading(false);
  };

  return (
    <div className="relative bg-white rounded-xl shadow-md overflow-hidden w-[90%] md:w-[70%] lg:w-[50%] xl:w-[40%] mx-auto p-6">
      {/* Cancel button */}
      <button onClick={onClose} className="absolute top-3 right-3 text-gray-600 hover:text-gray-900">
        <FaTimes size={20} />
      </button>

      <div>
        <h2 className="text-xl lg:text-2xl font-medium text-black mb-4">Tell us more about your job interview</h2>

        {/* Error Display */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Form Section */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Job Role/Job Position</label>
            <input
              type="text"
              placeholder="Ex. Full Stack Developer"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              required
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Job Description/Tech Stack (In Short)</label>
            <input
              type="text"
              placeholder="Ex. React, Angular, NodeJs, MySql etc"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              required
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
            <input
              type="number"
              placeholder="Ex. 5"
              value={yearsOfExperience}
              onChange={handleYearsOfExperienceChange}
              required
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
            {yearsOfExperience > 50 && (
              <p className="text-red-500 text-sm mt-1">Please enter a realistic value (0-50 years).</p>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" disabled={isLoading}>
              {isLoading ? "Processing..." : "Start Interview"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewInterview;
