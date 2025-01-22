import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import LayoutProvider from "@/components/LayoutProvider";
import { Toaster } from "@/components/ui/sonner";
import Onboarding from "@/components/Onboarding";
import { Analytics } from "@vercel/analytics/react";
import { Suspense } from "react";
import { CSPostHogProvider } from "@/components/providers/PosthogProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.lumeai.xyz"),
  title: "Lume-AI - Multimodal Chat",
  description:
    "Lume-AI is a cutting-edge AI-powered multimodal chat application that revolutionizes the way you interact with artificial intelligence. With advanced natural language processing and computer vision capabilities, Lume-AI enables seamless communication through text, images, and voice. Experience the future of AI chatbots with Lume-AI's intuitive interface, intelligent responses, and personalized conversations.",
  authors: [
    {
      name: "Lume-AI Team",
    },
    {
      name: "Harshit Sharma",
      url: "https://cleverdeveloper.in",
    },
  ],
  openGraph: {
    title: {
      default: "Lume-AI - Multimodal Chat",
      template: "%s | Lume-AI",
    },
    description: "The future of AI-powered multimodal chat",
    images: [
      {
        url: "https://www.lumeai.xyz/og.png",
      },
    ],
    url: "https://www.lumeai.xyz/",
    siteName: "Lume-AI",
    locale: "en_US",
    type: "website",
  },
  manifest: "/manifest.json",
  icons: [
    {
      rel: "icon",
      url: "/logo.svg",
    },
    {
      rel: "apple-touch-icon",
      url: "/og.png",
    },
  ],

  keywords: [
    "Lume-AI",
    "AI chatbot",
    "multimodal chat",
    "artificial intelligence",
    "natural language processing",
    "computer vision",
    "AI-powered conversations",
    "intelligent chatbot",
    "AI assistant",
    "conversational AI",
    "machine learning",
    "deep learning",
    "AI technology",
    "AI innovations",
    "AI chat application",
    "AI chat platform",
    "AI chat interface",
    "AI chat experience",
    "AI chat interactions",
    "AI chat capabilities",
    "AI chat features",
    "AI chat benefits",
    "AI chat advantages",
    "AI chat solutions",
    "AI chat services",
    "AI chat support",
    "AI chat personalization",
    "AI chat customization",
    "AI chat integration",
    "AI chat deployment",
    "AI chat scalability",
    "AI chat performance",
    "AI chat efficiency",
    "AI chat accuracy",
    "AI chat reliability",
    "AI chat security",
    "AI chat privacy",
    "AI chat ethics",
    "AI chat future",
    "AI chat trends",
    "AI chat innovations",
    "AI chat research",
    "AI chat development",
    "AI chat advancements",
  ],
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense>
          <CSPostHogProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              forcedTheme="dark"
              disableTransitionOnChange
            >
              <LayoutProvider>{children}</LayoutProvider>
              <Toaster />
              <Onboarding />
            </ThemeProvider>
            <Analytics />
          </CSPostHogProvider>
        </Suspense>
      </body>
    </html>
  );
}
