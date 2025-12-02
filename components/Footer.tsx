'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from '@/lib/locale';

export default function Footer() {
  const pathname = usePathname();
  const { t, dir } = useLocale();

  // Footer nicht auf Admin-Seiten anzeigen
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-black border-t border-neutral-300 dark:border-neutral-800 transition-colors" dir={dir}>
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
              {t('author.nameShort')}
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
              {t('nav.home')}
            </Link>
            <Link
              href="/courses"
              className={`text-sm transition-colors ${
                pathname?.startsWith('/courses')
                  ? 'text-[#C3E41D]'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-[#C3E41D]'
              }`}
            >
              {t('nav.courses')}
            </Link>
            <Link
              href="/articles"
              className={`text-sm transition-colors ${
                pathname?.startsWith('/articles')
                  ? 'text-[#C3E41D]'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-[#C3E41D]'
              }`}
            >
              {t('nav.articles')}
            </Link>
            <Link
              href="/reviews"
              className={`text-sm transition-colors ${
                pathname === '/reviews'
                  ? 'text-[#C3E41D]'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-[#C3E41D]'
              }`}
            >
              {t('nav.reviews')}
            </Link>
            <Link
              href="/contact"
              className={`text-sm transition-colors ${
                pathname === '/contact'
                  ? 'text-[#C3E41D]'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-[#C3E41D]'
              }`}
            >
              {t('nav.contact')}
            </Link>
          </nav>

          {/* Copyright */}
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            {t('footer.copyright', { year: currentYear })}
          </div>
        </div>
      </div>
    </footer>
  );
}

