import { SignUp } from '@clerk/clerk-react';
import React from 'react';
import Img2 from '../../assets/Images/SignUp.avif'; 
const SignUpPage = () => {
  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Left Section: Full-Width Image */}
      <div className="lg:w-1/2 w-full h-full">
        <img
          src={Img2}
          alt="Signup Illustration"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Section: Clerk Sign-Up */}
      <div className="lg:w-1/2 w-full h-full flex items-center justify-center bg-white">
        <SignUp afterSignUpUrl="/home" />
      </div>
    </div>
  );
};

export default SignUpPage;
