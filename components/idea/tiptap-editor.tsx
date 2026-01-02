'use client';

import { useEffect } from 'react';
import { BubbleMenu, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, Code, Code2, Heading2, Italic, Link2, List, ListOrdered, Minus, Quote, Redo2, Undo2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type TiptapEditorProps = {
  id?: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  isInvalid?: boolean;
};

export default function TiptapEditor({ id, value, placeholder, onChange, isInvalid }: TiptapEditorProps) {
  const editorAttributes: Record<string, string> = {
    'aria-invalid': isInvalid ? 'true' : 'false',
    tabindex: '0',
    class: cn(
      'tiptap block min-h-[50vh] w-full md:w-[750px] lg:w-[940px] rounded-lg bg-foreground/2 border-0 px-3 py-2 text-sm leading-7 outline-none',
      'break-words overflow-x-hidden',
      isInvalid ? 'focus-visible:ring-destructive/40' : '',
    ),
  };

  if (id) {
    editorAttributes.id = id;
  }

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Placeholder.configure({
        placeholder: placeholder ?? 'توضیحات کامل ایده‌ات رو بنویس...',
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: value ?? '',
    editorProps: {
      attributes: editorAttributes,
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const currentHTML = editor.getHTML();
    if ((value ?? '') !== currentHTML) {
      editor.commands.setContent(value ?? '', false);
    }
  }, [editor, value]);

  if (!editor) {
    return <div className="min-h-40 rounded-lg bg-muted/40" />;
  }

  const toolbarButtonClass = (active: boolean) =>
    cn(
      'inline-flex size-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors',
      'hover:text-foreground hover:border-primary/40',
      active ? 'bg-primary text-primary-foreground border-primary' : '',
    );

  const handleLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('آدرس لینک را وارد کنید', previousUrl ?? '');
    if (url === null) return;
    if (!url.trim()) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run();
  };

  return (
    <div className="w-full space-y-2">
      <button type="button" className="sr-only" aria-hidden="true" onFocus={() => editor.chain().focus().run()}>
        تمرکز
      </button>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className={toolbarButtonClass(editor.isActive('heading', { level: 2 }))}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          aria-label="Heading"
        >
          <Heading2 className="size-4" />
        </button>
        <button type="button" className={toolbarButtonClass(editor.isActive('bold'))} onClick={() => editor.chain().focus().toggleBold().run()} aria-label="Bold">
          <Bold className="size-4" />
        </button>
        <button type="button" className={toolbarButtonClass(editor.isActive('italic'))} onClick={() => editor.chain().focus().toggleItalic().run()} aria-label="Italic">
          <Italic className="size-4" />
        </button>
        <button type="button" className={toolbarButtonClass(editor.isActive('code'))} onClick={() => editor.chain().focus().toggleCode().run()} aria-label="Inline code">
          <Code className="size-4" />
        </button>
        <button type="button" className={toolbarButtonClass(editor.isActive('codeBlock'))} onClick={() => editor.chain().focus().toggleCodeBlock().run()} aria-label="Code block">
          <Code2 className="size-4" />
        </button>
        <button
          type="button"
          className={toolbarButtonClass(editor.isActive('bulletList'))}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          aria-label="Bullet list"
        >
          <List className="size-4" />
        </button>
        <button
          type="button"
          className={toolbarButtonClass(editor.isActive('orderedList'))}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          aria-label="Ordered list"
        >
          <ListOrdered className="size-4" />
        </button>
        <button type="button" className={toolbarButtonClass(editor.isActive('blockquote'))} onClick={() => editor.chain().focus().toggleBlockquote().run()} aria-label="Blockquote">
          <Quote className="size-4" />
        </button>
        <button type="button" className={toolbarButtonClass(false)} onClick={() => editor.chain().focus().setHorizontalRule().run()} aria-label="Horizontal rule">
          <Minus className="size-4" />
        </button>
        <button type="button" className={toolbarButtonClass(editor.isActive('link'))} onClick={handleLink} aria-label="Link">
          <Link2 className="size-4" />
        </button>
        <button
          type="button"
          className={toolbarButtonClass(editor.isActive({ textAlign: 'left' }))}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          aria-label="Align left"
        >
          <AlignLeft className="size-4" />
        </button>
        <button
          type="button"
          className={toolbarButtonClass(editor.isActive({ textAlign: 'center' }))}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          aria-label="Align center"
        >
          <AlignCenter className="size-4" />
        </button>
        <button
          type="button"
          className={toolbarButtonClass(editor.isActive({ textAlign: 'right' }))}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          aria-label="Align right"
        >
          <AlignRight className="size-4" />
        </button>
        <button
          type="button"
          className={toolbarButtonClass(editor.isActive({ textAlign: 'justify' }))}
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          aria-label="Align justify"
        >
          <AlignJustify className="size-4" />
        </button>
        <button type="button" className={toolbarButtonClass(false)} onClick={() => editor.chain().focus().undo().run()} aria-label="Undo" disabled={!editor.can().undo()}>
          <Undo2 className="size-4" />
        </button>
        <button type="button" className={toolbarButtonClass(false)} onClick={() => editor.chain().focus().redo().run()} aria-label="Redo" disabled={!editor.can().redo()}>
          <Redo2 className="size-4" />
        </button>
      </div>
      <BubbleMenu editor={editor} tippyOptions={{ duration: 150, placement: 'top' }} className="rounded-lg border border-border bg-popover p-2 shadow-sm">
        <div className="flex items-center gap-2">
          <button type="button" className={toolbarButtonClass(editor.isActive('bold'))} onClick={() => editor.chain().focus().toggleBold().run()} aria-label="Bold">
            <Bold className="size-4" />
          </button>
          <button type="button" className={toolbarButtonClass(editor.isActive('italic'))} onClick={() => editor.chain().focus().toggleItalic().run()} aria-label="Italic">
            <Italic className="size-4" />
          </button>
          <button type="button" className={toolbarButtonClass(editor.isActive('code'))} onClick={() => editor.chain().focus().toggleCode().run()} aria-label="Inline code">
            <Code className="size-4" />
          </button>
          <button type="button" className={toolbarButtonClass(editor.isActive('link'))} onClick={handleLink} aria-label="Link">
            <Link2 className="size-4" />
          </button>
        </div>
      </BubbleMenu>
      <EditorContent editor={editor} className="w-full" />
    </div>
  );
}
