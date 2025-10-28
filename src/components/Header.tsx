"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Image from "next/image";
import logo from "../../public/Alumnet_logo.png";

const Header: React.FC = () => {
  const [user, setUser] = useState<any | null>(null);
  const router = useRouter();
  // router.refresh();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    // console.log(stored);
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    router.push("/");
  };

  if (!user) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#121212]/80 backdrop-blur-md border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3">
          <Image src={logo} width={30} height={30} alt="Alumnet Logo" />
          <span className="text-lg font-semibold text-white tracking-wide">
            Alumnet
          </span>
        </Link>

        {/* User Section */}
        <div className="flex items-center space-x-4">
          {/* Profile image or initial */}
          {user.profileImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.profileImage}
              alt={user.username || "profile"}
              className="w-9 h-9 rounded-full object-cover"
            />
          ) : (
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold ring-white ring-1">
              {(user?.username?.charAt(0) || "?").toUpperCase()}
            </div>
          )}

          <div className="hidden sm:flex flex-col text-right">
            <span className="font-medium text-sm text-white">
              {user.username}
            </span>
            <span className="text-xs text-gray-400 capitalize">
              {user.role}
            </span>
          </div>
          <Button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-white/10 transition bg-background ring-primary ring-1"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
