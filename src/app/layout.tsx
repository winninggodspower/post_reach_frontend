import { Sora, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

import { Toaster } from "sonner";
import { GoogleAnalytics } from '@next/third-parties/google'

import { AuthBootstrapper } from "@/features/auth/components/auth-bootstrapper";
import { GoogleAuthProvider } from "@/features/auth/components/google-auth-provider";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["italic"],
});

export const metadata = {
  title: "PostGlee | Social media management made simple",
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
      className={`${sora.variable} ${inter.variable} ${playfair.variable} ${inter.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthBootstrapper />
        <GoogleAuthProvider>{children}</GoogleAuthProvider>
        <Toaster
          position="top-center"
          richColors
          closeButton
          theme="dark"
          toastOptions={{ duration: 5000 }}
        />
        <GoogleAnalytics gaId="G-HQWEXW0R62" />
      </body>
    </html>
  );
}
