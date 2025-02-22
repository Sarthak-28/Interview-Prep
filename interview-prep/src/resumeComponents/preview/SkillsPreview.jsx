import React from 'react';


function SkillsPreview({ resumeInfo }) {
  return (
    <div className='my-6'>
      <h2
        className='text-center font-bold text-sm mb-2'
        style={{
          color: resumeInfo?.themeColor
        }}
      >
        Skills
      </h2>
      <hr style={{
        borderColor: resumeInfo?.themeColor
      }} />


      <div className='grid grid-cols-2 gap-3 my-4'>
        {resumeInfo?.skills.map((skill, index) => {
          // Calculate position dynamically
          const ratingPosition = skill.rating * 20; // Convert 1-5 scale to 0-100%


          return (
            <div key={index} className='flex flex-col'>
              <h2 className='text-xs font-semibold mb-1'>{skill.name}</h2>
              <div className='flex items-center gap-2 relative'>
                <span className="text-xs text-gray-500">1</span>
                <div className='h-2 bg-gray-200 w-[120px] rounded relative'>
                  <div className='h-2 rounded'
                    style={{
                      backgroundColor: resumeInfo?.themeColor,
                      width: `${ratingPosition}%`
                    }}
                  ></div>
                  {/* Show rating inside or above the bar */}
                  <span
                    className="absolute -top-5 text-xs font-bold"
                    style={{
                      left: `calc(${ratingPosition}% - 10px)`, // Adjust position
                      transform: 'translateX(-50%)', // Center it properly
                      color: resumeInfo?.themeColor
                    }}
                  >
                    {skill.rating}
                  </span>
                </div>
                <span className="text-xs text-gray-500">5</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


export default SkillsPreview;



