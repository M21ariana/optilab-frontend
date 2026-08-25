import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OptiLab",
  description: "Smart laboratory inventory optimization platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}