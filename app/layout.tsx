import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { Toaster } from "@/components/ui/toaster";
import LayoutProvider from "@/components/layout-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
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
  icons: { apple: "/og.png" },
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LayoutProvider>
            <>
              <div className="flex h-screen bg-background text-foreground">
                <Sidebar className="flex-shrink-0" />
                <main className="flex-1 flex flex-col overflow-hidden">
                  <Header />
                  {children}
                </main>
              </div>
              <Toaster />
            </>
          </LayoutProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
