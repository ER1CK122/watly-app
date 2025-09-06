import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const interSans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  authors: [{ name: "Erick Nunes", url: "https://github.com/ER1CK122" }],
  title: "Watly-app",
  description: "App para monitorar e incentivar o consumo diário de água, com metas personalizadas e gamificação. 💧🚰",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <head>
        <meta name="copyright" content="© 2025 Erick Nunes" />
      </head>
      <body
        className={`${interSans.variable} antialiased dark`}
      >
        {children}
      </body>
    </html>
  );
}
