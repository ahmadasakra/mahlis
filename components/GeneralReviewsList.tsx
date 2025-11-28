'use client';

import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';

interface Review {
  _id: string;
  rating: number;
  comment?: string;
  studentName?: string;
  isAnonymous: boolean;
  createdAt: string;
}

export default function GeneralReviewsList() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch('/api/general-reviews');
        if (res.ok) {
          const data = await res.json();
          setReviews(data.reviews || []);
          setAverageRating(data.averageRating || 0);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, []);

  if (loading) {
    return <div className="text-neutral-500 dark:text-neutral-400">Lade Bewertungen...</div>;
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
        Noch keine Bewertungen vorhanden.
      </div>
    );
  }

  return (
    <div>
      {averageRating > 0 && (
        <div className="mb-8 p-6 bg-neutral-100 dark:bg-neutral-900 rounded-lg border border-neutral-300 dark:border-neutral-800 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
            <span className="text-4xl font-bold">{averageRating.toFixed(1)}</span>
          </div>
          <p className="text-neutral-600 dark:text-neutral-400">
            Basierend auf {reviews.length} {reviews.length === 1 ? 'Bewertung' : 'Bewertungen'}
          </p>
        </div>
      )}

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review._id} className="p-6 bg-neutral-100 dark:bg-neutral-900 rounded-lg border border-neutral-300 dark:border-neutral-800">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= review.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-neutral-400 dark:text-neutral-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {review.isAnonymous
                    ? 'Anonym'
                    : review.studentName || 'Anonym'}
                </span>
              </div>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                {new Date(review.createdAt).toLocaleDateString('de-DE', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            {review.comment && (
              <p className="text-neutral-700 dark:text-neutral-300 mt-3 whitespace-pre-line leading-relaxed">
                {review.comment}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

