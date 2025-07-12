import type { Metadata } from "next";
import { gangwonEdu, pretendard } from "@/public/fonts/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "POLAR",
  description: "봉사활동이 즐거워지는 곳",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${gangwonEdu.variable} ${pretendard.variable}`}>
        <main className="main-container">{children}</main>
      </body>
    </html>
  );
}
