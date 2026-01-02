import { memo, type RefObject } from 'react';
import { UploadCloud, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { MAX_FILES } from '@/constant/expert.constant';

const ACCEPTED_TYPES = 'image/png,image/jpeg,image/webp';

type DocumentPreview = {
  src: string;
  revoke?: () => void;
};

type DocumentsSectionProps = {
  documentPreviews: DocumentPreview[];
  watchedDocuments?: unknown[];
  fileInputRef: RefObject<HTMLInputElement | null>;
  handleAddDocuments: (files?: FileList) => void;
  removeDocument: (index: number) => void;
  isExpertSaving: boolean;
};

export const DocumentsSection = memo(({ documentPreviews, watchedDocuments, fileInputRef, handleAddDocuments, removeDocument, isExpertSaving }: DocumentsSectionProps) => {
  return (
    <div className="space-y-2">
      <Label>مدارک و گواهی‌ها (حداکثر ۳ تصویر)</Label>

      <div className="flex gap-3 flex-wrap mt-4">
        {documentPreviews.map((file, index) => {
          const preview = file.src;
          return (
            <div key={`${preview}-${index}`} className="relative h-24 w-24 overflow-hidden rounded-xl border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="document" className="h-full w-full object-cover" loading="lazy" />
              <button type="button" onClick={() => removeDocument(index)} className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white">
                <X className="size-4" />
              </button>
            </div>
          );
        })}

        {(watchedDocuments?.length ?? 0) < MAX_FILES && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-24 w-24 items-center justify-center rounded-xl border border-dashed text-muted-foreground hover:bg-muted"
            disabled={isExpertSaving}
          >
            <UploadCloud className="size-6" />
          </button>
        )}
      </div>

      <input type="file" ref={fileInputRef} hidden multiple accept={ACCEPTED_TYPES} onChange={(e) => handleAddDocuments(e.target.files ?? undefined)} />
    </div>
  );
});

DocumentsSection.displayName = 'DocumentsSection';
