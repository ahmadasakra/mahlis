import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';

// POST - Neue allgemeine Bewertung erstellen
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const data = await request.json();
    const { rating, comment, studentName, isAnonymous } = data;

    const review = await Review.create({
      type: 'general',
      rating,
      comment,
      studentName: isAnonymous ? undefined : studentName,
      isAnonymous: isAnonymous || false,
      isPublic: true,
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Error creating general review:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET - Allgemeine Bewertungen abrufen
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const reviews = await Review.find({ 
      type: 'general',
      isPublic: true 
    })
      .sort({ createdAt: -1 })
      .limit(100);

    // Berechne Durchschnittsbewertung
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    return NextResponse.json({ reviews, averageRating: avgRating, total: reviews.length });
  } catch (error) {
    console.error('Error fetching general reviews:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}



