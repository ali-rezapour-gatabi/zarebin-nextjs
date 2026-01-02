import { memo } from 'react';
import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { ExpertFormValues } from '@/type/expert';

type SubdomainSectionProps = {
  control: Control<ExpertFormValues>;
  errors: FieldErrors<ExpertFormValues>;
  mergedSubdomainOptions: string[];
  watchedSubdomains?: string[];
  subdomainInput: string;
  setSubdomainInput: (value: string) => void;
  addSubdomainOption: () => void;
  toggleOption: (key: 'subdomains', value: string) => void;
  isExpertSaving: boolean;
};

export const SubdomainSection = memo(({
  control,
  errors,
  mergedSubdomainOptions,
  watchedSubdomains,
  subdomainInput,
  setSubdomainInput,
  addSubdomainOption,
  toggleOption,
  isExpertSaving,
}: SubdomainSectionProps) => {
  return (
    <div className="space-y-3 rounded-xl border border-border/60 bg-muted/40 p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold">زیرحوزه‌ها / تخصص‌ها</p>
        <span className="text-xs text-muted-foreground">{watchedSubdomains?.length ? `${watchedSubdomains.length} انتخاب` : 'حداقل یک مورد انتخاب کنید'}</span>
      </div>
      <Controller
        name="subdomains"
        control={control}
        rules={{
          validate: (value) => (value && value.length > 0) || 'انتخاب حداقل یک زیرحوزه ضروری است',
        }}
        render={() => <></>}
      />
      <div className="flex flex-wrap gap-2">
        {mergedSubdomainOptions.map((sub) => {
          const active = watchedSubdomains?.includes(sub);
          return (
            <Button
              key={sub}
              type="button"
              variant={active ? 'secondary' : 'outline'}
              size="sm"
              className={cn('rounded-full border-border/70 px-4', active ? 'shadow-sm bg-primary' : 'bg-background')}
              onClick={() => toggleOption('subdomains', sub)}
              disabled={isExpertSaving}
            >
              {sub}
            </Button>
          );
        })}
      </div>
      <div className="flex items-center gap-2">
        <Input
          placeholder="زیرحوزه جدید اضافه کنید"
          value={subdomainInput}
          className="h-11"
          disabled={isExpertSaving}
          onChange={(e) => setSubdomainInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault();
              addSubdomainOption();
            }
          }}
        />
        <Button type="button" size="sm" variant="secondary" className="h-11 px-4" onClick={addSubdomainOption} disabled={isExpertSaving}>
          افزودن
        </Button>
      </div>
      {errors.subdomains && <p className="text-xs text-destructive">{errors.subdomains.message}</p>}
    </div>
  );
});

SubdomainSection.displayName = 'SubdomainSection';
