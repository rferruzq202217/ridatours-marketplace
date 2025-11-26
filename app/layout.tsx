import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.ridatours.com'),
  title: {
    default: "Ridatours - Tours y Experiencias en Europa",
    template: "%s | Ridatours"
  },
  description: "Descubre las mejores experiencias turísticas en Europa. Tours, entradas a monumentos, actividades y más en Roma, París, Barcelona, Madrid y otras ciudades.",
  keywords: ["tours", "experiencias", "viajes", "Europa", "Roma", "París", "Barcelona", "entradas", "monumentos", "actividades"],
  authors: [{ name: "Ridatours" }],
  creator: "Ridatours",
  publisher: "Ridatours",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://www.ridatours.com",
    siteName: "Ridatours",
    title: "Ridatours - Tours y Experiencias en Europa",
    description: "Descubre las mejores experiencias turísticas en Europa. Tours, entradas a monumentos, actividades y más.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ridatours - Tours y Experiencias en Europa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ridatours - Tours y Experiencias en Europa",
    description: "Descubre las mejores experiencias turísticas en Europa.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'tu-codigo-de-verificacion', // Añadir después
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
