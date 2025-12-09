'use client';

import { useRef } from 'react';
import CommentForm from '@/components/CommentForm';
import CommentsList, { CommentsListRef } from '@/components/CommentsList';

interface ArticleClientProps {
  articleId: string;
}

export default function ArticleClient({ articleId }: ArticleClientProps) {
  const commentsListRef = useRef<CommentsListRef>(null);

  const handleCommentAdded = () => {
    // Aktualisiere die Kommentarliste nach 2 Sekunden
    setTimeout(() => {
      commentsListRef.current?.refresh();
    }, 2000);
  };

  return (
    <div className="mt-12 pt-12 border-t border-neutral-300 dark:border-neutral-800">
      <CommentsList ref={commentsListRef} articleId={articleId} />
      <CommentForm articleId={articleId} onCommentAdded={handleCommentAdded} />
    </div>
  );
}



