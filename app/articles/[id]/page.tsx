import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBaseUrl } from '@/lib/utils';

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

async function getArticle(id: string) {
  try {
    const baseUrl = await getBaseUrl();
    const res = await fetch(`${baseUrl}/api/articles/${id}`, { 
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article: Article | null = await getArticle(id);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white pt-24 px-6 pb-12 transition-colors">
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/articles" 
          className="inline-block mb-6 text-neutral-600 dark:text-neutral-400 hover:text-[#C3E41D] transition-colors"
        >
          ← Zurück zu den Artikeln
        </Link>

        <article className="prose prose-invert max-w-none">
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#C3E41D' }}>
              {article.titleDe}
            </h1>
            {article.titleAr && (
              <h2 className="text-2xl md:text-3xl mb-6 text-neutral-600 dark:text-neutral-400" dir="rtl">
                {article.titleAr}
              </h2>
            )}
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
              {article.publishedAt
                ? new Date(article.publishedAt).toLocaleDateString('de-DE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : new Date(article.createdAt).toLocaleDateString('de-DE')}
            </p>
            {article.featuredImage && (
              <div className="w-full mb-8 rounded-lg overflow-hidden">
                <img
                  src={article.featuredImage}
                  alt={article.titleDe}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
          </header>

          <div className="article-content text-neutral-700 dark:text-neutral-300 leading-relaxed">
            <div 
              className="mb-8 prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: article.contentDe }}
            />
            {article.contentAr && (
              <div 
                className="mt-8 prose prose-lg dark:prose-invert max-w-none" 
                dir="rtl"
                dangerouslySetInnerHTML={{ __html: article.contentAr }}
              />
            )}
          </div>
        </article>
      </div>
    </div>
  );
}

