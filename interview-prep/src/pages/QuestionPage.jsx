import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "./../components/Header";
import QuestionNavigation from "./../components/QuestionPageComponents/QuestionNavigation";
import QuestionDisplay from "./../components/QuestionPageComponents/QuestionDisplay";
import AnswerInput from "./../components/QuestionPageComponents/AnswerInput";
import WebcamSection from "./../components/QuestionPageComponents/WebcamSection";
import { chatSession } from "../../utils/GeminiAIModal"; 
import Loader from "./../components/Loader";
import moment from "moment"; 
import { useUser } from "@clerk/clerk-react"; 

 
const QuestionPage = () => {
  const { user } = useUser();
  const { mockId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [isAnswerInputVisible, setIsAnswerInputVisible] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for loader
  const navigate = useNavigate();

  // Fetch questions and initialize answers
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

  // Save the current answer locally
  const saveCurrentAnswer = () => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = typedAnswer;
    setAnswers(updatedAnswers);
  };

  // Save answers to the backend
  const saveAnswersToBackend = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/interview/${mockId}/answers`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            answers: questions.map((question, index) => ({
              question: question.question,
              answer: answers[index] || "No answer provided",
            })),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save answers");
      }

      const data = await response.json();
      console.log("Answers saved successfully:", data);
      return true;
    } catch (err) {
      console.error("Error saving answers:", err);
      setError(err.message);
      return false;
    }
  };

  // Handle navigation to the next question
  const handleNext = () => {
    saveCurrentAnswer();
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setTypedAnswer(answers[currentQuestionIndex + 1] || "");
    } else {
      handleFinishClick();
    }
  };

  // Handle navigation to the previous question
  const handlePrevious = () => {
    saveCurrentAnswer();
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
      setTypedAnswer(answers[currentQuestionIndex - 1] || "");
    }
  };

  // Handle clicking the "Done" button
  const handleDoneClick = () => {
    saveCurrentAnswer();
    setIsAnswerInputVisible(false);
  };

  // Handle clicking the "Edit" button
  const handleEditClick = () => {
    setIsAnswerInputVisible(true);
  };

  const handleTypeAnswerClick = () => {
    setIsAnswerInputVisible(true);
  };

  // Handle clicking the "Finish" button
  const handleFinishClick = async () => {
    const unansweredQuestions = answers.filter((answer) => answer === "").length;
  
    if (unansweredQuestions > 0) {
      setShowDialog(true);
    } else {
      setIsSubmitting(true); // Show loader
      try {
        // Save answers to the backend
        const success = await saveAnswersToBackend();
        if (success) {
          // Generate feedback for all questions
          const feedbackList = await generateFeedback(questions, answers);
          if (feedbackList) {
            console.log("Feedback for all questions:", feedbackList);
  
            // Save all feedback and answers to the backend
            await saveUserAnswerToBackend(mockId, feedbackList, user);
  
            
            navigate("/feedbackpage", { state: { mockId } });
          }
        }
      } catch (error) {
        console.error("Error during submission:", error);
        setError("An error occurred during submission.");
      } finally {
        setIsSubmitting(false); // Hide loader
      }
    }
  };

  // Handle confirming the dialog (submit with unanswered questions)
  const handleDialogConfirm = async () => {
    setIsSubmitting(true); // Show loader
    try {
      // Save answers to the backend
      const success = await saveAnswersToBackend();
      if (success) {
        // Generate feedback for all questions
        const feedbackList = await generateFeedback(questions, answers);
        if (feedbackList) {
          console.log("Feedback for all questions:", feedbackList);
  
          // Save all feedback and answers to the backend
          await saveUserAnswerToBackend(mockId, feedbackList, user);
        }
        setShowDialog(false);
        navigate("/feedbackpage", { state: { mockId } });
      }
    } catch (error) {
      console.error("Error during submission:", error);
      setError("An error occurred during submission.");
    } finally {
      setIsSubmitting(false); // Hide loader
    }
  };

  // Handle canceling the dialog
  const handleDialogCancel = () => {
    setShowDialog(false);
  };

  const saveUserAnswerToBackend = async (mockIdRef, feedbackList, user) => {
    try {
      // Save all user answers with feedback and ratings to the backend
      const response = await fetch("http://localhost:5000/interview/saveUserAnswer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mockIdRef, // From the function parameter
          userEmail: user?.primaryEmailAddress?.emailAddress, // Use Clerk to get the user email
          createdAt: moment().format("DD-MM-yyyy"), // Format the current date
          answers: feedbackList, // Array of all answers and feedback
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to save user answers");
      }
  
      const data = await response.json();
      console.log("User answers saved successfully:", data);
      return true;
    } catch (error) {
      console.error("Error saving user answers:", error);
      return false;
    }
  };

  const generateFeedback = async (questions, answers) => {
    try {
      const feedbackList = [];
  
      // Generate feedback for each question
      for (let i = 0; i < questions.length; i++) {
        const question = questions[i].question;
        const userAnswer = answers[i] || "No answer provided";
  
        const feedbackPrompt = `
          Question: ${question}
          User Answer: ${userAnswer}
          Depends on question and user answer for given interview question, please give us:
          1. A rating for the answer (out of 10)
          2. Feedback as area of improvement (if any) in just 3-5 lines
          Return the response in JSON format with "rating" and "feedback" fields.
        `;
  
        // Call your AI API (e.g., Gemini AI)
        const result = await chatSession.sendMessage(feedbackPrompt);
  
        // Clean up the response
        const mockJsonResp = result.response
          .text()
          .replace("```json", "")
          .replace("```", "");
  
        // Parse the JSON response
        const JsonFeedbackResp = JSON.parse(mockJsonResp);
        console.log("Feedback Response:", JsonFeedbackResp);
  
        feedbackList.push({
          question,
          correctAns: questions[i].answer, // Correct answer from the interview data
          userAns: userAnswer,
          feedback: JsonFeedbackResp.feedback,
          rating: JsonFeedbackResp.rating.toString(),
        });
      }
  
      return feedbackList;
    } catch (error) {
      console.error("Error generating feedback:", error);
      return null;
    }
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
      {/* Show loader while submitting */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <Loader />
        </div>
      )}
      <div className="flex flex-col md:flex-row items-center justify-center mt-10 mx-4 md:mx-auto bg-white shadow-md rounded-lg p-6 max-w-7xl w-full relative">
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
          <div>
            <QuestionDisplay
              question={questions[currentQuestionIndex]?.question} // Pass the fetched question here
              handleTypeAnswerClick={() => setIsAnswerInputVisible(true)}
              setTypedAnswer={setTypedAnswer}
              setIsAnswerInputVisible={setIsAnswerInputVisible}
              isSubmitted={false}
              setCurrentQuestionIndex={setCurrentQuestionIndex}
            />
          </div>
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

/*
"question":"What is Node.js and why is it popular for backend development?
"answer":"Node.js is a JavaScript runtime environment that allows you to execute JavaScript code server-side. Its popularity stems from its non-blocking, event-driven architecture making it highly efficient for I/O operations, and the use of a single language across front-end and back-end."},
{"question":"Explain the concept of asynchronous programming in Node.js.","answer":"Asynchronous programming in Node.js allows the program to continue executing other tasks while waiting for a long-running operation (like a database query) to complete. This avoids blocking the main thread, maintaining high performance and responsiveness."},
{"question":"What is npm and how do you use it in a Node.js project?",
"answer":"npm (Node Package Manager) is a package manager for JavaScript, used to install, manage, and share code packages (libraries/modules). You use it by running commands like 'npm install [package_name]' in your project's directory to add dependencies."},{"question":"What is a callback function in JavaScript and how is it used in Node.js?","answer":"A callback function is a function passed as an argument to another function, and is executed when the first function's task is completed. In Node.js, callbacks are commonly used to handle results of asynchronous operations, ensuring code runs in the correct order."},
{"question":"Can you describe a basic HTTP request lifecycle in Node.js?"
,"answer":"A basic HTTP request in Node.js involves receiving a request, parsing it, performing processing based on the request (like fetching data), and then sending a response back to the client. This can involve modules like http or express."}],"jobPosition":"Backend ","jobDesc":"Nodejs","jobExperience":{"$numberInt":"0"},"createdBy":"sarthak.patel.3810210@ves.ac.in","createdAt":"26-12-2024","__v":{"$numberInt":"0"},"answers":[{"question":"What is Node.js and why is it popular for backend development?","answer":"Gojo"},{"question":"Explain the concept of asynchronous programming in Node.js.","answer":"Dojo"},{"question":"What is npm and how do you use it in a Node.js project?","answer":"No answer provided"},{"question":"What is a callback function in JavaScript and how is it used in Node.js?","answer":"No answer provided"},{"question":"Can you describe a basic HTTP request lifecycle in Node.js?","answer":"No answer provided"}]}

*/
