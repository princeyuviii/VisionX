export const dynamic = 'force-dynamic';

import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import Navbar from '@/components/Navbar';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'VisionX | AI-Powered Virtual Fashion Studio',
  description: 'Experience the future of fashion with VisionX. Real-time virtual try-on, AI style recommendations, and a global fashion community. Discover your perfect look today.',
  keywords: 'fashion, ai, virtual try-on, augmented reality, style recommendations, fashion community',
  openGraph: {
    title: 'VisionX | AI-Powered Virtual Fashion Studio',
    description: 'Try on the latest trends in real-time with our advanced AI engine.',
    images: ['/og-image.jpg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VisionX | AI-Powered Virtual Fashion Studio',
    description: 'The world\'s most advanced AI for virtual try-on.',
  },
  icons: {
    icon: '/logo2.ico', 
  },
};

import { CartProvider } from '@/context/CartContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.variable} antialiased`}>
          <CartProvider>
            <Navbar />
            <main>{children}</main>
            <Toaster />
          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}