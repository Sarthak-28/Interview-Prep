import React, { useContext } from 'react'
import { ResumeInfoContext } from '../context/ResumeInfoContext'
import PersonalDetailPreview from './preview/PersonalDetailPreview';
import SummaryPreview from './preview/SummaryPreview';
import EducationalPreview from './preview/EducationalPreview';
import ExperiencePreview from './preview/ExperiencePreview';
import SkillsPreview from './preview/SkillsPreview';

const ResumePreview = () => {

  const {resumeInfo, setResumeInfo} = useContext(ResumeInfoContext);

  return (
    <div className='shadow-lg h-full p-14 border-t-[20px]'
    style={{
      borderColor: resumeInfo?.themeColor
    }}>
        {/* Personal Detail  */}
            <PersonalDetailPreview resumeInfo={resumeInfo} />
        {/* Summery  */}
            <SummaryPreview resumeInfo={resumeInfo} />
        {/* Professional Experience  */}
           {resumeInfo?.Experience?.length>0 && <ExperiencePreview resumeInfo={resumeInfo} />}
        {/* Educational  */}
        {resumeInfo?.education?.length>0 && <EducationalPreview resumeInfo={resumeInfo} />}
        {/* Skilss  */}
        {resumeInfo?.skills?.length>0 && <SkillsPreview resumeInfo={resumeInfo}/>}
    </div>
  )
}

export default ResumePreview
