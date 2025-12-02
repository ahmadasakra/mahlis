'use client';

import { useState } from 'react';
import { useLocale } from '@/lib/locale';

interface CommentFormProps {
  articleId: string;
  onCommentAdded?: () => void;
}

export default function CommentForm({ articleId, onCommentAdded }: CommentFormProps) {
  const { t, dir } = useLocale();
  const [formData, setFormData] = useState({
    authorName: '',
    authorEmail: '',
    content: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch(`/api/articles/${articleId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess(true);
        setFormData({ authorName: '', authorEmail: '', content: '' });
        // Benachrichtige die Parent-Komponente, dass ein Kommentar hinzugefügt wurde
        if (onCommentAdded) {
          setTimeout(() => {
            onCommentAdded();
            setSuccess(false);
          }, 2000);
        } else {
          setTimeout(() => setSuccess(false), 3000);
        }
      } else {
        const data = await res.json();
        setError(data.error || t('articles.commentError'));
      }
    } catch (err) {
      setError(t('articles.commentError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 p-6 bg-neutral-100 dark:bg-neutral-900 rounded-lg border border-neutral-300 dark:border-neutral-800" dir={dir}>
      <h3 className="text-2xl font-bold mb-4" style={{ color: '#C3E41D' }}>
        {t('articles.writeComment')}
      </h3>

      {success && (
        <div className="mb-4 p-4 bg-green-900/30 text-green-400 rounded-lg border border-green-800">
          {t('articles.commentSuccess')}
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-900/30 text-red-400 rounded-lg border border-red-800">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="authorName" className="block text-sm font-medium mb-2">
              {t('articles.commentName')} *
            </label>
            <input
              id="authorName"
              type="text"
              required
              value={formData.authorName}
              onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
              className="w-full px-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-black dark:text-white focus:outline-none focus:border-[#C3E41D]"
              placeholder={t('articles.commentName')}
              dir={dir}
            />
          </div>
          <div>
            <label htmlFor="authorEmail" className="block text-sm font-medium mb-2">
              {t('articles.commentEmail')}
            </label>
            <input
              id="authorEmail"
              type="email"
              value={formData.authorEmail}
              onChange={(e) => setFormData({ ...formData, authorEmail: e.target.value })}
              className="w-full px-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-black dark:text-white focus:outline-none focus:border-[#C3E41D]"
              placeholder={t('articles.commentEmail')}
              dir="ltr"
            />
          </div>
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-2">
            {t('articles.commentContent')} *
          </label>
          <textarea
            id="content"
            required
            rows={4}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full px-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-black dark:text-white focus:outline-none focus:border-[#C3E41D] resize-none"
            placeholder={t('articles.commentContent')}
            dir={dir}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
          style={{ backgroundColor: '#C3E41D', color: '#000' }}
        >
          {loading ? t('articles.commentSending') : t('articles.commentSubmit')}
        </button>

        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          * {t('articles.commentModerated')}
        </p>
      </form>
    </div>
  );
}

