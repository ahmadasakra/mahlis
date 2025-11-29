'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, BookOpen, FileText, Star, TrendingUp } from 'lucide-react';
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

interface Stats {
  totalCourses: number;
  publishedCourses: number;
  totalReviews: number;
  averageRating: number;
  totalArticles: number;
  publishedArticles: number;
}

export default function AdminPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [apiKey, setApiKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const tabParam = searchParams?.get('tab');
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'articles' | 'reviews'>('overview');
  const [courses, setCourses] = useState<Course[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (tabParam && ['overview', 'courses', 'articles', 'reviews'].includes(tabParam)) {
      setActiveTab(tabParam as 'overview' | 'courses' | 'articles' | 'reviews');
    }
  }, [tabParam]);

  useEffect(() => {
    const saved = localStorage.getItem('admin_api_key');
    if (saved) {
      setApiKey(saved);
      setIsAuthenticated(true);
      fetchData(saved);
    }
  }, []);

  const handleLogin = async () => {
    if (!apiKey.trim()) {
      setError('Bitte API Key eingeben');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin', {
        headers: { 'x-api-key': apiKey },
      });

      if (res.ok) {
        setIsAuthenticated(true);
        localStorage.setItem('admin_api_key', apiKey);
        await fetchData(apiKey);
      } else {
        setError('Ungültiger API Key');
      }
    } catch (err) {
      setError('Fehler beim Verbinden');
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async (key: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin', {
        headers: { 'x-api-key': key },
      });
      if (res.ok) {
        const data = await res.json();
        setCourses(data.courses || []);
        setArticles(data.articles || []);
        setReviews(data.reviews || []);
        setStats(data.stats || null);
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
        headers: { 'x-api-key': apiKey },
      });

      if (res.ok) {
        await fetchData(apiKey);
      } else {
        setError('Fehler beim Löschen');
      }
    } catch (err) {
      setError('Fehler beim Löschen');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="max-w-md w-full">
          <h1 className="text-4xl font-bold mb-8 text-center" style={{ color: '#C3E41D' }}>
            Admin Login
          </h1>
          <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
            <label className="block text-sm font-medium mb-2">
              API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white mb-4 focus:outline-none focus:border-[#C3E41D]"
              placeholder="Dein Admin API Key"
            />
            {error && (
              <div className="mb-4 p-3 bg-red-900/30 text-red-400 rounded text-sm">
                {error}
              </div>
            )}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
              style={{ backgroundColor: '#C3E41D', color: '#000' }}
            >
              {loading ? 'Wird geladen...' : 'Anmelden'}
            </button>
            <p className="text-xs text-neutral-500 mt-4 text-center">
              Der API Key steht in deiner .env.local Datei
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-6 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold" style={{ color: '#C3E41D' }}>
            Admin Dashboard
          </h1>
          <button
            onClick={() => {
              setIsAuthenticated(false);
              localStorage.removeItem('admin_api_key');
              setApiKey('');
            }}
            className="px-4 py-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
          >
            Abmelden
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-neutral-800">
          {(['overview', 'courses', 'articles', 'reviews'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                router.push(`/admin?tab=${tab}`);
              }}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === tab
                  ? 'border-b-2'
                  : 'text-neutral-500 hover:text-white'
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
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/30 text-red-400 rounded-lg">
            {error}
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="w-6 h-6" style={{ color: '#C3E41D' }} />
                <h3 className="text-lg font-semibold">Kurse</h3>
              </div>
              <p className="text-3xl font-bold">{stats.totalCourses}</p>
              <p className="text-sm text-neutral-500 mt-1">
                {stats.publishedCourses} veröffentlicht
              </p>
            </div>

            <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
              <div className="flex items-center gap-3 mb-2">
                <Star className="w-6 h-6" style={{ color: '#C3E41D' }} />
                <h3 className="text-lg font-semibold">Bewertungen</h3>
              </div>
              <p className="text-3xl font-bold">{stats.totalReviews}</p>
              <p className="text-sm text-neutral-500 mt-1">
                ⭐ {stats.averageRating.toFixed(1)} Durchschnitt
              </p>
            </div>

            <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-6 h-6" style={{ color: '#C3E41D' }} />
                <h3 className="text-lg font-semibold">Artikel</h3>
              </div>
              <p className="text-3xl font-bold">{stats.totalArticles}</p>
              <p className="text-sm text-neutral-500 mt-1">
                {stats.publishedArticles} veröffentlicht
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
                  className="bg-neutral-900 rounded-lg p-6 border border-neutral-800"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2" style={{ color: '#C3E41D' }}>
                        {course.titleDe}
                      </h3>
                      {course.titleAr && (
                        <p className="text-neutral-400 mb-2" dir="rtl">{course.titleAr}</p>
                      )}
                      <p className="text-neutral-300 text-sm mb-3 line-clamp-2">
                        {course.descriptionDe}
                      </p>
                      <div className="flex gap-2 text-xs">
                        <span className="px-2 py-1 bg-neutral-800 rounded">
                          {course.status}
                        </span>
                        <span className="px-2 py-1 bg-neutral-800 rounded">
                          {course.language}
                        </span>
                        {course.price && (
                          <span className="px-2 py-1 bg-neutral-800 rounded">
                            {course.price}€
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleDelete('course', course._id)}
                        className="p-2 bg-red-900/30 text-red-400 rounded hover:bg-red-900/50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {courses.length === 0 && (
                <div className="text-center py-12 text-neutral-500">
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
                  className="bg-neutral-900 rounded-lg p-6 border border-neutral-800"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2" style={{ color: '#C3E41D' }}>
                        {article.titleDe}
                      </h3>
                      <span className="px-2 py-1 bg-neutral-800 rounded text-xs">
                        {article.status}
                      </span>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Link
                        href={`/admin/articles/${article._id}/edit`}
                        className="p-2 bg-neutral-800 text-neutral-300 rounded hover:bg-neutral-700 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete('article', article._id)}
                        className="p-2 bg-red-900/30 text-red-400 rounded hover:bg-red-900/50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {articles.length === 0 && (
                <div className="text-center py-12 text-neutral-500">
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
                  className="bg-neutral-900 rounded-lg p-6 border border-neutral-800"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
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
                      <span className="ml-2 text-sm text-neutral-400">
                        {review.studentName || 'Anonym'}
                      </span>
                      {review.courseId && (
                        <span className="text-xs text-neutral-500">
                          - {review.courseId.titleDe}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-neutral-500">
                      {new Date(review.createdAt).toLocaleDateString('de-DE')}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-neutral-300 text-sm mt-2">{review.comment}</p>
                  )}
                </div>
              ))}
              {reviews.length === 0 && (
                <div className="text-center py-12 text-neutral-500">
                  Noch keine Bewertungen vorhanden.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

