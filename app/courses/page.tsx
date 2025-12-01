import Link from 'next/link';
import { Star } from 'lucide-react';
import { getBaseUrl } from '@/lib/utils';

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

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white pt-24 px-6 pb-12 transition-colors">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center" style={{ color: '#C3E41D' }}>
          Meine Kurse
        </h1>

        {courses.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-neutral-500 dark:text-neutral-400 text-lg">Noch keine Kurse verfügbar.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link
                key={course._id}
                href={`/courses/${course._id}`}
                className="block bg-neutral-100 dark:bg-neutral-900 rounded-lg p-6 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors border border-neutral-300 dark:border-neutral-800"
              >
                <h2 className="text-xl font-bold mb-2" style={{ color: '#C3E41D' }}>
                  {course.titleDe}
                </h2>
                {course.titleAr && (
                  <h3 className="text-lg mb-3 text-neutral-600 dark:text-neutral-400">{course.titleAr}</h3>
                )}
                <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4 line-clamp-3">
                  {course.descriptionDe}
                </p>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-300 dark:border-neutral-800">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">
                      {course.averageRating > 0 ? course.averageRating.toFixed(1) : 'Neu'}
                    </span>
                    {course.reviewCount > 0 && (
                      <span className="text-xs text-neutral-500 dark:text-neutral-400 ml-1">
                        ({course.reviewCount})
                      </span>
                    )}
                  </div>
                  {course.price && (
                    <span className="text-sm font-semibold">{course.price}€</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

