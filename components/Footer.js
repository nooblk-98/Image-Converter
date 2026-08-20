'use client';

import { Image as ImageIcon } from 'lucide-react';
import VisitCounter from './VisitCounter';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-gray-400 border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2 text-white font-bold text-lg">
            <ImageIcon className="h-5 w-5 text-indigo-500" />
            <span>
              Image<span className="text-indigo-500">Convert</span>
            </span>
          </div>
          <p className="text-xs text-gray-500 text-center md:text-left leading-relaxed max-w-md">
            Fast, secure, and 100% client-side image conversion tool. Convert PNG, JPG, WEBP, GIF, and HEIC files locally in your browser. Your images never touch our servers.
          </p>
          <div className="flex flex-col items-center md:items-end gap-2">
            <VisitCounter />
            <div className="text-xs text-gray-500 font-mono text-center md:text-right">
              &copy; {currentYear} ImageConvert. All rights reserved.
              <br />
              Made with ❤️ for developers.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
