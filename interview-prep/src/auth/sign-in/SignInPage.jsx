import { SignIn } from '@clerk/clerk-react';
import React from 'react';
import Img1 from '../../assets/Images/Login.avif'; 

function SignInPage() {
  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Left Section: Full-Width Image */}
      <div className="lg:w-1/2 w-full h-full">
        <img
          src={Img1}
          alt="Login Illustration"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Section: Clerk Sign-In */}
      <div className="lg:w-1/2 w-full h-full flex items-center justify-center bg-white">
        <SignIn afterSignInUrl="/dashboard" />
      </div>
    </div>
  );
}

export default SignInPage;
