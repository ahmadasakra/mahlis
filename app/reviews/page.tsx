import GeneralReviewForm from '@/components/GeneralReviewForm';
import GeneralReviewsList from '@/components/GeneralReviewsList';

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white pt-24 px-6 pb-12 transition-colors">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center" style={{ color: '#C3E41D' }}>
          Bewertungen
        </h1>
        <p className="text-center text-neutral-600 dark:text-neutral-400 mb-12">
          Was Besucher über die Dienstleistungen sagen
        </p>

        <GeneralReviewForm />
        
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#C3E41D' }}>
            Alle Bewertungen
          </h2>
          <GeneralReviewsList />
        </div>
      </div>
    </div>
  );
}
