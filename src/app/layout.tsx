// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "next-auth/react";
import NavBar from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Himay's Developer Projects",
  description: "A collection of development projects by Himay Hue, showcasing web apps, experiments, and more.",
  metadataBase: new URL("https://himayhue.com"),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Himay's Developer Projects",
    description: "Explore various development projects created by Himay Hue.",
    url: "https://himayhue.com",
    siteName: "Himay's Developer Projects",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Himay's Developer Projects OpenGraph Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-dvh flex flex-col`}>
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <NavBar />
            <main className="flex-1 /* pl-60 */ overflow-auto">
              {children}
            </main>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
