import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import HeroImage from "../assets/Images/LandingPage.png";
import ResumeImage from "../assets/Images/Resume.png";
import BlurText from "../components/BlurText";
import Carousel from "../components/Carousel";
import SplitText from "../components/SplitText";

const LandingPage = () => {
  const handleAnimationComplete = () => {
    console.log("All letters have animated!");
  };

  return (
    <>
      <Header />
      {/* Background with gradient animation */}
      <div className="relative min-h-screen bg-gradient-to-br from-orange-200 via-orange-50 to-purple-100 flex flex-col items-center px-3 py-3">
        <div className="splash-animation absolute top-0 left-0 w-full h-full z-0"></div>
        
        {/* Card Wrapper */}
        <div className="relative bg-gradient-to-br from-gray-100 via-purple-200 to-blue-100 shadow-lg rounded-2xl w-full max-w-[90%] flex flex-col md:flex-row items-center p-4 md:p-12 z-10">
          {/* Left Content */}
          <div className="w-full md:w-3/5 text-center md:text-left space-y-4 pr-6">
            <SplitText
              text="Oh hello, diamond in the rough!"
              className="font-bold text-3xl md:text-4xl lg:text-5xl text-purple-900"
              delay={150}
              animationFrom={{ opacity: 0, transform: "translate3d(0,50px,0)" }}
              animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
              easing="easeOutCubic"
              threshold={0.2}
              rootMargin="-50px"
              onLetterAnimationComplete={handleAnimationComplete}
            />
            <SplitText
          text="This website won’t teach you how to make Maggi 🍜, but if you want to ace your interviews or take your skills to the next level, you’ve come to the perfect place. 🌟"
         className="text-lg font-normal text-center"
        delay={80}
        animationFrom={{ opacity: 0, transform: "translate3d(0,50px,0)" }}
        animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
        easing="easeOutCubic"
        threshold={0.2}
        rootMargin="-50px"
            type="words"  // Ensure that text splits by words, not letters
          />


            <p className="text-gray-700 text-lg font-Sour-Gummy">
              This website won’t teach you how to make Maggi 🍜, but if you want
              to ace your interviews or take your skills to the next level,
              you’ve come to the perfect place. 🌟
            </p>
            <p className="font-semibold text-md sm:text-lg lg:text-xl">
              So, buckle up and let’s turn your journey into a winning story! 🙌
            </p>
            <div className="flex gap-4 mt-4">
              <button className="bg-blue-500 text-white px-6 py-2 rounded-lg text-lg font-semibold hover:bg-purple-600 transition-all">
                Let's Start
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="w-full md:w-2/5 flex justify-end mt-6 md:mt-0">
            <img src={HeroImage} alt="Hero" className="w-full max-w-lg rounded-xl" />
          </div>
        </div>

        {/* Carousel Section */}
        <Carousel />

        {/* Resume Section */}
        <div className="relative bg-gradient-to-br from-gray-100 via-blue-100 to-blue-300 shadow-lg rounded-2xl w-full max-w-[90%] flex flex-col md:flex-row items-center p-4 md:p-12 mt-8 z-10">
          {/* Left Image - Resume */}
          <div className="w-full md:w-2/5 flex justify-start mt-6 md:mt-0">
            <img src={ResumeImage} alt="Resume Preview" className="w-full max-w-lg rounded-xl" />
          </div>
          
          {/* Right Content - Resume Info */}
          <div className="w-full md:w-3/5 text-center md:text-left space-y-4 pl-6">
            <h2 className="text-3xl md:text-4xl font-bold text-purple-900">Unlock Your Dream Career !!</h2>
            <p className="text-gray-700 text-lg">
              Getting that dream job can be tough, but we make it easier.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
