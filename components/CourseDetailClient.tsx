'use client';

import Link from 'next/link';
import { Star } from 'lucide-react';
import { useLocale } from '@/lib/locale';
import ReviewForm from './ReviewForm';
import ReviewsList from './ReviewsList';

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

interface CourseDetailClientProps {
  course: Course | null;
}

export default function CourseDetailClient({ course }: CourseDetailClientProps) {
  const { t, dir, locale } = useLocale();

  if (!course) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white pt-24 px-6 pb-12 transition-colors" dir={dir}>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">{t('common.error')}</h1>
          <Link href="/courses" className="text-[#C3E41D] hover:underline">
            {t('courses.backToCourses')}
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'de-DE');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white pt-24 px-6 pb-12 transition-colors" dir={dir}>
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/courses" 
          className={`inline-block mb-6 text-neutral-600 dark:text-neutral-400 hover:text-[#C3E41D] transition-colors ${dir === 'rtl' ? 'flex items-center gap-2' : ''}`}
        >
          {dir === 'rtl' ? `← ${t('courses.backToCourses')}` : `${t('courses.backToCourses')} →`}
        </Link>

        <article className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#C3E41D' }}>
            {locale === 'ar' && course.titleAr ? course.titleAr : course.titleDe}
          </h1>
          {locale === 'de' && course.titleAr && (
            <h2 className="text-2xl md:text-3xl mb-6 text-neutral-600 dark:text-neutral-400" dir="rtl">{course.titleAr}</h2>
          )}
          {locale === 'ar' && course.titleDe && (
            <h2 className="text-2xl md:text-3xl mb-6 text-neutral-600 dark:text-neutral-400" dir="ltr">{course.titleDe}</h2>
          )}

          <div className="prose prose-invert max-w-none mb-8">
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line" dir={locale === 'ar' && course.descriptionAr ? 'rtl' : 'ltr'}>
              {locale === 'ar' && course.descriptionAr ? course.descriptionAr : course.descriptionDe}
            </p>
            {locale === 'de' && course.descriptionAr && (
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mt-4 whitespace-pre-line" dir="rtl">
                {course.descriptionAr}
              </p>
            )}
            {locale === 'ar' && course.descriptionDe && (
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mt-4 whitespace-pre-line" dir="ltr">
                {course.descriptionDe}
              </p>
            )}
          </div>

          <div className={`flex flex-wrap gap-4 mb-8 text-sm ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
            {course.language && (
              <span className="px-3 py-1 bg-neutral-200 dark:bg-neutral-800 rounded-full">
                {t('courses.details')}: {course.language === 'both' ? 'DE / AR' : course.language.toUpperCase()}
              </span>
            )}
            {course.price && (
              <span className="px-3 py-1 bg-neutral-200 dark:bg-neutral-800 rounded-full">
                {t('courses.price')}: {course.price}{t('courses.price')}
              </span>
            )}
            {course.startDate && (
              <span className="px-3 py-1 bg-neutral-200 dark:bg-neutral-800 rounded-full">
                {t('courses.details')}: {formatDate(course.startDate)}
              </span>
            )}
          </div>

          {course.materials && course.materials.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4" style={{ color: '#C3E41D' }}>
                {t('courses.details')}
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
            {t('reviews.title')}
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

