import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Teos AI Engine — AI Content for Social Media',
  description: 'Generate discoverable, high-impact social media posts with AI. Built by Elmahrosa International.',
  openGraph: {
    title: 'Teos AI Engine',
    description: 'AI-powered social content generation for X, Facebook, Instagram, LinkedIn.',
    url: 'https://teos.elmahrosa.com',
    siteName: 'Teos AI Engine',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0f]">{children}</body>
    </html>
  );
}
