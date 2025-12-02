'use client';

import { useState } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { useLocale } from '@/lib/locale';

export default function ContactPage() {
  const { t, dir } = useLocale();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    // Hier könntest du eine API Route für Kontaktformular erstellen
    // Für jetzt simulieren wir nur eine Erfolgsmeldung
    setTimeout(() => {
      setMessage({ 
        type: 'success', 
        text: t('contact.formSuccess')
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white pt-24 px-6 pb-12 transition-colors" dir={dir}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center" style={{ color: '#C3E41D' }}>
          {t('contact.title')}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Kontaktinformationen */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-6" style={{ color: '#C3E41D' }}>
                {t('contact.getInTouch')}
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 mb-8">
                {t('contact.description')}
              </p>
            </div>

            <div className="space-y-4">
              <div className={`flex items-start gap-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <Mail className="w-5 h-5 mt-1 text-[#C3E41D]" />
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">{t('contact.email')}</p>
                  <a 
                    href="mailto:ritamahlis22@gmail.com" 
                    className="text-black dark:text-white hover:text-[#C3E41D] transition-colors"
                  >
                    ritamahlis22@gmail.com
                  </a>
                </div>
              </div>

              <div className={`flex items-start gap-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <MapPin className="w-5 h-5 mt-1 text-[#C3E41D]" />
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">{t('contact.location')}</p>
                  <p className="text-black dark:text-white">{t('contact.locationValue')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Kontaktformular */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  {t('contact.formName')} *
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-black dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:border-[#C3E41D]"
                  placeholder={t('contact.formPlaceholderName')}
                  dir={dir}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  {t('contact.formEmail')} *
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-black dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:border-[#C3E41D]"
                  placeholder={t('contact.formPlaceholderEmail')}
                  dir="ltr"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  {t('contact.formSubject')} *
                </label>
                <input
                  id="subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-black dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:border-[#C3E41D]"
                  placeholder={t('contact.formPlaceholderSubject')}
                  dir={dir}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  {t('contact.formMessage')} *
                </label>
                <textarea
                  id="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-black dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:border-[#C3E41D] resize-none"
                  placeholder={t('contact.formPlaceholderMessage')}
                  dir={dir}
                />
              </div>

              {message && (
                <div
                  className={`p-3 rounded ${
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
                disabled={isSubmitting}
                className="w-full px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: '#C3E41D',
                  color: '#000',
                }}
              >
                {isSubmitting ? t('contact.formSubmitting') : t('contact.formSubmit')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

