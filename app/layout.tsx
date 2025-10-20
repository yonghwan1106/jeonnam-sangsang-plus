import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "상상 더하기+ | 전남형 AI 정책 발굴 플랫폼",
  description: "2025년 전라남도 정책 아이디어 공모전 출품작 - 데이터와 AI의 창의성으로 전라남도의 정책 혁신을 가속화하는 핵심 의사결정 지원 플랫폼",
  keywords: ["전라남도", "정책 아이디어", "AI", "Claude", "정책 발굴", "공모전", "2025"],
  authors: [{ name: "상상 더하기+ 팀" }],
  openGraph: {
    title: "상상 더하기+ | 전남형 AI 정책 발굴 플랫폼",
    description: "2025년 전라남도 정책 아이디어 공모전 출품작",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
