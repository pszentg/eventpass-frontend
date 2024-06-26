import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_TITLE
    ? process.env.NEXT_PUBLIC_TITLE
    : "EventPass",
  description: process.env.NEXT_PUBLIC_TITLE
    ? process.env.NEXT_PUBLIC_TITLE + " powered by EventPass"
    : "EventPass",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
