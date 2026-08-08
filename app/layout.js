import { Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata = {
  metadataBase: new URL('https://imageconvert.org'), // Fallback URL, update during production deploy
  title: {
    default: 'ImageConvert - Fast, Free & Local Online Image Converter',
    template: '%s | ImageConvert'
  },
  description: 'Convert PNG, JPG, WEBP, GIF, and HEIC images instantly in your browser. 100% private, free, and local conversion with no software installation required.',
  keywords: ['image converter', 'png to webp', 'heic to jpg', 'webp to png', 'local image converter', 'free image conversion'],
  authors: [{ name: 'ImageConvert Team' }],
  creator: 'ImageConvert',
  publisher: 'ImageConvert',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'ImageConvert - Fast, Free & Local Online Image Converter',
    description: 'Convert PNG, JPG, WEBP, GIF, and HEIC images locally in your browser. 100% private, free, and secure.',
    url: 'https://imageconvert.org',
    siteName: 'ImageConvert',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ImageConvert - Local Online Image Converter',
    description: 'Convert images instantly and locally. 100% private.',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} h-full scroll-smooth`}>
      <body className="flex flex-col min-h-screen bg-white font-sans antialiased text-gray-800">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
