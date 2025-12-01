'use client';

import { Facebook, Twitter, Linkedin, Mail, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface SocialMediaShareProps {
  url: string;
  title: string;
  description?: string;
}

export default function SocialMediaShare({ url, title, description }: SocialMediaShareProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = encodeURIComponent(url);
  const shareTitle = encodeURIComponent(title);
  const shareDescription = encodeURIComponent(description || '');

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
    email: `mailto:?subject=${shareTitle}&body=${shareDescription}%20${shareUrl}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="mt-8 pt-8 border-t border-neutral-300 dark:border-neutral-800">
      <h3 className="text-xl font-semibold mb-4" style={{ color: '#C3E41D' }}>
        Artikel teilen
      </h3>
      <div className="flex flex-wrap gap-3 items-center">
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-[#1877F2] text-white rounded-lg hover:bg-[#166FE5] transition-colors"
          aria-label="Auf Facebook teilen"
        >
          <Facebook className="w-4 h-4" />
          <span className="text-sm">Facebook</span>
        </a>

        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#1A91DA] transition-colors"
          aria-label="Auf Twitter teilen"
        >
          <Twitter className="w-4 h-4" />
          <span className="text-sm">Twitter</span>
        </a>

        <a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-[#0077B5] text-white rounded-lg hover:bg-[#006399] transition-colors"
          aria-label="Auf LinkedIn teilen"
        >
          <Linkedin className="w-4 h-4" />
          <span className="text-sm">LinkedIn</span>
        </a>

        <a
          href={shareLinks.email}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-700 dark:bg-neutral-600 text-white rounded-lg hover:bg-neutral-600 dark:hover:bg-neutral-500 transition-colors"
          aria-label="Per E-Mail teilen"
        >
          <Mail className="w-4 h-4" />
          <span className="text-sm">E-Mail</span>
        </a>

        <button
          onClick={handleCopyLink}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
          aria-label="Link kopieren"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span className="text-sm">Kopiert!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span className="text-sm">Link kopieren</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

