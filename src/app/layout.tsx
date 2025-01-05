import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { OpenPanelProvider } from "@/lib/analytics/openpanel/OpenPanelProvider";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Declan Kramper | Personal Portfolio",
  description: "The online portfolio of Declan Kramper",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${plusJakartaSans.variable} font-sans antialiased`} suppressHydrationWarning>
        <OpenPanelProvider />
        <Header />  
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
