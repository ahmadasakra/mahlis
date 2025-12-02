import { getBaseUrl } from '@/lib/server-utils';
import ArticlesSectionClient from './ArticlesSectionClient';

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

async function getArticles() {
  try {
    const baseUrl = await getBaseUrl();
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

  return <ArticlesSectionClient articles={articles} />;
}

