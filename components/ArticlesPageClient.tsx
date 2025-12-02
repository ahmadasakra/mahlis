'use client';

import Link from 'next/link';
import { useLocale } from '@/lib/locale';

interface Article {
  _id: string;
  titleDe: string;
  titleAr?: string;
  contentDe: string;
  contentAr?: string;
  excerptDe?: string;
  excerptAr?: string;
  featuredImage?: string;
  publishedAt?: string;
  createdAt: string;
}

interface ArticlesPageClientProps {
  articles: Article[];
}

export default function ArticlesPageClient({ articles }: ArticlesPageClientProps) {
  const { t, dir, locale } = useLocale();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white pt-24 px-6 pb-12 transition-colors" dir={dir}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center" style={{ color: '#C3E41D' }}>
          {t('articles.title')}
        </h1>

        {articles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-neutral-500 dark:text-neutral-400 text-lg">{t('articles.noArticles')}</p>
          </div>
        ) : (
          <div className="space-y-8">
            {articles.map((article) => (
              <article
                key={article._id}
                className="bg-neutral-100 dark:bg-neutral-900 rounded-lg overflow-hidden hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors border border-neutral-300 dark:border-neutral-800"
              >
                <Link href={`/articles/${article._id}`}>
                  {article.featuredImage && (
                    <div className="w-full h-64 overflow-hidden">
                      <img
                        src={article.featuredImage}
                        alt={locale === 'ar' && article.titleAr ? article.titleAr : article.titleDe}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-2 hover:underline" style={{ color: '#C3E41D' }}>
                      {locale === 'ar' && article.titleAr ? article.titleAr : article.titleDe}
                    </h2>
                    {locale === 'de' && article.titleAr && (
                      <h3 className="text-xl mb-3 text-neutral-600 dark:text-neutral-400" dir="rtl">{article.titleAr}</h3>
                    )}
                    {locale === 'ar' && article.titleDe && (
                      <h3 className="text-xl mb-3 text-neutral-600 dark:text-neutral-400" dir="ltr">{article.titleDe}</h3>
                    )}
                    
                    {(article.excerptDe || article.excerptAr) && (
                      <div className="mb-4">
                        {locale === 'ar' && article.excerptAr ? (
                          <p className="text-neutral-700 dark:text-neutral-300 mb-2 line-clamp-3" dir="rtl">
                            {article.excerptAr}
                          </p>
                        ) : article.excerptDe ? (
                          <p className="text-neutral-700 dark:text-neutral-300 mb-2 line-clamp-3">
                            {article.excerptDe}
                          </p>
                        ) : null}
                        {locale === 'de' && article.excerptAr && (
                          <p className="text-neutral-700 dark:text-neutral-300 line-clamp-3" dir="rtl">
                            {article.excerptAr}
                          </p>
                        )}
                      </div>
                    )}
                    
                    <div className={`flex items-center justify-between mt-4 pt-4 border-t border-neutral-300 dark:border-neutral-800 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <span className="text-sm text-neutral-500 dark:text-neutral-400">
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
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

