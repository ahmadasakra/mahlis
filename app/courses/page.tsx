import { getBaseUrl } from '@/lib/server-utils';
import CoursesPageClient from '@/components/CoursesPageClient';

interface Course {
  _id: string;
  titleDe: string;
  titleAr?: string;
  descriptionDe: string;
  descriptionAr?: string;
  language: 'de' | 'ar' | 'both';
  price?: number;
  startDate?: string;
  endDate?: string;
  reviewCount: number;
  averageRating: number;
}

async function getCourses() {
  try {
    const baseUrl = await getBaseUrl();
    const res = await fetch(`${baseUrl}/api/courses`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
}

export default async function CoursesPage() {
  const courses: Course[] = await getCourses();

  return <CoursesPageClient courses={courses} />;
}

