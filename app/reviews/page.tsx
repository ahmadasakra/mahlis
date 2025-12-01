import GeneralReviewForm from '@/components/GeneralReviewForm';
import ReviewsTestimonialStack from '@/components/ReviewsTestimonialStack';

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white pt-24 px-6 pb-12 transition-colors">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center" style={{ color: '#C3E41D' }}>
          Bewertungen
        </h1>
        <p className="text-center text-neutral-600 dark:text-neutral-400 mb-12">
          Was Besucher über die Dienstleistungen sagen
        </p>

        {/* Testimonial Stack mit Bewertungen */}
        <div className="mb-16">
          <ReviewsTestimonialStack />
        </div>

        {/* Formular zum Hinzufügen neuer Bewertungen */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: '#C3E41D' }}>
            Ihre Bewertung hinzufügen
          </h2>
          <GeneralReviewForm />
        </div>
      </div>
    </div>
  );
}
