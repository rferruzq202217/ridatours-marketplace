import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ridatours - Descubre el mundo",
  description: "Las mejores experiencias en las ciudades más increíbles",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        {children}
        <Script 
          src="https://widgets.regiondo.net/booking/v1/booking-widget.min.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
