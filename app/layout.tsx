import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "X-Teos Pro",
  description: "AI-powered social growth for founders",
  metadataBase: new URL("http://localhost:3000"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
