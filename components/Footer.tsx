'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  // Footer nicht auf Admin-Seiten anzeigen
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-black border-t border-neutral-300 dark:border-neutral-800 transition-colors">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo/Signature */}
          <div className="flex items-center gap-2">
            <div 
              className="text-3xl" 
              style={{ 
                color: '#C3E41D', 
                fontFamily: "'Brush Script MT', 'Lucida Handwriting', cursive" 
              }}
            >
              R
            </div>
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              Rita Mahlis
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6">
            <Link
              href="/"
              className={`text-sm transition-colors ${
                pathname === '/'
                  ? 'text-[#C3E41D]'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-[#C3E41D]'
              }`}
            >
              Home
            </Link>
            <Link
              href="/courses"
              className={`text-sm transition-colors ${
                pathname?.startsWith('/courses')
                  ? 'text-[#C3E41D]'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-[#C3E41D]'
              }`}
            >
              Kurse
            </Link>
            <Link
              href="/articles"
              className={`text-sm transition-colors ${
                pathname?.startsWith('/articles')
                  ? 'text-[#C3E41D]'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-[#C3E41D]'
              }`}
            >
              Artikel
            </Link>
            <Link
              href="/contact"
              className={`text-sm transition-colors ${
                pathname === '/contact'
                  ? 'text-[#C3E41D]'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-[#C3E41D]'
              }`}
            >
              Kontakt
            </Link>
          </nav>

          {/* Copyright */}
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            © {currentYear} Rita Mahlis
          </div>
        </div>
      </div>
    </footer>
  );
}

