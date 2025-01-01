import React from "react";
import { FaMicrophone, FaKeyboard } from "react-icons/fa";

const QuestionDisplay = ({
  question,
  handleTypeAnswerClick,
  isSubmitted,
}) => {
  return (
    <div className="p-6 border-2 rounded-lg">
      <h2 className="text-xl font-bold mb-4">{question}</h2>

      {!isSubmitted && (
        <div className="flex space-x-4">
          {/* Removed the onClick for recording functionality */}
          <button
            className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
          >
            <FaMicrophone /> <span>Answer</span>
          </button>
          <button
            onClick={handleTypeAnswerClick}
            className="flex items-center justify-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg"
          >
            <FaKeyboard /> <span>Type Answer</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionDisplay;
