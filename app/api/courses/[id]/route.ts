import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Course from '@/models/Course';
import Review from '@/models/Review';

// GET - Einzelnen Kurs nach ID abrufen
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const course = await Course.findById(id);

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Nur veröffentlichte Kurse zurückgeben (außer im Admin-Bereich)
    if (course.status !== 'published') {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Bewertungsstatistiken hinzufügen
    const reviews = await Review.find({ 
      courseId: course._id, 
      isPublic: true 
    });
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    const courseWithStats = {
      ...course.toObject(),
      reviewCount: reviews.length,
      averageRating: Math.round(avgRating * 10) / 10,
    };

    return NextResponse.json(courseWithStats);
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

