import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Course from '@/models/Course';
import Review from '@/models/Review';
import Article from '@/models/Article';
import { isAuthorized } from '@/lib/auth';

// Auth wird jetzt über JWT Token in Cookies gehandhabt

// GET - Alle Daten abrufen
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    
    const courses = await Course.find().sort({ createdAt: -1 });
    const reviews = await Review.find().populate('courseId').sort({ createdAt: -1 });
    const articles = await Article.find().sort({ createdAt: -1 });
    
    // Statistiken
    const stats = {
      totalCourses: courses.length,
      publishedCourses: courses.filter(c => c.status === 'published').length,
      totalReviews: reviews.length,
      averageRating: reviews.length > 0 
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
        : 0,
      totalArticles: articles.length,
      publishedArticles: articles.filter(a => a.status === 'published').length,
    };
    
    return NextResponse.json({ courses, reviews, articles, stats });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Neues Element erstellen
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const { type, ...data } = await request.json();

    let result;
    switch (type) {
      case 'course':
        result = await Course.create(data);
        break;
      case 'article':
        result = await Article.create(data);
        break;
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Element aktualisieren
export async function PUT(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const { type, id, ...data } = await request.json();

    console.log('API: Updating', type, 'with data:', data); // Debug

    let result;
    switch (type) {
      case 'course':
        result = await Course.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        break;
      case 'article':
        result = await Article.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        break;
      case 'review':
        result = await Review.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        break;
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    if (!result) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    console.log('API: Updated result:', result); // Debug
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Element löschen
export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!type || !id) {
      return NextResponse.json({ error: 'Missing type or id' }, { status: 400 });
    }

    let result;
    switch (type) {
      case 'course':
        result = await Course.findByIdAndDelete(id);
        // Lösche auch alle zugehörigen Bewertungen
        await Review.deleteMany({ courseId: id });
        break;
      case 'article':
        result = await Article.findByIdAndDelete(id);
        break;
      case 'review':
        result = await Review.findByIdAndDelete(id);
        break;
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    if (!result) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

