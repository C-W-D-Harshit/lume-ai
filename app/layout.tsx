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
  title: "Lume-AI - Multimodal Chat",
  description: "A cutting-edge AI-powered multimodal chat application",
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
