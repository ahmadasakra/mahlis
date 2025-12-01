'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, BookOpen, FileText, Star, TrendingUp, MessageSquare, Check, X } from 'lucide-react';
import Link from 'next/link';

interface Course {
  _id: string;
  titleDe: string;
  titleAr?: string;
  descriptionDe: string;
  status: string;
  price?: number;
  language: string;
}

interface Review {
  _id: string;
  rating: number;
  comment?: string;
  studentName?: string;
  courseId?: {
    titleDe: string;
  };
  createdAt: string;
}

interface Article {
  _id: string;
  titleDe: string;
  status: string;
}

interface Comment {
  _id: string;
  authorName: string;
  authorEmail?: string;
  content: string;
  isApproved: boolean;
  articleId?: {
    _id: string;
    titleDe: string;
  };
  createdAt: string;
}

interface Stats {
  totalCourses: number;
  publishedCourses: number;
  totalReviews: number;
  averageRating: number;
  totalArticles: number;
  publishedArticles: number;
  totalComments: number;
  pendingComments: number;
}

export default function AdminPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const tabParam = searchParams?.get('tab');
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'articles' | 'reviews' | 'comments'>('overview');
  const [courses, setCourses] = useState<Course[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [allComments, setAllComments] = useState<Comment[]>([]);
  const [showPendingOnly, setShowPendingOnly] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (tabParam && ['overview', 'courses', 'articles', 'reviews', 'comments'].includes(tabParam)) {
      setActiveTab(tabParam as 'overview' | 'courses' | 'articles' | 'reviews' | 'comments');
    }
  }, [tabParam]);

  useEffect(() => {
    // Prüfe ob bereits eingeloggt
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/admin');
      if (res.ok) {
        setIsAuthenticated(true);
        await fetchData();
      }
    } catch (err) {
      // Nicht eingeloggt
    }
  };

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      setError('Bitte Email und Passwort eingeben');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        setIsAuthenticated(true);
        setEmail('');
        setPassword('');
        await fetchData();
      } else {
        const data = await res.json();
        setError(data.error || 'Ungültige Anmeldedaten');
      }
    } catch (err) {
      setError('Fehler beim Verbinden');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/login', { method: 'DELETE' });
    } catch (err) {
      // Ignore errors
    }
    setIsAuthenticated(false);
    setCourses([]);
    setArticles([]);
    setReviews([]);
    setComments([]);
    setStats(null);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin');
      if (res.ok) {
        const data = await res.json();
        setCourses(data.courses || []);
        setArticles(data.articles || []);
        setReviews(data.reviews || []);
        const commentsData = data.comments || [];
        setAllComments(commentsData);
        setComments(showPendingOnly ? commentsData.filter((c: Comment) => !c.isApproved) : commentsData);
        setStats(data.stats || null);
      } else if (res.status === 401) {
        setIsAuthenticated(false);
      }
    } catch (err) {
      setError('Fehler beim Laden der Daten');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type: 'course' | 'article' | 'review', id: string) => {
    if (!confirm('Wirklich löschen?')) return;

    try {
      const res = await fetch(`/api/admin?type=${type}&id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await fetchData();
      } else if (res.status === 401) {
        setIsAuthenticated(false);
        setError('Session abgelaufen. Bitte erneut anmelden.');
      } else {
        setError('Fehler beim Löschen');
      }
    } catch (err) {
      setError('Fehler beim Löschen');
    }
  };

  const handleCommentAction = async (id: string, action: 'approve' | 'delete') => {
    if (action === 'delete' && !confirm('Kommentar wirklich löschen?')) return;

    try {
      if (action === 'approve') {
        const res = await fetch('/api/admin/comments', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, isApproved: true }),
        });

        if (res.ok) {
          // Aktualisiere die Kommentare
          const updatedComments = allComments.map(c => 
            c._id === id ? { ...c, isApproved: true } : c
          );
          setAllComments(updatedComments);
          setComments(showPendingOnly ? updatedComments.filter(c => !c.isApproved) : updatedComments);
        } else {
          setError('Fehler beim Genehmigen');
        }
      } else if (action === 'delete') {
        const res = await fetch(`/api/admin/comments?id=${id}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          // Entferne den Kommentar aus den Listen
          const updatedComments = allComments.filter(c => c._id !== id);
          setAllComments(updatedComments);
          setComments(showPendingOnly ? updatedComments.filter(c => !c.isApproved) : updatedComments);
        } else {
          setError('Fehler beim Löschen');
        }
      }
    } catch (err) {
      setError('Fehler bei der Aktion');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex items-center justify-center px-6 transition-colors">
        <div className="max-w-md w-full">
          <h1 className="text-4xl font-bold mb-8 text-center" style={{ color: '#C3E41D' }}>
            Admin Login
          </h1>
          <form onSubmit={handleLogin} className="bg-neutral-100 dark:bg-neutral-900 rounded-lg p-6 border border-neutral-300 dark:border-neutral-800">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-black dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:border-[#C3E41D]"
                placeholder="info@rita.com"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Passwort
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-black dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:border-[#C3E41D]"
                placeholder="Passwort"
                required
              />
            </div>
            {error && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded text-sm">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
              style={{ backgroundColor: '#C3E41D', color: '#000' }}
            >
              {loading ? 'Wird geladen...' : 'Anmelden'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white pt-24 px-6 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold" style={{ color: '#C3E41D' }}>
            Admin Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-neutral-200 dark:bg-neutral-800 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors text-black dark:text-white"
          >
            Abmelden
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-neutral-300 dark:border-neutral-800">
          {(['overview', 'courses', 'articles', 'reviews', 'comments'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                router.push(`/admin?tab=${tab}`);
              }}
              className={`px-6 py-3 font-semibold transition-colors relative ${
                activeTab === tab
                  ? 'border-b-2'
                  : 'text-neutral-500 dark:text-neutral-500 hover:text-black dark:hover:text-white'
              }`}
              style={{
                borderBottomColor: activeTab === tab ? '#C3E41D' : 'transparent',
                color: activeTab === tab ? '#C3E41D' : undefined,
              }}
            >
              {tab === 'overview' && 'Übersicht'}
              {tab === 'courses' && 'Kurse'}
              {tab === 'articles' && 'Artikel'}
              {tab === 'reviews' && 'Bewertungen'}
              {tab === 'comments' && (
                <>
                  Kommentare
                  {stats && stats.pendingComments > 0 && (
                    <span className="ml-2 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                      {stats.pendingComments}
                    </span>
                  )}
                </>
              )}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-neutral-100 dark:bg-neutral-900 rounded-lg p-6 border border-neutral-300 dark:border-neutral-800">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="w-6 h-6" style={{ color: '#C3E41D' }} />
                <h3 className="text-lg font-semibold">Kurse</h3>
              </div>
              <p className="text-3xl font-bold">{stats.totalCourses}</p>
              <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-1">
                {stats.publishedCourses} veröffentlicht
              </p>
            </div>

            <div className="bg-neutral-100 dark:bg-neutral-900 rounded-lg p-6 border border-neutral-300 dark:border-neutral-800">
              <div className="flex items-center gap-3 mb-2">
                <Star className="w-6 h-6" style={{ color: '#C3E41D' }} />
                <h3 className="text-lg font-semibold">Bewertungen</h3>
              </div>
              <p className="text-3xl font-bold">{stats.totalReviews}</p>
              <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-1">
                ⭐ {stats.averageRating.toFixed(1)} Durchschnitt
              </p>
            </div>

            <div className="bg-neutral-100 dark:bg-neutral-900 rounded-lg p-6 border border-neutral-300 dark:border-neutral-800">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-6 h-6" style={{ color: '#C3E41D' }} />
                <h3 className="text-lg font-semibold">Artikel</h3>
              </div>
              <p className="text-3xl font-bold">{stats.totalArticles}</p>
              <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-1">
                {stats.publishedArticles} veröffentlicht
              </p>
            </div>

            <div className="bg-neutral-100 dark:bg-neutral-900 rounded-lg p-6 border border-neutral-300 dark:border-neutral-800">
              <div className="flex items-center gap-3 mb-2">
                <MessageSquare className="w-6 h-6" style={{ color: '#C3E41D' }} />
                <h3 className="text-lg font-semibold">Kommentare</h3>
              </div>
              <p className="text-3xl font-bold">{stats.totalComments}</p>
              <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-1">
                {stats.pendingComments} wartend
              </p>
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Kurse verwalten</h2>
              <Link
                href="/admin/courses/new"
                className="px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
                style={{ backgroundColor: '#C3E41D', color: '#000' }}
              >
                <Plus className="w-4 h-4" />
                Neuer Kurs
              </Link>
            </div>
            <div className="space-y-4">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="bg-neutral-100 dark:bg-neutral-900 rounded-lg p-6 border border-neutral-300 dark:border-neutral-800"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2" style={{ color: '#C3E41D' }}>
                        {course.titleDe}
                      </h3>
                      {course.titleAr && (
                        <p className="text-neutral-600 dark:text-neutral-400 mb-2" dir="rtl">{course.titleAr}</p>
                      )}
                      <p className="text-neutral-700 dark:text-neutral-300 text-sm mb-3 line-clamp-2">
                        {course.descriptionDe}
                      </p>
                      <div className="flex gap-2 text-xs">
                        <span className="px-2 py-1 bg-neutral-200 dark:bg-neutral-800 rounded text-neutral-700 dark:text-neutral-300">
                          {course.status}
                        </span>
                        <span className="px-2 py-1 bg-neutral-200 dark:bg-neutral-800 rounded text-neutral-700 dark:text-neutral-300">
                          {course.language}
                        </span>
                        {course.price && (
                          <span className="px-2 py-1 bg-neutral-200 dark:bg-neutral-800 rounded text-neutral-700 dark:text-neutral-300">
                            {course.price}€
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleDelete('course', course._id)}
                        className="p-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {courses.length === 0 && (
                <div className="text-center py-12 text-neutral-500 dark:text-neutral-500">
                  Noch keine Kurse vorhanden.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Articles Tab */}
        {activeTab === 'articles' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Artikel verwalten</h2>
              <Link
                href="/admin/articles/new"
                className="px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
                style={{ backgroundColor: '#C3E41D', color: '#000' }}
              >
                <Plus className="w-4 h-4" />
                Neuer Artikel
              </Link>
            </div>
            <div className="space-y-4">
              {articles.map((article) => (
                <div
                  key={article._id}
                  className="bg-neutral-100 dark:bg-neutral-900 rounded-lg p-6 border border-neutral-300 dark:border-neutral-800"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2" style={{ color: '#C3E41D' }}>
                        {article.titleDe}
                      </h3>
                      <span className="px-2 py-1 bg-neutral-200 dark:bg-neutral-800 rounded text-xs text-neutral-700 dark:text-neutral-300">
                        {article.status}
                      </span>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Link
                        href={`/admin/articles/${article._id}/edit`}
                        className="p-2 bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete('article', article._id)}
                        className="p-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {articles.length === 0 && (
                <div className="text-center py-12 text-neutral-500 dark:text-neutral-500">
                  Noch keine Artikel vorhanden.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Bewertungen</h2>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-neutral-100 dark:bg-neutral-900 rounded-lg p-6 border border-neutral-300 dark:border-neutral-800"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-neutral-400 dark:text-neutral-600'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-neutral-600 dark:text-neutral-400">
                        {review.studentName || 'Anonym'}
                      </span>
                      {review.courseId && (
                        <span className="text-xs text-neutral-500 dark:text-neutral-500">
                          - {review.courseId.titleDe}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-neutral-500 dark:text-neutral-500">
                      {new Date(review.createdAt).toLocaleDateString('de-DE')}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-neutral-700 dark:text-neutral-300 text-sm mt-2">{review.comment}</p>
                  )}
                </div>
              ))}
              {reviews.length === 0 && (
                <div className="text-center py-12 text-neutral-500 dark:text-neutral-500">
                  Noch keine Bewertungen vorhanden.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Comments Tab */}
        {activeTab === 'comments' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Kommentare moderieren</h2>
            <div className="mb-4 flex gap-4">
              <button
                onClick={() => {
                  setShowPendingOnly(!showPendingOnly);
                  setComments(showPendingOnly ? allComments : allComments.filter(c => !c.isApproved));
                }}
                className={`px-4 py-2 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors text-sm ${
                  showPendingOnly
                    ? 'bg-[#C3E41D] text-black'
                    : 'bg-neutral-200 dark:bg-neutral-800'
                }`}
              >
                {showPendingOnly ? 'Alle anzeigen' : `Nur wartende (${allComments.filter(c => !c.isApproved).length})`}
              </button>
            </div>
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className={`bg-neutral-100 dark:bg-neutral-900 rounded-lg p-6 border ${
                    comment.isApproved
                      ? 'border-neutral-300 dark:border-neutral-800'
                      : 'border-yellow-500 dark:border-yellow-600'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-semibold text-[#C3E41D]">{comment.authorName}</p>
                        {comment.authorEmail && (
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            ({comment.authorEmail})
                          </p>
                        )}
                        {!comment.isApproved && (
                          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 rounded text-xs">
                            Wartet auf Freigabe
                          </span>
                        )}
                        {comment.isApproved && (
                          <span className="px-2 py-1 bg-green-500/20 text-green-600 dark:text-green-400 rounded text-xs">
                            Genehmigt
                          </span>
                        )}
                      </div>
                      {comment.articleId && (
                        <Link
                          href={`/articles/${comment.articleId._id}`}
                          className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-[#C3E41D] mb-2 block"
                        >
                          Artikel: {comment.articleId.titleDe}
                        </Link>
                      )}
                      <p className="text-neutral-700 dark:text-neutral-300 mt-2 whitespace-pre-wrap">
                        {comment.content}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                        {new Date(comment.createdAt).toLocaleDateString('de-DE', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      {!comment.isApproved && (
                        <button
                          onClick={() => handleCommentAction(comment._id, 'approve')}
                          className="p-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                          title="Genehmigen"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleCommentAction(comment._id, 'delete')}
                        className="p-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                        title="Löschen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {comments.length === 0 && (
                <div className="text-center py-12 text-neutral-500 dark:text-neutral-500">
                  Noch keine Kommentare vorhanden.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

