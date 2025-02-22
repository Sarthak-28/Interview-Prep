import React, { useContext, useEffect, useState } from 'react';
import { ResumeInfoContext } from '../../context/ResumeInfoContext';
import { LoaderCircle } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Education() {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
 
  // Initialize educationalList from context if available; otherwise, use default values.
  const [educationalList, setEducationalList] = useState(() => {
    return resumeInfo && resumeInfo.education && resumeInfo.education.length > 0
      ? resumeInfo.education
      : [
          {
            universityName: '',
            degree: '',
            major: '',
            startDate: '',
            endDate: '',
            description: '',
          },
        ];
  });
 
  const [loading, setLoading] = useState(false);


  const handleChange = (event, index) => {
    const newEntries = [...educationalList];
    const { name, value } = event.target;
    newEntries[index][name] = value;
    setEducationalList(newEntries);
  };


  const AddNewEducation = () => {
    setEducationalList((prev) => [
      ...prev,
      {
        universityName: '',
        degree: '',
        major: '',
        startDate: '',
        endDate: '',
        description: '',
      },
    ]);
  };


  const RemoveEducation = () => {
    setEducationalList((prev) => prev.slice(0, -1));
  };


  const onSave = async () => {
    setLoading(true);
    const data = {
      data: {
        education: educationalList.map(({ id, ...rest }) => rest),
      },
    };


    try {
      // Use resumeInfo.resumeId from context (update the endpoint if needed)
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
      toast.error('Server Error, Please try again!');
    } finally {
      setLoading(false);
    }
  };


  // Update the context when educationalList changes.
  // Using a functional update avoids including resumeInfo in the dependency array.
  useEffect(() => {
    setResumeInfo((prev) => ({ ...prev, education: educationalList }));
  }, [educationalList, setResumeInfo]);


  return (
    <div className="p-5 shadow-lg rounded-lg border-t-4 border-t-primary mt-10">
      <h2 className="font-bold text-lg">Education</h2>
      <p>Add your educational details</p>


      <div>
        {educationalList.map((item, index) => (
          <div key={index}>
            <div className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
              <div className="col-span-2">
                <label>University Name</label>
                <input
                  type="text"
                  name="universityName"
                  onChange={(e) => handleChange(e, index)}
                  defaultValue={item?.universityName || ''}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label>Degree</label>
                <input
                  type="text"
                  name="degree"
                  onChange={(e) => handleChange(e, index)}
                  defaultValue={item?.degree || ''}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label>Major</label>
                <input
                  type="text"
                  name="major"
                  onChange={(e) => handleChange(e, index)}
                  defaultValue={item?.major || ''}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label>Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  onChange={(e) => handleChange(e, index)}
                  defaultValue={item?.startDate || ''}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label>End Date</label>
                <input
                  type="date"
                  name="endDate"
                  onChange={(e) => handleChange(e, index)}
                  defaultValue={item?.endDate || ''}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div className="col-span-2">
                <label>Description</label>
                <textarea
                  name="description"
                  onChange={(e) => handleChange(e, index)}
                  defaultValue={item?.description || ''}
                  className="border p-2 rounded w-full"
                />
              </div>
            </div>
          </div>
        ))}
      </div>


      <div className="flex justify-between">
        <div className="flex gap-2">
          <button
            onClick={AddNewEducation}
            className="bg-white text-blue-500 hover:bg-blue-500 hover:text-white border border-blue-500"      >
            + Add More Education
          </button>
          <button
            onClick={RemoveEducation}
            className="bg-white text-blue-500 hover:bg-blue-500 hover:text-white border border-blue-500"
          >
            - Remove
          </button>
        </div>
        <button
          disabled={loading}
          onClick={onSave}
          className="bg-white text-blue-500 hover:bg-blue-500 hover:text-white border border-blue-500"
        >
          {loading ? <LoaderCircle className="animate-spin" /> : 'Save'}
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}


export default Education;



