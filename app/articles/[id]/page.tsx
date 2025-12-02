import { notFound } from 'next/navigation';
import { getBaseUrl } from '@/lib/server-utils';
import ArticleDetailClient from '@/components/ArticleDetailClient';

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

  // Konstruiere die vollständige URL für Sharing
  const baseUrl = await getBaseUrl();
  const articleUrl = `${baseUrl}/articles/${id}`;

  return <ArticleDetailClient article={article} articleUrl={articleUrl} />;
}

