import React, { useContext, useEffect, useState } from 'react';
import { ResumeInfoContext } from '../../context/ResumeInfoContext';
import { useParams } from 'react-router-dom';
import { Brain, LoaderCircle } from 'lucide-react';
import { AIChatSession } from '../../../utils/ResumeAIModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const prompt =
  "Job Title: {jobTitle} , Depends on job title give me list of summary for 3 experience level, Mid Level and Fresher level in 3 -4 lines in array format, With summary and experience_level Field in JSON Format";

function Summary({ enabledNext }) {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const params = useParams();
  // Initialize as an empty array
  const [aiGeneratedSummaryList, setAiGeneratedSummaryList] = useState([]);

  useEffect(() => {
    if (summary) {
      // Use a functional update to avoid infinite loops
      setResumeInfo((prev) => {
        if (prev.summary !== summary) {
          return { ...prev, summary: summary };
        }
        return prev;
      });
    }
  }, [summary, setResumeInfo]);

  const generateSummaryFromAI = async () => {
    setLoading(true);
    const PROMPT = prompt.replace('{jobTitle}', resumeInfo?.jobTitle);
    console.log(PROMPT);
    try {
      const result = await AIChatSession.sendMessage(PROMPT);
      const text = result.response.text();
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch (err) {
        toast.error("Error parsing AI response");
        setAiGeneratedSummaryList([]);
        setLoading(false);
        return;
      }
      // Ensure the parsed result is an array
      if (Array.isArray(parsed)) {
        setAiGeneratedSummaryList(parsed);
      } else if (parsed && typeof parsed === "object") {
        // If it's an object, you might want to wrap it in an array or handle it appropriately.
        setAiGeneratedSummaryList([parsed]);
      } else {
        toast.error("Unexpected AI response format");
        setAiGeneratedSummaryList([]);
      }
    } catch (error) {
      toast.error("Error fetching AI suggestions");
    } finally {
      setLoading(false);
    }
  };

  const onSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Use resumeInfo.resumeId from context for the endpoint
      const response = await fetch(`http://localhost:5000/resume/updateResume/${resumeInfo.resumeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: { summary: summary } }),
      });

      const result = await response.json();

      if (response.ok) {
        enabledNext(true);
        toast.success("Details updated");
      } else {
        toast.error(result.message || "Error updating details");
      }
    } catch (error) {
      toast.error("Server Error, please try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="p-5 shadow-lg rounded-lg border-t-4 border-t-primary mt-10">
        <h2 className="font-bold text-lg">Summary</h2>
        <p>Add Summary for your job title</p>

        <form className="mt-7" onSubmit={onSave}>
          <div className="flex justify-between items-end">
            <label className="block">Add Summary</label>
            <button
              type="button"
              onClick={generateSummaryFromAI}
              className="border border-primary text-primary flex gap-2 items-center px-3 py-1 rounded text-sm hover:bg-primary hover:text-white transition-colors"
            >
              <Brain className="h-4 w-4" /> Generate from AI
            </button>
          </div>
          <textarea
            className="mt-5 border p-2 rounded w-full"
            required
            value={summary}
            placeholder="Enter summary..."
            onChange={(e) => setSummary(e.target.value)}
          ></textarea>
          <div className="mt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <LoaderCircle className="animate-spin" /> : 'Save'}
            </button>
          </div>
        </form>
      </div>

      {aiGeneratedSummaryList.length > 0 && (
        <div className="my-5">
          <h2 className="font-bold text-lg">Suggestions</h2>
          {aiGeneratedSummaryList.map((item, index) => (
            <div
              key={index}
              onClick={() => setSummary(item?.summary)}
              className="p-5 shadow-lg my-4 rounded-lg cursor-pointer"
            >
              <h2 className="font-bold my-1 text-primary">
                Level: {item?.experience_level}
              </h2>
              <p>{item?.summary}</p>
            </div>
          ))}
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default Summary;
