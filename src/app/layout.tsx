import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { OpenPanelProvider } from "@/lib/analytics/openpanel/OpenPanelProvider";
import { Toaster } from "sonner";
import { PostHogProvider } from "@/lib/analytics/posthog/PostHogProvider";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: {
    template: '%s | Declan Kramper',
    default: 'Declan Kramper | Personal Portfolio'
  },
  description: "A place on the internet for some of my thoughts and projects",

    // Open Graph metadata for rich sharing previews
    openGraph: {
      title: "Declan Kramper | Personal Portfolio",
      description: "A place on the internet for some of my thoughts and projects",
      url: process.env.NEXT_PUBLIC_BASE_URL,
      siteName: "Declan Kramper",
      images: [
        {
          url: "/og-image.png", // This should be 1200x630px for optimal sharing
          width: 1200,
          height: 630,
          alt: "Declan Kramper Preview",
        }
      ],
      locale: "en_US",
      type: "website",
    },

  // Favicon and manifest
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png" },
      { url: "/apple-touch-icon-precomposed.png" }
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${plusJakartaSans.variable} font-sans antialiased`} suppressHydrationWarning>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <PostHogProvider>
          <OpenPanelProvider />
          <Header />  
          <main id="main-content">{children}</main>
          <Footer />
          <Toaster />
        </PostHogProvider>
      </body>
    </html>
  );
}
