import Link from 'next/link';

interface Article {
  _id: string;
  titleDe: string;
  titleAr?: string;
  contentDe: string;
  contentAr?: string;
  excerptDe?: string;
  excerptAr?: string;
  publishedAt?: string;
  createdAt: string;
}

async function getArticles() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/articles?limit=20`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

export default async function ArticlesPage() {
  const articles: Article[] = await getArticles();

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-6 pb-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center" style={{ color: '#C3E41D' }}>
          Artikel & Texte
        </h1>

        {articles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-neutral-500 text-lg">Noch keine Artikel verfügbar.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {articles.map((article) => (
              <article
                key={article._id}
                className="bg-neutral-900 rounded-lg p-6 hover:bg-neutral-800 transition-colors border border-neutral-800"
              >
                <Link href={`/articles/${article._id}`}>
                  <h2 className="text-2xl font-bold mb-2 hover:underline" style={{ color: '#C3E41D' }}>
                    {article.titleDe}
                  </h2>
                  {article.titleAr && (
                    <h3 className="text-xl mb-3 text-neutral-400" dir="rtl">{article.titleAr}</h3>
                  )}
                  
                  {(article.excerptDe || article.excerptAr) && (
                    <div className="mb-4">
                      {article.excerptDe && (
                        <p className="text-neutral-300 mb-2 line-clamp-3">
                          {article.excerptDe}
                        </p>
                      )}
                      {article.excerptAr && (
                        <p className="text-neutral-300 line-clamp-3" dir="rtl">
                          {article.excerptAr}
                        </p>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-800">
                    <span className="text-sm text-neutral-500">
                      {article.publishedAt
                        ? new Date(article.publishedAt).toLocaleDateString('de-DE', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        : new Date(article.createdAt).toLocaleDateString('de-DE')}
                    </span>
                    <span className="text-sm text-[#C3E41D] hover:underline">
                      Weiterlesen →
                    </span>
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

