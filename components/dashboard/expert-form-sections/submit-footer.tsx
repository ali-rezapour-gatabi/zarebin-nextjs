import { memo } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

type SubmitFooterProps = {
  canSubmit: boolean;
  isExpertSaving: boolean;
  loading: boolean;
};

export const SubmitFooter = memo(({ canSubmit, isExpertSaving, loading }: SubmitFooterProps) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <Button type="submit" disabled={!canSubmit} className="h-12">
        {isExpertSaving && <Loader2 className="mr-2 size-4 animate-spin" />}
        {!loading && 'ذخیره اطلاعات تخصصی'}
        {loading && (
          <div className="flex items-center gap-2">
            <Spinner className="mr-2 size-4 animate-spin" />
            <span>در حال ذخیره</span>
          </div>
        )}
      </Button>
      <div className="text-sm text-muted-foreground">پس از ذخیره، تیم پشتیبانی مدارک را بررسی می‌کند. وضعیت تأیید در کارت امنیت نمایش داده می‌شود.</div>
    </div>
  );
});

SubmitFooter.displayName = 'SubmitFooter';
