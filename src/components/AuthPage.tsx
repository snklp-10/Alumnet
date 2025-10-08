"use client";

import { useState } from "react";
import LoginPage from "../app/(auth)/login/page"; // adjust the path
import SignUpPage from "../app/(auth)/signup/page"; // adjust the path
import { Button } from "./ui/button";

export default function AuthPage() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="min-h-screen flex justify-center items-center ">
      <div className="w-full max-w-md">
        {/* Toggle Buttons */}
        <div className="flex justify-center mb-4 space-x-3">
          <Button
            className={`px-4 py-2 rounded-l-lg ${
              showLogin
                ? "bg-primary text-[#B9F18C]"
                : "bg-[#C2F970] text-black hover:text-white"
            }`}
            onClick={() => setShowLogin(true)}
          >
            Login
          </Button>
          <Button
            className={`px-4 py-2 rounded-r-lg ${
              !showLogin
                ? "bg-primary text-[#B9F18C]"
                : "bg-[#C2F970] text-black hover:text-white"
            }`}
            onClick={() => setShowLogin(false)}
          >
            Sign Up
          </Button>
        </div>

        {/* Render Forms */}
        <div className="border rounded-xl bg-white/60 ">
          {showLogin ? <LoginPage /> : <SignUpPage />}
        </div>
      </div>
    </div>
  );
}
