import { Star } from 'lucide-react';
import ReviewForm from '@/components/ReviewForm';
import ReviewsList from '@/components/ReviewsList';
import Link from 'next/link';

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
    // In Server Components: relative URLs verwenden (funktioniert auf demselben Server)
    const res = await fetch(`/api/courses/${id}`, { 
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

  if (!course) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white pt-24 px-6 pb-12 transition-colors">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Kurs nicht gefunden</h1>
          <Link href="/courses" className="text-[#C3E41D] hover:underline">
            Zurück zur Kursliste
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white pt-24 px-6 pb-12 transition-colors">
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/courses" 
          className="inline-block mb-6 text-neutral-600 dark:text-neutral-400 hover:text-[#C3E41D] transition-colors"
        >
          ← Zurück zu den Kursen
        </Link>

        <article className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#C3E41D' }}>
            {course.titleDe}
          </h1>
          {course.titleAr && (
            <h2 className="text-2xl md:text-3xl mb-6 text-neutral-600 dark:text-neutral-400">{course.titleAr}</h2>
          )}

          <div className="prose prose-invert max-w-none mb-8">
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
              {course.descriptionDe}
            </p>
            {course.descriptionAr && (
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mt-4 whitespace-pre-line" dir="rtl">
                {course.descriptionAr}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-4 mb-8 text-sm">
            {course.language && (
              <span className="px-3 py-1 bg-neutral-200 dark:bg-neutral-800 rounded-full">
                Sprache: {course.language === 'both' ? 'DE / AR' : course.language.toUpperCase()}
              </span>
            )}
            {course.price && (
              <span className="px-3 py-1 bg-neutral-200 dark:bg-neutral-800 rounded-full">
                Preis: {course.price}€
              </span>
            )}
            {course.startDate && (
              <span className="px-3 py-1 bg-neutral-200 dark:bg-neutral-800 rounded-full">
                Start: {new Date(course.startDate).toLocaleDateString('de-DE')}
              </span>
            )}
          </div>

          {course.materials && course.materials.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4" style={{ color: '#C3E41D' }}>
                Materialien
              </h3>
              <div className="space-y-2">
                {course.materials.map((material, idx) => (
                  <a
                    key={idx}
                    href={material.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 bg-neutral-100 dark:bg-neutral-900 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                  >
                    📄 {material.fileName}
                  </a>
                ))}
              </div>
            </div>
          )}
        </article>

        <div className="border-t border-neutral-300 dark:border-neutral-800 pt-12">
          <h2 className="text-3xl font-bold mb-8" style={{ color: '#C3E41D' }}>
            Bewertungen
          </h2>
          
          <ReviewForm courseId={course._id} />
          
          <div className="mt-12">
            <ReviewsList courseId={course._id} />
          </div>
        </div>
      </div>
    </div>
  );
}

