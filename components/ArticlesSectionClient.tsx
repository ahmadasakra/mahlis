'use client';

import Link from 'next/link';
import { useLocale } from '@/lib/locale';

interface Article {
  _id: string;
  titleDe: string;
  titleAr?: string;
  excerptDe?: string;
  excerptAr?: string;
  featuredImage?: string;
  publishedAt?: string;
  createdAt: string;
}

interface ArticlesSectionClientProps {
  articles: Article[];
}

export default function ArticlesSectionClient({ articles }: ArticlesSectionClientProps) {
  const { t, dir, locale } = useLocale();

  if (articles.length === 0) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'de-DE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <section id="articles" className="min-h-screen bg-white dark:bg-black text-black dark:text-white pt-24 px-6 pb-12 transition-colors" dir={dir}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center" style={{ color: '#C3E41D' }}>
          {t('articles.latest')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {articles.map((article) => (
            <Link
              key={article._id}
              href={`/articles/${article._id}`}
              className="block bg-neutral-100 dark:bg-neutral-900 rounded-lg overflow-hidden hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors border border-neutral-300 dark:border-neutral-800"
            >
              {article.featuredImage && (
                <div className="w-full h-48 overflow-hidden">
                  <img
                    src={article.featuredImage}
                    alt={locale === 'ar' && article.titleAr ? article.titleAr : article.titleDe}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 hover:underline" style={{ color: '#C3E41D' }}>
                  {locale === 'ar' && article.titleAr ? article.titleAr : article.titleDe}
                </h3>
                {locale === 'de' && article.titleAr && (
                  <h4 className="text-lg mb-3 text-neutral-600 dark:text-neutral-400" dir="rtl">
                    {article.titleAr}
                  </h4>
                )}
                {locale === 'ar' && article.titleDe && (
                  <h4 className="text-lg mb-3 text-neutral-600 dark:text-neutral-400" dir="ltr">
                    {article.titleDe}
                  </h4>
                )}
                
                {(article.excerptDe || article.excerptAr) && (
                  <div className="mb-4">
                    {locale === 'ar' && article.excerptAr ? (
                      <p className="text-neutral-700 dark:text-neutral-300 text-sm mb-2 line-clamp-3" dir="rtl">
                        {article.excerptAr}
                      </p>
                    ) : article.excerptDe ? (
                      <p className="text-neutral-700 dark:text-neutral-300 text-sm mb-2 line-clamp-3">
                        {article.excerptDe}
                      </p>
                    ) : null}
                    {locale === 'de' && article.excerptAr && (
                      <p className="text-neutral-700 dark:text-neutral-300 text-sm line-clamp-3" dir="rtl">
                        {article.excerptAr}
                      </p>
                    )}
                  </div>
                )}
                
                <div className={`flex items-center justify-between mt-4 pt-4 border-t border-neutral-300 dark:border-neutral-800 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    {article.publishedAt
                      ? formatDate(article.publishedAt)
                      : formatDate(article.createdAt)}
                  </span>
                  <span className="text-sm text-[#C3E41D] hover:underline">
                    {dir === 'rtl' ? `← ${t('articles.readMore')}` : `${t('articles.readMore')} →`}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/articles"
            className="inline-block px-6 py-3 rounded-lg font-semibold transition-colors"
            style={{ backgroundColor: '#C3E41D', color: '#000' }}
          >
            {t('articles.viewAll')}
          </Link>
        </div>
      </div>
    </section>
  );
}

