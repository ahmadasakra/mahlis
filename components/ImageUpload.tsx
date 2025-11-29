'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
}

export default function ImageUpload({ value, onChange, label = 'Bild', placeholder = 'Bild-URL oder Datei hochladen' }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validiere Dateityp
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Nur Bilddateien sind erlaubt (JPEG, PNG, GIF, WebP)');
      return;
    }

    // Validiere Dateigröße (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('Datei zu groß. Maximum ist 5MB.');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Upload fehlgeschlagen');
      }

      const data = await res.json();
      onChange(data.url);
      setError(''); // Clear any previous errors
    } catch (err: any) {
      setError(err.message || 'Fehler beim Hochladen');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        {label}
      </label>
      
      <div className="space-y-3">
        {/* URL Input */}
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setError(''); // Clear error when user types
          }}
          className="w-full px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-black dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:border-[#C3E41D]"
          placeholder={placeholder}
        />

        {/* File Upload Button */}
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
            disabled={isUploading}
          />
          <label
            htmlFor="file-upload"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
              isUploading
                ? 'bg-neutral-300 dark:bg-neutral-700 text-neutral-500 cursor-not-allowed'
                : 'bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-black dark:text-white'
            }`}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Wird hochgeladen...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Datei hochladen
              </>
            )}
          </label>
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-2 text-red-500 hover:text-red-700 transition-colors"
              title="Bild entfernen"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Preview */}
        {value && (
          <div className="mt-3">
            <img
              src={value}
              alt="Preview"
              className="w-full max-w-md h-auto rounded-lg border border-neutral-300 dark:border-neutral-700"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

