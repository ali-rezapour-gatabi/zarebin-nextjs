import { memo } from 'react';
import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { ExpertFormValues } from '@/type/expert';

type DescriptionSectionProps = {
  control: Control<ExpertFormValues>;
  errors: FieldErrors<ExpertFormValues>;
  watchedDescription?: string;
  isExpertSaving: boolean;
};

export const DescriptionSection = memo(({ control, errors, watchedDescription, isExpertSaving }: DescriptionSectionProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="description">توضیحات تکمیلی</Label>
      <Controller
        name="description"
        control={control}
        rules={{ required: 'توضیحات ضروری است', minLength: { value: 20, message: 'حداقل ۲۰ کاراکتر بنویسید' } }}
        render={({ field }) => (
          <Textarea
            id="description"
            className="text-xs"
            rows={8}
            aria-invalid={Boolean(errors.description)}
            disabled={isExpertSaving}
            placeholder="به مشتریان بگویید چگونه به آن‌ها کمک می‌کنید، تجربیات کلیدی یا شیوه همکاری شما چیست."
            {...field}
            value={field.value || ''}
          />
        )}
      />
      <div className="flex items-center justify-between text-[12px] text-muted-foreground">
        {errors.description ? <p className="text-destructive">{errors.description.message}</p> : <span>{watchedDescription?.length || 0} کاراکتر</span>}
      </div>
    </div>
  );
});

DescriptionSection.displayName = 'DescriptionSection';
