import React from "react";
import AuthPage from "@/components/AuthPage";
import Image from "next/image";
import AlumniImage from "../../../public/people-working-late-their-office.jpg";

const HomePage = () => {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left Section (Image) */}
      <div className="hidden md:flex items-center justify-center ">
        {/* Replace with your image */}
        <div className="w-full flex items-center justify-center ">
          <Image src={AlumniImage} alt="Bg image" className="object-fill" />
        </div>
      </div>

      {/* Right Section (Login/Signup) */}
      <div className="flex items-center justify-center  p-6 sm:p-10">
        <div>
          <div>
            <AuthPage />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
