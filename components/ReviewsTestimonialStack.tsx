'use client';

import { useEffect, useState } from 'react';
import { TestimonialStack, Testimonial } from '@/components/ui/glass-testimonial-swiper';
import { Star, Calendar, ThumbsUp, Clock } from 'lucide-react';

interface Review {
  _id: string;
  rating: number;
  comment?: string;
  studentName?: string;
  isAnonymous: boolean;
  createdAt: string;
}

// Avatar gradients für verschiedene Bewertungen
const avatarGradients = [
  'linear-gradient(135deg, #5e6ad2, #8b5cf6)',
  'linear-gradient(135deg, #10b981, #059669)',
  'linear-gradient(135deg, #f59e0b, #d97706)',
  'linear-gradient(135deg, #ec4899, #d946ef)',
  'linear-gradient(135deg, #3b82f6, #6366f1)',
  'linear-gradient(135deg, #8b5cf6, #a855f7)',
  'linear-gradient(135deg, #06b6d4, #0891b2)',
  'linear-gradient(135deg, #f97316, #ea580c)',
];

function getInitials(name: string): string {
  if (!name || name.trim() === '') return '??';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Heute';
  if (diffDays === 1) return 'Gestern';
  if (diffDays < 7) return `Vor ${diffDays} Tagen`;
  if (diffDays < 30) return `Vor ${Math.floor(diffDays / 7)} Wochen`;
  if (diffDays < 365) return `Vor ${Math.floor(diffDays / 30)} Monaten`;
  return `Vor ${Math.floor(diffDays / 365)} Jahren`;
}

function transformReviewToTestimonial(review: Review, index: number): Testimonial {
  const name = review.isAnonymous ? 'Anonym' : (review.studentName || 'Anonym');
  const initials = review.isAnonymous ? 'AN' : getInitials(review.studentName || 'Anonym');
  
  // Bestimme Tags basierend auf Rating
  const tags: { text: string; type: 'featured' | 'default' }[] = [];
  if (review.rating >= 5) {
    tags.push({ text: 'HERVORRAGEND', type: 'featured' });
  } else if (review.rating >= 4) {
    tags.push({ text: 'SEHR GUT', type: 'featured' });
  }
  
  // Füge zusätzliche Tags hinzu
  if (review.comment && review.comment.length > 100) {
    tags.push({ text: 'Ausführlich', type: 'default' });
  }
  
  // Stats
  const stats = [
    { icon: Star, text: `${review.rating}/5 Sterne` },
    { icon: Calendar, text: formatDate(review.createdAt) },
  ];
  
  if (review.rating >= 4) {
    stats.push({ icon: ThumbsUp, text: 'Empfohlen' });
  }

  return {
    id: review._id,
    initials,
    name,
    role: 'Kunde',
    quote: review.comment || 'Sehr zufrieden mit dem Service!',
    tags,
    stats,
    avatarGradient: avatarGradients[index % avatarGradients.length],
    rating: review.rating,
  };
}

export default function ReviewsTestimonialStack() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch('/api/general-reviews');
        if (res.ok) {
          const data = await res.json();
          setReviews(data.reviews || []);
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
    return (
      <div className="text-center py-20 text-neutral-500 dark:text-neutral-400">
        Bewertungen werden geladen...
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-20 text-neutral-500 dark:text-neutral-400">
        Noch keine Bewertungen vorhanden.
      </div>
    );
  }

  const testimonials = reviews.map((review, index) => 
    transformReviewToTestimonial(review, index)
  );

  return (
    <div className="relative w-full min-h-[650px] md:min-h-[700px] flex items-center justify-center py-12 md:py-20">
      <div className="w-full max-w-4xl mx-auto px-4">
        <TestimonialStack testimonials={testimonials} visibleBehind={2} />
      </div>
    </div>
  );
}

