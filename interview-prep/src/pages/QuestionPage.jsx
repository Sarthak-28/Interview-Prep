import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "./../components/Header";
import QuestionNavigation from "./../components/QuestionPageComponents/QuestionNavigation";
import QuestionDisplay from "./../components/QuestionPageComponents/QuestionDisplay";
import AnswerInput from "./../components/QuestionPageComponents/AnswerInput";
import WebcamSection from "./../components/QuestionPageComponents/WebcamSection";

const QuestionPage = () => {
  const { mockId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAnswerInputVisible, setIsAnswerInputVisible] = useState(false);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [answers, setAnswers] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/interview/${mockId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch questions");
        }
        const data = await response.json();
        setQuestions(data.jsonMockResp);
        setAnswers(new Array(data.jsonMockResp.length).fill(""));
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [mockId]);

  const saveCurrentAnswer = () => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = typedAnswer; // Save typed answer
    setAnswers(updatedAnswers);
  };

  const handleNext = () => {
    saveCurrentAnswer();
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setTypedAnswer(answers[currentQuestionIndex + 1] || "");
    } else {
      handleFinishClick();
    }
  };

  const handlePrevious = () => {
    saveCurrentAnswer();
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
      setTypedAnswer(answers[currentQuestionIndex - 1] || "");
    }
  };

  const handleDoneClick = () => {
    saveCurrentAnswer();
    setIsAnswerInputVisible(false);
  };

  const handleEditClick = () => {
    setIsAnswerInputVisible(true);
  };

  const handleFinishClick = () => {
    const unansweredQuestions = answers.filter(
      (answer) => answer === ""
    ).length;
    if (unansweredQuestions > 0) {
      setShowDialog(true);
    } else {
      navigate("/thank-you");
    }
  };

  const handleDialogConfirm = () => {
    setShowDialog(false);
    navigate("/thank-you");
  };

  const handleDialogCancel = () => {
    setShowDialog(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <Header />
      <div className="flex flex-col md:flex-row items-center justify-center mt-10 mx-4 md:mx-auto bg-white shadow-md rounded-lg p-6 max-w-7xl w-full">
        <div className="md:w-2/3 w-full">
          <QuestionNavigation
            questions={questions}
            currentQuestionIndex={currentQuestionIndex}
            setCurrentQuestionIndex={(index) => {
              saveCurrentAnswer();
              setCurrentQuestionIndex(index);
              setTypedAnswer(answers[index] || "");
            }}
          />
          <QuestionDisplay
            question={questions[currentQuestionIndex]?.question}
            handleTypeAnswerClick={() => setIsAnswerInputVisible(true)}
          />
          <AnswerInput
            isAnswerInputVisible={isAnswerInputVisible}
            typedAnswer={typedAnswer}
            setTypedAnswer={setTypedAnswer}
            handleDoneClick={handleDoneClick}
            submittedAnswer={answers[currentQuestionIndex]}
            handleEditClick={handleEditClick}
          />
          <div className="flex justify-between mt-6">
            {currentQuestionIndex > 0 && (
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg"
                onClick={handlePrevious}
              >
                Previous
              </button>
            )}
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
              onClick={handleNext}
            >
              {currentQuestionIndex === questions.length - 1
                ? "Finish"
                : "Next"}
            </button>
          </div>
        </div>
        <WebcamSection />
      </div>
      {showDialog && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-xl font-semibold mb-4">Unanswered Questions</h3>
            <p className="mb-4">
              You have some unanswered questions. Are you sure you want to
              submit?
            </p>
            <div className="flex justify-between">
              <button
                onClick={handleDialogCancel}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDialogConfirm}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
              >
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionPage;
