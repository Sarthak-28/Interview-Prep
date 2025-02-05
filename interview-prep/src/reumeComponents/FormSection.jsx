import React from 'react';
import { useLocation } from 'react-router-dom';

const FormSection = () => {
  const location = useLocation();
  const { title } = location.state || { title: 'Untitled Resume' };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      {/* Add your form components here */}
    </div>
  );
};

export default FormSection;