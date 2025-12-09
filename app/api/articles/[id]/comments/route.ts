import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Comment from '@/models/Comment';
import Article from '@/models/Article';

// GET - Kommentare für einen Artikel abrufen
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    // Prüfe ob Artikel existiert
    const article = await Article.findById(id);
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // Nur genehmigte Kommentare abrufen
    const comments = await Comment.find({ 
      articleId: id, 
      isApproved: true 
    })
      .sort({ createdAt: -1 });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Neuen Kommentar erstellen
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const data = await request.json();
    const { authorName, authorEmail, content } = data;

    // Validiere Artikel existiert
    const article = await Article.findById(id);
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // Validiere Eingaben
    if (!authorName || !authorName.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Comment content is required' }, { status: 400 });
    }

    // Erstelle Kommentar (standardmäßig nicht genehmigt für Moderation)
    const comment = await Comment.create({
      articleId: id,
      authorName: authorName.trim(),
      authorEmail: authorEmail?.trim(),
      content: content.trim(),
      isApproved: false, // Kommentare müssen erst genehmigt werden
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}



