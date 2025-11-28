import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Article from '@/models/Article';

// GET - Öffentliche Artikel abrufen
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language');
    const limit = parseInt(searchParams.get('limit') || '10');

    const query: any = { status: 'published' };
    
    const articles = await Article.find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(limit);

    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

