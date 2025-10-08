import React from "react";
import AuthPage from "@/components/AuthPage";
import Image from "next/image";
import AlumniImage from "../../../public/people-working-late-their-office.jpg";

const HomePage = () => {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left Section (Image) */}
      <div className="hidden md:flex items-center justify-center bg-[#7FB069]">
        {/* Replace with your image */}
        <div className="w-full">
          <Image src={AlumniImage} alt="Bg image" objectFit="fill" />
        </div>
      </div>

      {/* Right Section (Login/Signup) */}
      <div className="flex items-center justify-center bg-[#FFFBBD] p-6 sm:p-10">
        <div className="">
          <div>
            <AuthPage />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
