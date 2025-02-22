import React, { useState, useEffect } from "react";
import Step1Img from "../assets/Images/Step1.png";
import Step2Img from "../assets/Images/Step2.png";
import Step3Img from "../assets/Images/Step3.png";

const carouselData = [
  {
    title: "Ace Your Interviews",
    description: "Get expert guidance and AI-powered insights to crack your dream job interview.",
    image: Step1Img,
  },
  {
    title: "Enhance Your Resume",
    description: "Build an outstanding resume with our AI Resume Builder and stand out from the crowd.",
    image: Step2Img,
  },
  {
    title: "Level Up Your Skills",
    description: "Sharpen your technical and soft skills with our curated learning resources.",
    image: Step3Img,
  },
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselData.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-[90%] mx-auto overflow-hidden mt-8 
                    bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 
                    p-10 rounded-3xl shadow-2xl">

      {carouselData.map((item, index) => (
        <div
          key={index}
          className={`w-full h-full flex flex-col md:flex-row items-stretch gap-0 
                      p-1 md:p-12 rounded-2xl shadow-lg bg-white 
                      transition-opacity duration-1000 ${
                        index === currentIndex ? "block" : "hidden"
                      }`}
        >
          {/* Left Side: Heading + Paragraph */}
          <div className="w-full md:w-3/5 flex flex-col justify-center 
                          text-center md:text-left space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-purple-900">
              {item.title}
            </h2>
            <p className="text-gray-700 text-lg">
              {item.description}
            </p>
          </div>

          {/* Right Side: Image (No extra div around it) */}
          <img
            src={item.image}
            alt={item.title}
            className="w-full md:w-2/5 h-auto md:h-full 
                       object-cover rounded-r-2xl shadow-md"
          />
        </div>
      ))}
    </div>
  );
};

export default Carousel;


