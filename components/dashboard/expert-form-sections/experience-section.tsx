import { memo } from 'react';
import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EXPERIENCE_OPTIONS } from '@/constant/expert.constant';
import type { ExperienceLevel } from '@/store/user';
import type { ExpertFormValues } from '@/type/expert';

type ExperienceSectionProps = {
  control: Control<ExpertFormValues>;
  errors: FieldErrors<ExpertFormValues>;
  isExpertSaving: boolean;
};

export const ExperienceSection = memo(({ control, errors, isExpertSaving }: ExperienceSectionProps) => {
  return (
    <div className="grid grid-cols-1 gap-5 rounded-xl border border-border/60 bg-card/60 p-4 sm:grid-cols-2">
      <div className="flex flex-col gap-4">
        <Label htmlFor="yearsOfExperience">سال‌های تجربه</Label>

        <Controller
          control={control}
          name="yearsOfExperience"
          rules={{ required: 'یکی از گزینه‌های تجربه را انتخاب کنید' }}
          render={({ field: { name, onChange, onBlur, value } }) => (
            <Select name={name} value={value ?? undefined} onValueChange={(val) => onChange(val as ExperienceLevel)} disabled={isExpertSaving} dir="rtl">
              <SelectTrigger className="h-14" onBlur={onBlur}>
                <SelectValue placeholder="میزان تجربه را انتخاب کنید" />
              </SelectTrigger>

              <SelectContent>
                {EXPERIENCE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.yearsOfExperience && <p className="text-xs text-destructive">{errors.yearsOfExperience.message}</p>}
      </div>
      <div className="flex flex-col gap-4">
        <Label htmlFor="availability">دسترسی و زمان‌بندی</Label>
        <Controller
          name="availability"
          control={control}
          rules={{ required: 'زمان‌بندی را مشخص کنید' }}
          render={({ field }) => (
            <Input
              id="availability"
              placeholder="مثلاً: شنبه تا چهارشنبه • ۹:۰۰ تا ۱۸:۰۰ (GMT+3:30)"
              aria-invalid={Boolean(errors.availability)}
              className="h-14"
              disabled={isExpertSaving}
              {...field}
              value={field.value || ''}
            />
          )}
        />
        {errors.availability && <p className="text-xs text-destructive">{errors.availability.message}</p>}
      </div>
    </div>
  );
});

ExperienceSection.displayName = 'ExperienceSection';
