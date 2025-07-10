import type { Metadata } from "next";
import "./globals.css";

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'OhMyGerd - GERD Tracking Made Simple',
  description: 'Track your GERD symptoms and manage your health journey with Liao Reflux Relief',
  keywords: ['GERD', 'acid reflux', 'heartburn', 'symptom tracking', 'Liao Reflux Relief'],
  authors: [{ name: 'Liao Herbal' }],
  creator: 'Liao Herbal',
  publisher: 'Liao Herbal',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: process.env.NEXT_PUBLIC_APP_URL ? new URL(process.env.NEXT_PUBLIC_APP_URL) : undefined,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://app.liaoherbal.com',
    title: 'OhMyGerd - GERD Tracking Made Simple',
    description: 'Track your GERD symptoms and manage your health journey with Liao Reflux Relief',
    siteName: 'OhMyGerd',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OhMyGerd - GERD Tracking Made Simple',
    description: 'Track your GERD symptoms and manage your health journey with Liao Reflux Relief',
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
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="min-h-screen" style={{ backgroundColor: '#f6f4f0' }}>
          {children}
        </div>
      </body>
    </html>
  );
}