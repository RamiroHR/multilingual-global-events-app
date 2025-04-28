import { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const OG_IMAGE_URL = process.env.NEXT_PUBLIC_OG_IMAGE_URL || "http://localhost:3000/astronaut.png";

const en: Metadata = {
  title: "Join The Spot - Discover Global Events",
  description: "A global platform to discover and join events worldwide",

  openGraph: {
    title: "Join The Spot",
    description: "A global platform to discover and join events worldwide",
    url: `${SITE_URL}/en`,
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
    images: [OG_IMAGE_URL],     // For development only
  },
}

export default en;