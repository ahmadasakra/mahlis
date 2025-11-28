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
  courseId?: {
    titleDe: string;
    titleAr?: string;
  };
}

interface ReviewsListProps {
  courseId?: string;
}

export default function ReviewsList({ courseId }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const url = courseId 
          ? `/api/reviews?courseId=${courseId}`
          : '/api/reviews';
        const res = await fetch(url);
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
  }, [courseId]);

  if (loading) {
    return <div className="text-neutral-500">Lade Bewertungen...</div>;
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-neutral-500">
        Noch keine Bewertungen vorhanden.
      </div>
    );
  }

  return (
    <div>
      {averageRating > 0 && (
        <div className="mb-6 p-4 bg-neutral-900 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
            <span className="text-neutral-400">({reviews.length} Bewertungen)</span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review._id} className="p-4 bg-neutral-900 rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-neutral-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-neutral-400">
                  {review.isAnonymous
                    ? 'Anonym'
                    : review.studentName || 'Anonym'}
                </span>
              </div>
              <span className="text-xs text-neutral-500">
                {new Date(review.createdAt).toLocaleDateString('de-DE')}
              </span>
            </div>
            {review.comment && (
              <p className="text-neutral-300 mt-2 whitespace-pre-line">
                {review.comment}
              </p>
            )}
            {review.courseId && !courseId && (
              <p className="text-xs text-neutral-500 mt-2">
                Kurs: {review.courseId.titleDe}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

