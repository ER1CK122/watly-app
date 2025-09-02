import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Watly App",
  description: "App para monitorar e incentivar o consumo diário de água, com metas personalizadas e gamificação.💧🚰",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
