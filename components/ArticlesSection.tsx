import Link from 'next/link';

interface Article {
  _id: string;
  titleDe: string;
  titleAr?: string;
  excerptDe?: string;
  excerptAr?: string;
  publishedAt?: string;
  createdAt: string;
}

async function getArticles() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/articles?limit=6`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

export default async function ArticlesSection() {
  const articles: Article[] = await getArticles();

  if (articles.length === 0) {
    return null;
  }

  return (
    <section id="articles" className="min-h-screen bg-white dark:bg-black text-black dark:text-white pt-24 px-6 pb-12 transition-colors">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center" style={{ color: '#C3E41D' }}>
          Neueste Artikel
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {articles.map((article) => (
            <Link
              key={article._id}
              href={`/articles/${article._id}`}
              className="block bg-neutral-100 dark:bg-neutral-900 rounded-lg p-6 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors border border-neutral-300 dark:border-neutral-800"
            >
              <h3 className="text-xl font-bold mb-2 hover:underline" style={{ color: '#C3E41D' }}>
                {article.titleDe}
              </h3>
              {article.titleAr && (
                <h4 className="text-lg mb-3 text-neutral-600 dark:text-neutral-400" dir="rtl">
                  {article.titleAr}
                </h4>
              )}
              
              {(article.excerptDe || article.excerptAr) && (
                <div className="mb-4">
                  {article.excerptDe && (
                    <p className="text-neutral-700 dark:text-neutral-300 text-sm mb-2 line-clamp-3">
                      {article.excerptDe}
                    </p>
                  )}
                  {article.excerptAr && (
                    <p className="text-neutral-700 dark:text-neutral-300 text-sm line-clamp-3" dir="rtl">
                      {article.excerptAr}
                    </p>
                  )}
                </div>
              )}
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-300 dark:border-neutral-800">
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {article.publishedAt
                    ? new Date(article.publishedAt).toLocaleDateString('de-DE', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : new Date(article.createdAt).toLocaleDateString('de-DE')}
                </span>
                <span className="text-sm text-[#C3E41D] hover:underline">
                  Weiterlesen →
                </span>
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
            Alle Artikel anzeigen
          </Link>
        </div>
      </div>
    </section>
  );
}

