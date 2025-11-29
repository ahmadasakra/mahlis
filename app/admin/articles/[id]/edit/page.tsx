'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import RichTextEditor from '@/components/RichTextEditor';
import ImageUpload from '@/components/ImageUpload';

interface Article {
  _id: string;
  titleDe: string;
  titleAr?: string;
  contentDe: string;
  contentAr?: string;
  excerptDe?: string;
  excerptAr?: string;
  featuredImage?: string;
  status: 'draft' | 'published';
}

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [articleId, setArticleId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    titleDe: '',
    titleAr: '',
    contentDe: '',
    contentAr: '',
    excerptDe: '',
    excerptAr: '',
    featuredImage: '',
    status: 'draft' as 'draft' | 'published',
  });

  useEffect(() => {
    const loadParams = async () => {
      const resolved = await params;
      setArticleId(resolved.id);
    };
    loadParams();
  }, [params]);

  useEffect(() => {
    // Prüfe ob eingeloggt
    checkAuth();
  }, [router]);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/admin');
      if (!res.ok) {
        router.push('/admin');
      }
    } catch (err) {
      router.push('/admin');
    }
  };

  useEffect(() => {
    async function fetchArticle() {
      if (!articleId) return;
      
      try {
        const res = await fetch('/api/admin');
        if (res.ok) {
          const data = await res.json();
          const article = data.articles?.find((a: Article) => a._id === articleId);
          if (article) {
            console.log('Loaded article from API:', article); // Debug
            setFormData({
              titleDe: article.titleDe || '',
              titleAr: article.titleAr || '',
              contentDe: article.contentDe || '',
              contentAr: article.contentAr || '',
              excerptDe: article.excerptDe || '',
              excerptAr: article.excerptAr || '',
              featuredImage: article.featuredImage || '',
              status: article.status || 'draft',
            });
          } else {
            console.error('Article not found in response:', data);
          }
        } else {
          console.error('Failed to fetch article:', res.status);
        }
      } catch (err) {
        setError('Fehler beim Laden des Artikels');
      } finally {
        setLoading(false);
      }
    }

    if (articleId) {
      fetchArticle();
    }
  }, [articleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload: any = {
        type: 'article',
        id: articleId,
        titleDe: formData.titleDe,
        contentDe: formData.contentDe,
        status: formData.status,
      };
      
      // Füge optionale Felder nur hinzu, wenn sie einen Wert haben
      if (formData.titleAr?.trim()) payload.titleAr = formData.titleAr.trim();
      if (formData.contentAr?.trim()) payload.contentAr = formData.contentAr.trim();
      if (formData.excerptDe?.trim()) payload.excerptDe = formData.excerptDe.trim();
      if (formData.excerptAr?.trim()) payload.excerptAr = formData.excerptAr.trim();
      if (formData.featuredImage?.trim()) payload.featuredImage = formData.featuredImage.trim();
      
      // Wenn Artikel auf "published" gesetzt wird, setze publishedAt
      if (formData.status === 'published') {
        payload.publishedAt = new Date().toISOString();
      }
      console.log('Updating article with payload:', payload); // Debug
      
      const res = await fetch('/api/admin', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push('/admin?tab=articles');
      } else {
        const data = await res.json();
        setError(data.error || 'Fehler beim Aktualisieren');
      }
    } catch (err) {
      setError('Fehler beim Aktualisieren des Artikels');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white pt-24 px-6 pb-12 transition-colors">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-neutral-500 dark:text-neutral-400">Lade Artikel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white pt-24 px-6 pb-12 transition-colors">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/admin?tab=articles"
          className="inline-flex items-center gap-2 mb-6 text-neutral-600 dark:text-neutral-400 hover:text-[#C3E41D] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zum Admin
        </Link>

        <h1 className="text-4xl font-bold mb-8" style={{ color: '#C3E41D' }}>
          Artikel bearbeiten
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
              className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-black dark:text-white focus:outline-none focus:border-[#C3E41D]"
            >
              <option value="draft">Entwurf</option>
              <option value="published">Veröffentlicht</option>
            </select>
          </div>

          {/* Titel DE */}
          <div>
            <label htmlFor="titleDe" className="block text-sm font-medium mb-2">
              Titel (Deutsch) *
            </label>
            <input
              id="titleDe"
              type="text"
              required
              value={formData.titleDe}
              onChange={(e) => setFormData({ ...formData, titleDe: e.target.value })}
              className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-black dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:border-[#C3E41D]"
              placeholder="Artikel-Titel auf Deutsch"
            />
          </div>

          {/* Titel AR */}
          <div>
            <label htmlFor="titleAr" className="block text-sm font-medium mb-2">
              Titel (Arabisch)
            </label>
            <input
              id="titleAr"
              type="text"
              value={formData.titleAr}
              onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
              className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-black dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:border-[#C3E41D]"
              placeholder="عنوان المقال بالعربية"
              dir="rtl"
            />
          </div>

          {/* Excerpt DE */}
          <div>
            <label htmlFor="excerptDe" className="block text-sm font-medium mb-2">
              Kurzbeschreibung (Deutsch)
            </label>
            <textarea
              id="excerptDe"
              rows={3}
              value={formData.excerptDe}
              onChange={(e) => setFormData({ ...formData, excerptDe: e.target.value })}
              className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-black dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:border-[#C3E41D] resize-none"
              placeholder="Kurze Zusammenfassung des Artikels"
            />
          </div>

          {/* Excerpt AR */}
          <div>
            <label htmlFor="excerptAr" className="block text-sm font-medium mb-2">
              Kurzbeschreibung (Arabisch)
            </label>
            <textarea
              id="excerptAr"
              rows={3}
              value={formData.excerptAr}
              onChange={(e) => setFormData({ ...formData, excerptAr: e.target.value })}
              className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-black dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:border-[#C3E41D] resize-none"
              placeholder="ملخص قصير للمقال"
              dir="rtl"
            />
          </div>

          {/* Featured Image */}
          <ImageUpload
            value={formData.featuredImage}
            onChange={(url) => setFormData({ ...formData, featuredImage: url })}
            label="Featured Image"
            placeholder="Bild-URL oder Datei hochladen"
          />

          {/* Content DE */}
          <div>
            <label htmlFor="contentDe" className="block text-sm font-medium mb-2">
              Inhalt (Deutsch) *
            </label>
            <RichTextEditor
              content={formData.contentDe}
              onChange={(content) => setFormData({ ...formData, contentDe: content })}
              placeholder="Beginne zu schreiben... Du kannst Bilder, Links, Überschriften und mehr hinzufügen."
              dir="ltr"
            />
          </div>

          {/* Content AR */}
          <div>
            <label htmlFor="contentAr" className="block text-sm font-medium mb-2">
              Inhalt (Arabisch)
            </label>
            <RichTextEditor
              content={formData.contentAr}
              onChange={(content) => setFormData({ ...formData, contentAr: content })}
              placeholder="ابدأ الكتابة... يمكنك إضافة الصور والروابط والعناوين والمزيد."
              dir="rtl"
            />
          </div>

          {error && (
            <div className="p-4 bg-red-900/30 text-red-400 rounded-lg">
              {error}
            </div>
          )}

          <div className="text-sm text-neutral-600 dark:text-neutral-400 p-4 bg-neutral-100 dark:bg-neutral-900 rounded-lg border border-neutral-300 dark:border-neutral-800">
            <p className="font-semibold mb-2">💡 Tipps:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Verwende Überschriften (H1, H2, H3) für Struktur</li>
              <li>Füge Bilder hinzu: Klicke auf das Bild-Icon und füge eine URL ein</li>
              <li>Links einfügen: Text markieren und Link-Icon klicken</li>
              <li>Formatierung: Fett, Kursiv, Listen für bessere Lesbarkeit</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
              style={{ backgroundColor: '#C3E41D', color: '#000' }}
            >
              <Save className="w-4 h-4" />
              {saving ? 'Wird gespeichert...' : 'Artikel speichern'}
            </button>
            <Link
              href="/admin?tab=articles"
              className="px-6 py-3 rounded-lg font-semibold bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
            >
              Abbrechen
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

