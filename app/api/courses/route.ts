import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Course from '@/models/Course';
import Review from '@/models/Review';

// GET - Öffentliche Kurse abrufen
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language');
    const includeArchived = searchParams.get('archived') === 'true';

    const query: any = { status: 'published' };
    if (language && language !== 'all') {
      query.$or = [
        { language },
        { language: 'both' },
      ];
    }
    if (!includeArchived) {
      query.status = 'published';
    }

    const courses = await Course.find(query).sort({ createdAt: -1 });

    // Füge Bewertungsstatistiken hinzu
    const coursesWithStats = await Promise.all(
      courses.map(async (course) => {
        const reviews = await Review.find({ 
          courseId: course._id, 
          isPublic: true 
        });
        const avgRating = reviews.length > 0
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          : 0;

        return {
          ...course.toObject(),
          reviewCount: reviews.length,
          averageRating: Math.round(avgRating * 10) / 10,
        };
      })
    );

    return NextResponse.json(coursesWithStats);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

