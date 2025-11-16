import type { Metadata } from "next";
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
      </body>
    </html>
  );
}
