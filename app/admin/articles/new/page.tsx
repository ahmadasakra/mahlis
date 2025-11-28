'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function NewArticlePage() {
  const router = useRouter();
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    titleDe: '',
    titleAr: '',
    contentDe: '',
    contentAr: '',
    excerptDe: '',
    excerptAr: '',
    status: 'draft' as 'draft' | 'published',
  });

  useEffect(() => {
    const saved = localStorage.getItem('admin_api_key');
    if (!saved) {
      router.push('/admin');
      return;
    }
    setApiKey(saved);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify({
          type: 'article',
          ...formData,
          publishedAt: formData.status === 'published' ? new Date().toISOString() : undefined,
        }),
      });

      if (res.ok) {
        router.push('/admin?tab=articles');
      } else {
        const data = await res.json();
        setError(data.error || 'Fehler beim Erstellen');
      }
    } catch (err) {
      setError('Fehler beim Erstellen des Artikels');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-6 pb-12">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/admin?tab=articles"
          className="inline-flex items-center gap-2 mb-6 text-neutral-400 hover:text-[#C3E41D] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zum Admin
        </Link>

        <h1 className="text-4xl font-bold mb-8" style={{ color: '#C3E41D' }}>
          Neuer Artikel
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
              className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-[#C3E41D]"
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
              className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-[#C3E41D]"
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
              className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-[#C3E41D]"
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
              className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-[#C3E41D] resize-none"
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
              className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-[#C3E41D] resize-none"
              placeholder="ملخص قصير للمقال"
              dir="rtl"
            />
          </div>

          {/* Content DE */}
          <div>
            <label htmlFor="contentDe" className="block text-sm font-medium mb-2">
              Inhalt (Deutsch) *
            </label>
            <textarea
              id="contentDe"
              required
              rows={15}
              value={formData.contentDe}
              onChange={(e) => setFormData({ ...formData, contentDe: e.target.value })}
              className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-[#C3E41D] resize-none font-mono text-sm"
              placeholder="Vollständiger Artikel-Text auf Deutsch..."
            />
          </div>

          {/* Content AR */}
          <div>
            <label htmlFor="contentAr" className="block text-sm font-medium mb-2">
              Inhalt (Arabisch)
            </label>
            <textarea
              id="contentAr"
              rows={15}
              value={formData.contentAr}
              onChange={(e) => setFormData({ ...formData, contentAr: e.target.value })}
              className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-[#C3E41D] resize-none font-mono text-sm"
              placeholder="نص المقال الكامل بالعربية..."
              dir="rtl"
            />
          </div>

          {error && (
            <div className="p-4 bg-red-900/30 text-red-400 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
              style={{ backgroundColor: '#C3E41D', color: '#000' }}
            >
              <Save className="w-4 h-4" />
              {loading ? 'Wird gespeichert...' : 'Artikel speichern'}
            </button>
            <Link
              href="/admin?tab=articles"
              className="px-6 py-3 rounded-lg font-semibold bg-neutral-800 hover:bg-neutral-700 transition-colors"
            >
              Abbrechen
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

