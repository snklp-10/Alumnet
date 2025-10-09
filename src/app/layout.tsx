import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { twMerge } from "tailwind-merge";
import dbConnect from "@/lib/dbConfig/db";

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
    <html lang="en" suppressHydrationWarning>
      <body className={twMerge("bg-background", inter.className)}>
        {children}
      </body>
    </html>
  );
}
