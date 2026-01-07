import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "K-EXAONE Chat | LG AI Research",
  description: "Chat with K-EXAONE, a powerful AI assistant developed by LG AI Research. Experience advanced reasoning and helpful responses.",
  keywords: ["AI", "Chat", "K-EXAONE", "LG AI Research", "Language Model"],
  authors: [{ name: "LG AI Research" }],
  openGraph: {
    title: "K-EXAONE Chat",
    description: "Chat with K-EXAONE, a powerful AI assistant",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
      </head>
      <body
        className={`${plusJakarta.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
