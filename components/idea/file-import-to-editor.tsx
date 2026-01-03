'use client';

import { useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader } from '@/components/ui/drawer';

const ACCEPTED_EXTENSIONS = ['pdf', 'md', 'mdx', 'txt'];

type InsertMode = 'replace' | 'append';

type ViewMode = 'file' | 'current';

type FormatMode = 'markdown' | 'raw';

type FileImportToEditorProps = {
  onImport: (html: string) => void;
  currentText: string;
  disabled?: boolean;
  maxSizeMB?: number;
  mode?: InsertMode;
  preserveMultipleSpaces?: boolean;
};

export default function FileImportToEditor({ onImport, currentText, disabled, maxSizeMB = 10, mode = 'replace', preserveMultipleSpaces = true }: FileImportToEditorProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const [importedText, setImportedText] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('file');
  const [formatMode, setFormatMode] = useState<FormatMode>('markdown');
  const insertMode = mode;

  const handlePickFile = () => {
    if (!disabled && !isLoading) {
      inputRef.current?.click();
    }
  };

  const validateFile = (file: File) => {
    const sizeLimit = maxSizeMB * 1024 * 1024;
    if (file.size > sizeLimit) {
      return `حجم فایل نباید بیشتر از ${maxSizeMB} مگابایت باشد.`;
    }
    const extension = file.name.toLowerCase().split('.').pop() ?? '';
    if (!ACCEPTED_EXTENSIONS.includes(extension)) {
      return 'فرمت فایل پشتیبانی نمی‌شود.';
    }
    return null;
  };

  const readTextFile = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('خواندن فایل با خطا مواجه شد.'));
      reader.onload = () => resolve(String(reader.result ?? ''));
      reader.readAsText(file);
    });

  const parsePdfFile = async (file: File) => {
    const pdfjs = await import('pdfjs-dist/build/pdf');
    pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();
    const buffer = await file.arrayBuffer();
    const loadingTask = pdfjs.getDocument({ data: buffer });
    const pdf = await loadingTask.promise;
    const pagesText: string[] = [];

    for (let pageIndex = 1; pageIndex <= pdf.numPages; pageIndex += 1) {
      setProgress({ current: pageIndex, total: pdf.numPages });
      const page = await pdf.getPage(pageIndex);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item) => ('str' in item ? item.str : ''))
        .filter(Boolean)
        .join(' ');
      pagesText.push(pageText.trim());
    }

    return pagesText.filter(Boolean).join('\n\n');
  };

  const textToHtml = (text: string, preserveSpaces: boolean) => {
    let escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    if (preserveSpaces) {
      escaped = escaped.replace(/ {2,}/g, (match) =>
        match
          .split('')
          .map((char, index) => (index === match.length - 1 ? char : '&nbsp;'))
          .join(''),
      );
    }

    const blocks = escaped
      .split(/\n{2,}/)
      .map((block) => block.trim())
      .filter(Boolean);

    if (blocks.length === 0) return '';

    return blocks.map((block) => `<p>${block.replace(/\n/g, '<br/>')}</p>`).join('');
  };

  const htmlToPlainText = (html: string) => {
    if (!html.trim()) return '';
    const normalized = html.replace(/<br\s*\/?\s*>/gi, '\n').replace(/<\/?p\b[^>]*>/gi, '\n\n');
    const wrapper = typeof document !== 'undefined' ? document.createElement('div') : null;
    if (!wrapper) return normalized.replace(/<[^>]+>/g, '');
    wrapper.innerHTML = normalized;
    return (wrapper.textContent ?? '').replace(/\n{3,}/g, '\n\n').trim();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError(null);
    setProgress(null);

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      event.target.value = '';
      return;
    }

    setIsLoading(true);

    try {
      const extension = file.name.toLowerCase().split('.').pop() ?? '';
      const extractedText = extension === 'pdf' ? await parsePdfFile(file) : await readTextFile(file);

      if (!extractedText.trim()) {
        setError('متنی از فایل استخراج نشد.');
      } else {
        setImportedText(extractedText);
        setViewMode('file');
        setIsDrawerOpen(true);
      }
    } catch {
      setError('خواندن فایل با خطا مواجه شد.');
    } finally {
      setIsLoading(false);
      setProgress(null);
      event.target.value = '';
    }
  };

  const handleDrawerChange = (open: boolean) => {
    setIsDrawerOpen(open);
    if (!open) {
      setFormatMode('markdown');
    }
  };

  const openCurrentPreview = () => {
    setViewMode('current');
    setIsDrawerOpen(true);
  };

  const currentPlainText = useMemo(() => htmlToPlainText(currentText ?? ''), [currentText]);
  const previewText = viewMode === 'file' ? importedText : currentPlainText;

  const handleInsert = () => {
    if (!importedText.trim()) return;
    const importedHtml = textToHtml(importedText, preserveMultipleSpaces);
    if (!importedHtml.trim()) return;

    if (insertMode === 'append' && currentText?.trim()) {
      const separator = '<p><br/></p>';
      onImport(`${currentText}${separator}${importedHtml}`);
    } else {
      onImport(importedHtml);
    }
    setIsDrawerOpen(false);
  };

  return (
    <div className="space-y-3">
      <input ref={inputRef} type="file" accept=".pdf,.md,.mdx,.txt" className="hidden" onChange={handleFileChange} />
      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" onClick={handlePickFile} disabled={disabled || isLoading} className="h-10 text-primary-foreground">
          افزودن فایل (PDF یا README)
        </Button>
        <Button type="button" variant="outline" onClick={openCurrentPreview} disabled={disabled || isLoading} className="h-10">
          پیش‌نمایش متن فعلی
        </Button>
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Spinner className="size-4" />
            {progress ? `در حال خواندن فایل... (${progress.current}/${progress.total})` : 'در حال خواندن فایل...'}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <Drawer open={isDrawerOpen} onOpenChange={handleDrawerChange}>
        <DrawerContent>
          <DrawerHeader className="gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Button type="button" className="h-10" onClick={handleInsert} disabled={!importedText.trim()}>
                  افزودن به توضیحات
                </Button>
                <Button type="button" variant="outline" className="h-10" onClick={() => setIsDrawerOpen(false)}>
                  بستن
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button type="button" variant={viewMode === 'file' ? 'default' : 'outline'} className="h-10" onClick={() => setViewMode('file')}>
                  متن فایل
                </Button>
                <Button type="button" variant={viewMode === 'current' ? 'default' : 'outline'} className="h-10" onClick={() => setViewMode('current')}>
                  متن فعلی توضیحات
                </Button>
                <Button type="button" variant={formatMode === 'markdown' ? 'default' : 'outline'} className="h-10" onClick={() => setFormatMode('markdown')}>
                  نمایش Markdown
                </Button>
                <Button type="button" variant={formatMode === 'raw' ? 'default' : 'outline'} className="h-10" onClick={() => setFormatMode('raw')}>
                  نمایش متن خام
                </Button>
              </div>
            </div>
          </DrawerHeader>
          <div className="px-4 pb-4">
            <div className="markdown-preview scrollbar-system max-h-[60vh] overflow-auto rounded-lg border border-border bg-muted/40 p-3 text-sm leading-6">
              {formatMode === 'raw' ? (
                <pre className="whitespace-pre-wrap break-words font-sans">{previewText}</pre>
              ) : (
                <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{previewText}</ReactMarkdown>
              )}
            </div>
          </div>
          <DrawerFooter />
        </DrawerContent>
      </Drawer>
    </div>
  );
}
