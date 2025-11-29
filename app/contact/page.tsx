'use client';

import { useState } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function ContactPage() {
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
        text: 'Vielen Dank für deine Nachricht! Ich werde mich bald bei dir melden.' 
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white pt-24 px-6 pb-12 transition-colors">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center" style={{ color: '#C3E41D' }}>
          Kontakt
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Kontaktinformationen */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-6" style={{ color: '#C3E41D' }}>
                Get in Touch
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 mb-8">
                Hast du Fragen zu meinen Kursen oder möchtest du mit mir zusammenarbeiten? 
                Ich freue mich auf deine Nachricht!
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 mt-1 text-[#C3E41D]" />
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">E-Mail</p>
                  <a 
                    href="mailto:ritamahlis22@gmail.com" 
                    className="text-black dark:text-white hover:text-[#C3E41D] transition-colors"
                  >
                    ritamahlis22@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 mt-1 text-[#C3E41D]" />
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Standort</p>
                  <p className="text-black dark:text-white">Deutschland</p>
                </div>
              </div>
            </div>
          </div>

          {/* Kontaktformular */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name *
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-black dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:border-[#C3E41D]"
                  placeholder="Dein Name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  E-Mail *
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-black dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:border-[#C3E41D]"
                  placeholder="deine@email.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Betreff *
                </label>
                <input
                  id="subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-black dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:border-[#C3E41D]"
                  placeholder="Worum geht es?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Nachricht *
                </label>
                <textarea
                  id="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-black dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:border-[#C3E41D] resize-none"
                  placeholder="Deine Nachricht..."
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
                {isSubmitting ? 'Wird gesendet...' : 'Nachricht senden'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

