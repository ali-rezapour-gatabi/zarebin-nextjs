import { memo } from 'react';
import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ExpertFormValues } from '@/type/expert';
import { IRAN_PROVINCES } from '@/constant/expert.constant';

type LocationSectionProps = {
  control: Control<ExpertFormValues>;
  errors: FieldErrors<ExpertFormValues>;
  isExpertSaving: boolean;
  locationHint: string;
};

export const LocationSection = memo(({ control, errors, isExpertSaving, locationHint }: LocationSectionProps) => {
  return (
    <>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-3 rounded-xl border border-border/60 bg-card/60 p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold">استان</p>
            <span className="text-xs text-muted-foreground">انتخاب از فهرست استان‌های ایران</span>
          </div>
          <Controller
            control={control}
            name="province"
            rules={{ required: 'انتخاب استان ضروری است' }}
            render={({ field: { name, value, onChange, onBlur } }) => (
              <Select name={name} value={value || undefined} onValueChange={onChange} disabled={isExpertSaving} dir="rtl">
                <SelectTrigger className="h-14" onBlur={onBlur}>
                  <SelectValue placeholder="استان را انتخاب کنید" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {IRAN_PROVINCES.map((province) => (
                    <SelectItem key={province} value={province}>
                      {province}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.province && <p className="text-xs text-destructive">{errors.province.message}</p>}
        </div>

        <div className="space-y-3 rounded-xl border border-border/60 bg-card/60 p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold">شهر</p>
            <span className="text-xs text-muted-foreground">نام شهر خود را فارسی بنویسید</span>
          </div>
          <Controller
            control={control}
            name="city"
            rules={{ required: 'نام شهر ضروری است' }}
            render={({ field }) => (
              <Input id="city" placeholder="مثلاً بابل" className="h-14" disabled={isExpertSaving} aria-invalid={Boolean(errors.city)} {...field} value={field.value || ''} />
            )}
          />
          {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
          <p className="text-xs text-muted-foreground">{locationHint}</p>
        </div>
      </div>

      <div className="rounded-xl border border-border/60 bg-card/60 p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold">ادرس کامل</p>
          <span className="text-xs text-muted-foreground">مثلاً مازندران / بابل</span>
        </div>
        <Controller
          control={control}
          name="location"
          rules={{ required: 'عبارت مکان الزامی است' }}
          render={({ field }) => (
            <Input
              id="location"
              placeholder="استان / شهر / شهری منطقه / کوچه"
              className="h-14"
              disabled={isExpertSaving}
              aria-invalid={Boolean(errors.location)}
              {...field}
              value={field.value || ''}
            />
          )}
        />
        {errors.location && <p className="text-xs text-destructive">{errors.location.message}</p>}
      </div>
    </>
  );
});

LocationSection.displayName = 'LocationSection';
