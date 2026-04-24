import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hourly — Demo web',
  description: 'Counselor dashboard and public demo pages for Hourly.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
