import { Sora, Inter } from "next/font/google";
import "./globals.css";

import { AuthBootstrapper } from "@/components/auth/auth-bootstrapper";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "PostReach | Social media management made simple",
  description: "Plan, schedule, and post across multiple social media apps from one workspace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${inter.variable} ${inter.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthBootstrapper />
        {children}
      </body>
    </html>
  );
}
