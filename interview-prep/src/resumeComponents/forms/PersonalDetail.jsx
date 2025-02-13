import React, { useContext, useEffect, useState } from 'react';
import { ResumeInfoContext } from '../../context/ResumeInfoContext';
import { LoaderCircle } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function PersonalDetail({ enabledNext }) {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // No debugging logs
  }, [resumeInfo]);

  const handleInputChange = (e) => {
    enabledNext(false);
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setResumeInfo({
      ...resumeInfo,
      [name]: value,
    });
  };

  const onSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    const effectiveResumeId = resumeInfo.resumeId;
    if (!effectiveResumeId) {
      toast.error("Resume ID is missing.");
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5000/resume/updateResume/${effectiveResumeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: formData }),
      });

      const result = await response.json();

      if (response.ok) {
        enabledNext(true);
        toast.success("Details updated");
      } else {
        toast.error(result.message || "Error updating details");
      }
    } catch (error) {
      toast.error("Error updating details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-4 border-t-primary mt-10">
      <h2 className="font-bold text-lg">Personal Detail</h2>
      <p>Get Started with the basic information</p>

      <form onSubmit={onSave}>
        <div className="grid grid-cols-2 mt-5 gap-3">
          <div>
            <label className="text-sm">First Name</label>
            <input
              type="text"
              name="firstName"
              defaultValue={resumeInfo?.firstName || ''}
              required
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="text-sm">Last Name</label>
            <input
              type="text"
              name="lastName"
              defaultValue={resumeInfo?.lastName || ''}
              required
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm">Job Title</label>
            <input
              type="text"
              name="jobTitle"
              defaultValue={resumeInfo?.jobTitle || ''}
              required
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm">Address</label>
            <input
              type="text"
              name="address"
              defaultValue={resumeInfo?.address || ''}
              required
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="text-sm">Phone</label>
            <input
              type="tel"
              name="phone"
              defaultValue={resumeInfo?.phone || ''}
              required
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="text-sm">Email</label>
            <input
              type="email"
              name="email"
              defaultValue={resumeInfo?.email || ''}
              required
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <LoaderCircle className="animate-spin" /> : 'Save'}
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}

export default PersonalDetail;
