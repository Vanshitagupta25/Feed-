import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Feed - Community Platform",
  description: "A modern community feed platform for discussions and sharing",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-[#242424]">
      <body className="min-h-screen bg-[#242424] text-[#f5f5f5] antialiased">
        {children}
      </body>
    </html>
  );
}
