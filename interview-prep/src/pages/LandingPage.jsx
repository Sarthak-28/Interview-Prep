import React from "react";
import Header from "./../components/Header";
import Img1 from "../assets/Images/Hello.jpg";

const LandingPage = () => {
  return (
    <div>
      <Header />
      <div className="flex flex-col lg:flex-row w-full h-auto bg-gray-100 lg:px-24 md:px-16 sm:px-14 px-12 py-6 shadow-md items-center">
        
        
        {/* Text Section */}
        <div className="text-center lg:text-left">
        <p className="font-instrumental-sans font-bold text-3xl sm:text-4xl lg:text-5xl mb-4">
  Oh hello, diamond in the rough!
</p>
<p className="font-inter font-normal text-lg sm:text-xl lg:text-2xl mb-4">
  This website won’t teach you how to make Maggi 🍜, but if you want to ace your interviews or take your skills to the next level, you’ve come to the perfect place. 🌟
</p>
<p className="font-inter font-normal text-md sm:text-lg lg:text-xl">
  So, buckle up and let’s turn your journey into a winning story! 🙌
</p>

        </div>

        {/* Image Section */}
        <img 
          src={Img1} 
          alt="Image 1" 
          className="w-full lg:w-1/2 h-auto mb-6 lg:mb-0 lg:mr-0 object-cover"
        />
        
      </div>
    </div>
  );
};

export default LandingPage;
