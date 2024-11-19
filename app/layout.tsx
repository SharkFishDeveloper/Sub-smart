import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Appbar from "./components/Appbar";
import { Providers } from "./components/provider";

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
  title: "Subsmart",
  description: "Subscription reminder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <Appbar/>
        {children}
      </body>
    </html>
    </Providers>
  );
}
