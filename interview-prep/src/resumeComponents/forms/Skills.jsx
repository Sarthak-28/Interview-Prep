import React, { useContext, useEffect, useState } from 'react';
import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import { LoaderCircle } from 'lucide-react';
import { ResumeInfoContext } from '../../context/ResumeInfoContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Skills() {
  // Initialize skillsList once using the value from context (if available)
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [skillsList, setSkillsList] = useState(() => {
    return resumeInfo?.skills || [{ name: '', rating: 0 }];
  });
  const [loading, setLoading] = useState(false);

  // Removed the effect that resets skillsList from resumeInfo to prevent the loop.
  // useEffect(() => {
  //   if (resumeInfo && resumeInfo.skills) {
  //     setSkillsList(resumeInfo.skills);
  //   }
  // }, [resumeInfo]);

  // Update resume context whenever skillsList changes using a functional update.
  useEffect(() => {
    setResumeInfo(prev => ({ ...prev, skills: skillsList }));
  }, [skillsList, setResumeInfo]);

  const handleChange = (index, name, value) => {
    const newEntries = [...skillsList];
    newEntries[index][name] = value;
    setSkillsList(newEntries);
  };

  const AddNewSkills = () => {
    setSkillsList(prev => [
      ...prev,
      { name: '', rating: 0 }
    ]);
  };

  const RemoveSkills = () => {
    setSkillsList(prev => prev.slice(0, -1));
  };

  const onSave = async () => {
    setLoading(true);
    const data = {
      data: {
        skills: skillsList.map(({ id, ...rest }) => rest),
      },
    };

    try {
      // Use the resumeId from context and update the endpoint if needed
      const response = await fetch(`http://localhost:5000/resume/updateResume/${resumeInfo.resumeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Details updated!');
      } else {
        toast.error(result.message || 'Error updating details');
      }
    } catch (error) {
      toast.error('Server Error, Try again!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-4 border-t-primary mt-10">
      <h2 className="font-bold text-lg">Skills</h2>
      <p>Add your top professional key skills</p>

      <div>
        {skillsList.map((item, index) => (
          <div
            key={index}
            className="flex justify-between mb-2 border rounded-lg p-3 items-center"
          >
            <div className="w-1/2">
              <label className="text-xs block mb-1">Name</label>
              <input
                type="text"
                value={item.name}
                onChange={(e) => handleChange(index, 'name', e.target.value)}
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <Rating
                style={{ maxWidth: 120 }}
                value={item.rating}
                onChange={(v) => handleChange(index, 'rating', v)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-4">
        <div className="flex gap-2">
          <button
            onClick={AddNewSkills}
            className="border border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-500 hover:text-white transition-colors"
          >
            + Add More Skill
          </button>
          <button
            onClick={RemoveSkills}
            className="border border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-500 hover:text-white transition-colors"
          >
            - Remove
          </button>
        </div>
        <button
          disabled={loading}
          onClick={onSave}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? <LoaderCircle className="animate-spin" /> : 'Save'}
        </button>
      </div>
      
      <ToastContainer />
    </div>
  );
}

export default Skills;
