import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const OG_IMAGE_URL = process.env.NEXT_PUBLIC_OG_IMAGE_URL || "http://localhost:3000/astronaut.png";

// Fallback metadata, including Open Graph & Twitter cards
export const metadata: Metadata = {
  title: "Join The Spot - Discover Global Events",
  description: "A global platform to discover and join events worldwide",
  openGraph: {
    title: "Join The Spot",
    description: "A global platform to discover and join events worldwide",
    url: SITE_URL,
    siteName: "Join The Spot",
    images: [
      {
        url: OG_IMAGE_URL,
        width: 475,
        height: 526,
        alt: "Join The Spot - Discover Global Events",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Join The Spot",
    description: "A global platform to discover and join events worldwide.",
    images: [OG_IMAGE_URL],
  },
};


// Root layout - define html structure and global variables
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
