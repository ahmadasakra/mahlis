'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, List, ListOrdered, Link as LinkIcon, Image as ImageIcon, Undo, Redo } from 'lucide-react';
import { useCallback } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  dir?: 'ltr' | 'rtl';
}

export default function RichTextEditor({ content, onChange, placeholder = 'Beginne zu schreiben...', dir = 'ltr' }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#C3E41D] underline',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[300px] p-4',
        dir,
      },
    },
  });

  const addImage = useCallback(() => {
    const url = window.prompt('Bild-URL eingeben:');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL eingeben:', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-neutral-300 dark:border-neutral-700 rounded-lg overflow-hidden bg-white dark:bg-neutral-900">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-3 border-b border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors ${
            editor.isActive('bold') ? 'bg-neutral-200 dark:bg-neutral-700' : ''
          }`}
          title="Fett"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors ${
            editor.isActive('italic') ? 'bg-neutral-200 dark:bg-neutral-700' : ''
          }`}
          title="Kursiv"
        >
          <Italic className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-700 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors ${
            editor.isActive('heading', { level: 1 }) ? 'bg-neutral-200 dark:bg-neutral-700' : ''
          }`}
          title="Überschrift 1"
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors ${
            editor.isActive('heading', { level: 2 }) ? 'bg-neutral-200 dark:bg-neutral-700' : ''
          }`}
          title="Überschrift 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors ${
            editor.isActive('heading', { level: 3 }) ? 'bg-neutral-200 dark:bg-neutral-700' : ''
          }`}
          title="Überschrift 3"
        >
          H3
        </button>
        <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-700 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors ${
            editor.isActive('bulletList') ? 'bg-neutral-200 dark:bg-neutral-700' : ''
          }`}
          title="Aufzählung"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors ${
            editor.isActive('orderedList') ? 'bg-neutral-200 dark:bg-neutral-700' : ''
          }`}
          title="Nummerierte Liste"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-700 mx-1" />
        <button
          type="button"
          onClick={setLink}
          className={`p-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors ${
            editor.isActive('link') ? 'bg-neutral-200 dark:bg-neutral-700' : ''
          }`}
          title="Link einfügen"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={addImage}
          className="p-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
          title="Bild einfügen"
        >
          <ImageIcon className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-700 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="p-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50"
          title="Rückgängig"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="p-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50"
          title="Wiederholen"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Content */}
      <div className="min-h-[300px] max-h-[600px] overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

