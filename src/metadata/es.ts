import { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const OG_IMAGE_URL = process.env.NEXT_PUBLIC_OG_IMAGE_URL || "http://localhost:3000/astronaut.png";

const es: Metadata = {
  title: "Sumate al Spot - Descubre Eventos Globales",
  description:
    "Explora y únete a eventos en todo el mundo. " +
    "Encuentra, comparte y vive eventos globales en tu idioma con Join The Spot.",

  openGraph: {
    title: "Únete al Spot - Descubre Eventos Globales",
    description: "Explora y únete a eventos en todo el mundo. Encuentra, comparte y vive eventos globales en cualquier idioma.",
    url: `${SITE_URL}/es`,
    siteName: "Únete al Spot",
    images: [
      {
        url: OG_IMAGE_URL,
        width: 475,
        height: 526,
        alt: "Únete al Spot - Descubre Eventos Globales",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Únete al Spot - Descubre Eventos Globales",
    description: "Explora y únete a eventos en todo el mundo en tu idioma.",
    images: [OG_IMAGE_URL],     // For development only
  },
}

export default es;