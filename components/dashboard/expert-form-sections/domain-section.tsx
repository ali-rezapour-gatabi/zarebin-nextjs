import { memo } from 'react';
import { Controller, type Control, type FieldErrors, type UseFormSetValue } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { ExpertFormValues } from '@/type/expert';

type DomainSectionProps = {
  control: Control<ExpertFormValues>;
  errors: FieldErrors<ExpertFormValues>;
  mergedDomainOptions: string[];
  watchedDomain?: string;
  domainInput: string;
  setDomainInput: (value: string) => void;
  addDomainOption: () => void;
  isExpertSaving: boolean;
  setValue: UseFormSetValue<ExpertFormValues>;
  domainHint: string;
};

export const DomainSection = memo(
  ({ control, errors, mergedDomainOptions, watchedDomain, domainInput, setDomainInput, addDomainOption, isExpertSaving, setValue, domainHint }: DomainSectionProps) => {
    return (
      <div className="space-y-3 rounded-xl border border-border/60 bg-muted/40 p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold">حوزه‌های اصلی</p>
          <span className="text-xs text-muted-foreground">{domainHint}</span>
        </div>
        <Controller
          name="domains"
          control={control}
          rules={{
            validate: (value) => (value && value.trim().length > 0) || 'حداقل یک حوزه لازم است',
          }}
          render={() => <></>}
        />
        <div className="flex flex-wrap gap-2">
          {mergedDomainOptions.map((domain) => {
            const active = watchedDomain === domain;
            return (
              <Button
                key={domain}
                type="button"
                size="sm"
                variant={active ? 'secondary' : 'outline'}
                className={cn('rounded-full border-border/70 px-4', active ? 'shadow-sm bg-primary' : 'bg-background')}
                disabled={isExpertSaving}
                onClick={() => setValue('domains', domain, { shouldDirty: true, shouldValidate: true })}
              >
                {domain}
              </Button>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="حوزه جدید اضافه کنید"
            value={domainInput}
            className="h-11"
            disabled={isExpertSaving}
            onChange={(e) => setDomainInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addDomainOption();
              }
            }}
          />
          <Button type="button" size="sm" variant="secondary" className="h-11 px-4" onClick={addDomainOption} disabled={isExpertSaving}>
            افزودن
          </Button>
        </div>
        {errors.domains && <p className="text-xs text-destructive">{errors.domains.message}</p>}
      </div>
    );
  },
);

DomainSection.displayName = 'DomainSection';
