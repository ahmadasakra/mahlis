'use client';

import { useLocale } from '@/lib/locale';
import GeneralReviewForm from '@/components/GeneralReviewForm';
import ReviewsTestimonialStack from '@/components/ReviewsTestimonialStack';

export default function ReviewsPageClient() {
  const { t, dir } = useLocale();

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white pt-24 px-6 pb-12 transition-colors" dir={dir}>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center" style={{ color: '#C3E41D' }}>
          {t('reviews.title')}
        </h1>
        <p className="text-center text-neutral-600 dark:text-neutral-400 mb-12">
          {t('reviews.subtitle')}
        </p>

        {/* Testimonial Stack mit Bewertungen */}
        <div className="mb-16">
          <ReviewsTestimonialStack />
        </div>

        {/* Formular zum Hinzufügen neuer Bewertungen */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: '#C3E41D' }}>
            {t('reviews.addReview')}
          </h2>
          <GeneralReviewForm />
        </div>
      </div>
    </div>
  );
}

