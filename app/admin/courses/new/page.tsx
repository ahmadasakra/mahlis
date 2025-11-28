'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function NewCoursePage() {
  const router = useRouter();
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    titleDe: '',
    titleAr: '',
    descriptionDe: '',
    descriptionAr: '',
    language: 'de' as 'de' | 'ar' | 'both',
    price: '',
    status: 'draft' as 'draft' | 'published' | 'archived',
    startDate: '',
    endDate: '',
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
          type: 'course',
          ...formData,
          price: formData.price ? parseFloat(formData.price) : undefined,
          startDate: formData.startDate || undefined,
          endDate: formData.endDate || undefined,
        }),
      });

      if (res.ok) {
        router.push('/admin?tab=courses');
      } else {
        const data = await res.json();
        setError(data.error || 'Fehler beim Erstellen');
      }
    } catch (err) {
      setError('Fehler beim Erstellen des Kurses');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-6 pb-12">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/admin?tab=courses"
          className="inline-flex items-center gap-2 mb-6 text-neutral-400 hover:text-[#C3E41D] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zum Admin
        </Link>

        <h1 className="text-4xl font-bold mb-8" style={{ color: '#C3E41D' }}>
          Neuer Kurs
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' | 'archived' })}
              className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-[#C3E41D]"
            >
              <option value="draft">Entwurf</option>
              <option value="published">Veröffentlicht</option>
              <option value="archived">Archiviert</option>
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
              placeholder="Kurs-Titel auf Deutsch"
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
              placeholder="عنوان الدورة بالعربية"
              dir="rtl"
            />
          </div>

          {/* Beschreibung DE */}
          <div>
            <label htmlFor="descriptionDe" className="block text-sm font-medium mb-2">
              Beschreibung (Deutsch) *
            </label>
            <textarea
              id="descriptionDe"
              required
              rows={6}
              value={formData.descriptionDe}
              onChange={(e) => setFormData({ ...formData, descriptionDe: e.target.value })}
              className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-[#C3E41D] resize-none"
              placeholder="Ausführliche Kursbeschreibung auf Deutsch..."
            />
          </div>

          {/* Beschreibung AR */}
          <div>
            <label htmlFor="descriptionAr" className="block text-sm font-medium mb-2">
              Beschreibung (Arabisch)
            </label>
            <textarea
              id="descriptionAr"
              rows={6}
              value={formData.descriptionAr}
              onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
              className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-[#C3E41D] resize-none"
              placeholder="وصف مفصل للدورة بالعربية..."
              dir="rtl"
            />
          </div>

          {/* Sprache & Preis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Sprache</label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value as 'de' | 'ar' | 'both' })}
                className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-[#C3E41D]"
              >
                <option value="de">Deutsch</option>
                <option value="ar">Arabisch</option>
                <option value="both">Beide</option>
              </select>
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium mb-2">
                Preis (€)
              </label>
              <input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-[#C3E41D]"
                placeholder="99.00"
              />
            </div>
          </div>

          {/* Daten */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium mb-2">
                Startdatum
              </label>
              <input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-[#C3E41D]"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium mb-2">
                Enddatum
              </label>
              <input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-[#C3E41D]"
              />
            </div>
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
              {loading ? 'Wird gespeichert...' : 'Kurs speichern'}
            </button>
            <Link
              href="/admin?tab=courses"
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

