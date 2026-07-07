import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Lash Haus | Luxury Lash Studio Birmingham",
  description: "Luxury lash extensions, lash lifts and brow treatments in Birmingham."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
