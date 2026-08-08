'use client';

import Link from 'next/link';
import { Image as ImageIcon } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 text-indigo-600 font-bold text-xl hover:opacity-90 transition">
              <ImageIcon className="h-6 w-6" />
              <span className="tracking-tight text-gray-900 font-extrabold">
                Image<span className="text-indigo-600">Convert</span>
              </span>
            </Link>
        </div>
      </div>
      </div>
    </nav>
  );
}
