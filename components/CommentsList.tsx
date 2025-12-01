'use client';

import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';

interface Comment {
  _id: string;
  authorName: string;
  content: string;
  createdAt: string;
}

interface CommentsListProps {
  articleId: string;
}

export interface CommentsListRef {
  refresh: () => void;
}

const CommentsList = forwardRef<CommentsListRef, CommentsListProps>(({ articleId }, ref) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`/api/articles/${articleId}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      } else {
        setError('Fehler beim Laden der Kommentare');
      }
    } catch (err) {
      setError('Fehler beim Laden der Kommentare');
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    refresh: fetchComments,
  }));

  useEffect(() => {
    fetchComments();
  }, [articleId]);

  if (loading) {
    return (
      <div className="mt-8 text-center text-neutral-500 dark:text-neutral-400">
        Kommentare werden geladen...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 p-4 bg-red-900/30 text-red-400 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-6" style={{ color: '#C3E41D' }}>
        Kommentare ({comments.length})
      </h3>

      {comments.length === 0 ? (
        <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
          Noch keine Kommentare. Seien Sie der Erste!
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="p-4 bg-neutral-100 dark:bg-neutral-900 rounded-lg border border-neutral-300 dark:border-neutral-800"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-[#C3E41D]">{comment.authorName}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {new Date(comment.createdAt).toLocaleDateString('de-DE', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
              <p className="text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

CommentsList.displayName = 'CommentsList';

export default CommentsList;

