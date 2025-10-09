"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const WelcomePage = () => {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUsername(parsedUser.username);
    }
  }, []);

  if (!username) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FFFBBD]">
        <p className="text-gray-500 text-lg">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#FFFBBD]">
      <Card className="w-full max-w-md text-center shadow-lg rounded-2xl bg-white/60">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Welcome, {username}! 👋
          </CardTitle>
          {/* <CardDescription className="text-green-900">
            to Alument
          </CardDescription> */}
        </CardHeader>

        <CardContent>
          <p className="text-gray-600">You have successfully logged in.</p>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">We’re glad to have you here.</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default WelcomePage;
