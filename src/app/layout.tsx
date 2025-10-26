import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { twMerge } from "tailwind-merge";
import dbConnect from "@/lib/dbConfig/db";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";

const inter = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Alumnet",
  description:
    "A digital bridge connecting students and alumni across generations",
};

dbConnect();
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={twMerge("bg-background", inter.className)}
      >
        <Header />
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
