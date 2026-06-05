import { Sora, Inter } from "next/font/google";
import "./globals.css";

import { Toaster } from "sonner";

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
        <GoogleAuthProvider>{children}</GoogleAuthProvider>
        <Toaster
          position="top-center"
          closeButton
          toastOptions={{
            duration: 5000,
            classNames: {
              toast: "sonner-toast",
              error: "sonner-error",
              success: "sonner-success",
              info: "sonner-info",
              warning: "sonner-warning",
            },
          }}
        />
      </body>
    </html>
  );
}
