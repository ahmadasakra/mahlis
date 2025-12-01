'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

export default function GeneralReviewForm() {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [studentName, setStudentName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setMessage({ type: 'error', text: 'Bitte wähle eine Bewertung aus.' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/general-reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          comment: comment.trim() || undefined,
          studentName: isAnonymous ? undefined : studentName.trim() || undefined,
          isAnonymous,
        }),
      });

      if (!res.ok) {
        throw new Error('Fehler beim Speichern der Bewertung');
      }

      setMessage({ type: 'success', text: 'Vielen Dank für deine Bewertung!' });
      setRating(0);
      setComment('');
      setStudentName('');
      setIsAnonymous(false);
      
      // Seite neu laden um neue Bewertung anzuzeigen
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      setMessage({ type: 'error', text: 'Etwas ist schiefgelaufen. Bitte versuche es erneut.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-12 p-6 bg-neutral-100 dark:bg-neutral-900 rounded-lg border border-neutral-300 dark:border-neutral-800">
      <h2 className="text-2xl font-semibold mb-4" style={{ color: '#C3E41D' }}>
        Bewertung abgeben
      </h2>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
        Teile deine Erfahrungen mit Rita Mahlis und ihren Dienstleistungen
      </p>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Bewertung *</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none"
            >
              <Star
                className={`w-8 h-8 transition-colors ${
                  star <= (hoveredRating || rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-neutral-400 dark:text-neutral-600'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="comment" className="block text-sm font-medium mb-2">
          Kommentar (optional)
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-black dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:border-[#C3E41D]"
          placeholder="Teile deine Erfahrungen..."
        />
      </div>

      <div className="mb-4">
        <label htmlFor="studentName" className="block text-sm font-medium mb-2">
          Name (optional)
        </label>
        <input
          id="studentName"
          type="text"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          disabled={isAnonymous}
          className="w-full px-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-black dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:border-[#C3E41D] disabled:opacity-50"
          placeholder="Dein Name"
        />
      </div>

      <div className="mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-[#C3E41D] focus:ring-[#C3E41D]"
          />
          <span className="text-sm text-neutral-600 dark:text-neutral-400">Anonym bewerten</span>
        </label>
      </div>

      {message && (
        <div
          className={`mb-4 p-3 rounded ${
            message.type === 'success'
              ? 'bg-green-900/30 text-green-400'
              : 'bg-red-900/30 text-red-400'
          }`}
        >
          {message.text}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || rating === 0}
        className="px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: rating === 0 ? '#333' : '#C3E41D',
          color: rating === 0 ? '#999' : '#000',
        }}
      >
        {isSubmitting ? 'Wird gespeichert...' : 'Bewertung absenden'}
      </button>
    </form>
  );
}



