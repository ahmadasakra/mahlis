'use client';

import Link from 'next/link';
import { useLocale } from '@/lib/locale';
import SocialMediaShare from './SocialMediaShare';
import ArticleClient from '@/app/articles/[id]/ArticleClient';

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

interface ArticleDetailClientProps {
  article: Article;
  articleUrl: string;
}

export default function ArticleDetailClient({ article, articleUrl }: ArticleDetailClientProps) {
  const { t, dir, locale } = useLocale();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const shareDescription = locale === 'ar' && article.excerptAr ? article.excerptAr : (article.excerptDe || '');

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white pt-24 px-6 pb-12 transition-colors" dir={dir}>
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/articles" 
          className={`inline-block mb-6 text-neutral-600 dark:text-neutral-400 hover:text-[#C3E41D] transition-colors ${dir === 'rtl' ? 'flex items-center gap-2' : ''}`}
        >
          {dir === 'rtl' ? `← ${t('articles.backToArticles')}` : `${t('articles.backToArticles')} →`}
        </Link>

        <article className="prose prose-invert max-w-none">
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#C3E41D' }}>
              {locale === 'ar' && article.titleAr ? article.titleAr : article.titleDe}
            </h1>
            {locale === 'de' && article.titleAr && (
              <h2 className="text-2xl md:text-3xl mb-6 text-neutral-600 dark:text-neutral-400" dir="rtl">
                {article.titleAr}
              </h2>
            )}
            {locale === 'ar' && article.titleDe && (
              <h2 className="text-2xl md:text-3xl mb-6 text-neutral-600 dark:text-neutral-400" dir="ltr">
                {article.titleDe}
              </h2>
            )}
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
              {article.publishedAt
                ? formatDate(article.publishedAt)
                : formatDate(article.createdAt)}
            </p>
            {article.featuredImage && (
              <div className="w-full mb-8 rounded-lg overflow-hidden">
                <img
                  src={article.featuredImage}
                  alt={locale === 'ar' && article.titleAr ? article.titleAr : article.titleDe}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
          </header>

          <div className="article-content text-neutral-700 dark:text-neutral-300 leading-relaxed">
            <div 
              className="mb-8 prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: locale === 'ar' && article.contentAr ? article.contentAr : article.contentDe }}
              dir={locale === 'ar' && article.contentAr ? 'rtl' : 'ltr'}
            />
            {locale === 'de' && article.contentAr && (
              <div 
                className="mt-8 prose prose-lg dark:prose-invert max-w-none" 
                dir="rtl"
                dangerouslySetInnerHTML={{ __html: article.contentAr }}
              />
            )}
            {locale === 'ar' && article.contentDe && (
              <div 
                className="mt-8 prose prose-lg dark:prose-invert max-w-none" 
                dir="ltr"
                dangerouslySetInnerHTML={{ __html: article.contentDe }}
              />
            )}
          </div>
        </article>

        {/* Social Media Sharing */}
        <SocialMediaShare 
          url={articleUrl}
          title={locale === 'ar' && article.titleAr ? article.titleAr : article.titleDe}
          description={shareDescription}
        />

        {/* Kommentare */}
        <ArticleClient articleId={article._id} />
      </div>
    </div>
  );
}



