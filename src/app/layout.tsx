import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import AuthContext from "../providers/AuthContext";

export const metadata: Metadata = {
  // TODO: Update metadata
  title: "SADA COIN",
  description: "경기북과학고등학교 2025년 학술발표회 공식 코인입니다!",
};

const pretendard = localFont({
  src: "../../static/fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={pretendard.className}>
        <AuthContext>
          <Header />
          {children}
          <Footer />
        </AuthContext>
      </body>
    </html>
  );
}
