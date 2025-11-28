'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Locale = 'de' | 'ar';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const translations: Record<Locale, Record<string, string>> = {
  de: {
    'nav.home': 'HOME',
    'nav.courses': 'KURSE',
    'nav.articles': 'ARTIKEL',
    'nav.contact': 'KONTAKT',
    'home.tagline': 'Journalismus & Online-Unterricht',
    'courses.title': 'Meine Kurse',
    'courses.noCourses': 'Noch keine Kurse verfügbar.',
    'articles.title': 'Artikel & Texte',
    'articles.noArticles': 'Noch keine Artikel verfügbar.',
    'contact.title': 'Kontakt',
  },
  ar: {
    'nav.home': 'الرئيسية',
    'nav.courses': 'الدورات',
    'nav.articles': 'المقالات',
    'nav.contact': 'اتصل بنا',
    'home.tagline': 'الصحافة والتعليم عبر الإنترنت',
    'courses.title': 'دوراتي',
    'courses.noCourses': 'لا توجد دورات متاحة بعد.',
    'articles.title': 'المقالات والنصوص',
    'articles.noArticles': 'لا توجد مقالات متاحة بعد.',
    'contact.title': 'اتصل بنا',
  },
};

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('de');

  useEffect(() => {
    // Nur im Client ausführen
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('locale') as Locale;
      if (saved && (saved === 'de' || saved === 'ar')) {
        setLocaleState(saved);
      }
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', newLocale);
      document.documentElement.lang = newLocale;
      document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
    }
  };

  useEffect(() => {
    // Nur im Client ausführen
    if (typeof window !== 'undefined') {
      document.documentElement.lang = locale;
      document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    }
  }, [locale]);

  const t = (key: string): string => {
    return translations[locale][key] || key;
  };

  return (
    <LocaleContext.Provider
      value={{
        locale,
        setLocale,
        t,
        dir: locale === 'ar' ? 'rtl' : 'ltr',
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}

