import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';
import Course from '@/models/Course';

// POST - Neue Bewertung erstellen (öffentlich)
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const data = await request.json();
    const { courseId, rating, comment, studentName, isAnonymous } = data;

    // Validiere Kurs existiert
    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Prüfe ob bereits eine Bewertung für diesen Kurs existiert (optional - kann entfernt werden)
    // const existingReview = await Review.findOne({ courseId });
    // if (existingReview) {
    //   return NextResponse.json({ error: 'Review already exists' }, { status: 400 });
    // }

    const review = await Review.create({
      courseId,
      rating,
      comment,
      studentName: isAnonymous ? undefined : studentName,
      isAnonymous: isAnonymous || false,
      isPublic: true,
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET - Öffentliche Bewertungen abrufen
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    const query: any = { isPublic: true };
    if (courseId) {
      query.courseId = courseId;
    }

    const reviews = await Review.find(query)
      .populate('courseId', 'titleDe titleAr')
      .sort({ createdAt: -1 })
      .limit(50);

    // Berechne Durchschnittsbewertung
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    return NextResponse.json({ reviews, averageRating: avgRating, total: reviews.length });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

