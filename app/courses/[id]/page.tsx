import { getBaseUrl } from '@/lib/server-utils';
import CourseDetailClient from '@/components/CourseDetailClient';

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
  materials?: Array<{
    fileName: string;
    fileUrl: string;
    fileType: string;
  }>;
}

async function getCourse(id: string) {
  try {
    const baseUrl = await getBaseUrl();
    const res = await fetch(`${baseUrl}/api/courses/${id}`, { 
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Error fetching course:', error);
    return null;
  }
}

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course: Course | null = await getCourse(id);

  return <CourseDetailClient course={course} />;
}

