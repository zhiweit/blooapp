import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextUIProvider } from "@nextui-org/system";
import NavBar from "./_components/NavBar";

export const metadata: Metadata = {
  title: "Bloo",
  description:
    "Bloo is a web app that provides recycling instructions for items in Singapore ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <NextUIProvider>{children}</NextUIProvider>
      </body>
    </html>
  );
}
