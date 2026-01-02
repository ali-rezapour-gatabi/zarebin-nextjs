import { memo } from 'react';
import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MAX_SAMPLE_ITEMS } from '@/constant/expert.constant';
import type { ExpertFormValues } from '@/type/expert';

type SampleSectionProps = {
  control: Control<ExpertFormValues>;
  errors: FieldErrors<ExpertFormValues>;
  watchedSample?: string[];
  sampleInput: string;
  setSampleInput: (value: string) => void;
  addSampleJob: () => void;
  removeSampleJob: (link: string) => void;
  isExpertSaving: boolean;
};

export const SampleSection = memo(({
  control,
  errors,
  watchedSample,
  sampleInput,
  setSampleInput,
  addSampleJob,
  removeSampleJob,
  isExpertSaving,
}: SampleSectionProps) => {
  return (
    <div className="space-y-4 rounded-xl border border-border/60 bg-card/60 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">نمونه کارها</p>
        <span className="text-xs text-muted-foreground">حداکثر ۱۰ لینک • افزودن با Enter</span>
      </div>
      <Controller
        name="sampleJob"
        control={control}
        rules={{
          validate: (value) => {
            const count = value?.length ?? 0;
            return count <= MAX_SAMPLE_ITEMS || `حداکثر ${MAX_SAMPLE_ITEMS} نمونه قابل ثبت است`;
          },
        }}
        render={() => <></>}
      />
      <div className="flex items-center gap-2">
        <Input
          placeholder="https://yourportfolio.com یا لینکدین / گیت‌هاب"
          value={sampleInput}
          className="h-14"
          onChange={(e) => setSampleInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault();
              addSampleJob();
            }
          }}
          disabled={isExpertSaving}
          aria-invalid={Boolean(errors.sampleJob)}
        />
        <Button type="button" size="icon" variant="secondary" className="rounded-xl h-14 w-14 border border-2" onClick={addSampleJob} disabled={isExpertSaving}>
          <Plus className="size-6" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {(watchedSample || []).map((link: string) => (
          <button
            key={link}
            type="button"
            onClick={() => removeSampleJob(link)}
            className="bg-accent text-accent-foreground/90 hover:text-accent-foreground flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold transition-colors"
            disabled={isExpertSaving}
          >
            {link}
            <X className="size-3" />
          </button>
        ))}
        {!watchedSample?.length && <span className="text-xs text-muted-foreground">برای افزایش اعتماد، لینک نمونه کار ثبت کنید</span>}
      </div>
      {errors.sampleJob && <p className="text-xs text-destructive">{errors.sampleJob.message}</p>}
    </div>
  );
});

SampleSection.displayName = 'SampleSection';
