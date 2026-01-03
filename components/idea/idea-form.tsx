'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Control, Controller } from 'react-hook-form';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DOMAINS } from '@/constant/domain.constant';
import { cn } from '@/lib/utils';
import { useState } from 'react';

type IdeaCreateFormValues = {
  title: string;
  description: string;
  domain: string;
  commentsVisibility: boolean;
};

export default function IdeaForm({
  control,
  setActiveTab,
}: {
  control: Control<IdeaCreateFormValues>;
  setActiveTab: React.Dispatch<React.SetStateAction<'general' | 'description'>>;
}) {
  const [open, setOpen] = useState(false);
  return (
    <section className="px-3 lg:p-0">
      <h1 className="text-2xl font-bold mt-3 md:mt-10">ایده یا پیشنهادت رو با بقیه به اشتراک بذار</h1>
      <p className="text-sm text-primary/70 mt-3 tracking-normal font-bold leading-6">
        اگه یه ایده توی ذهنت داری یا راه‌ حلی برای یه مشکل پیدا کردی، اینجا می‌تونی مطرحش کنی و از بازخورد بقیه استفاده کنی.
        <br />
        با انتشار ایده‌ت، این امکان رو داری که متخصص‌های مرتبط رو پیدا کنی، ایده‌ت رو بهتر و شفاف‌تر کنی، و حتی برای همکاری یا جذب سرمایه‌گذار قدم‌های جدی‌تری برداری.
      </p>
      <div className="mt-6 space-y-10">
        <Controller
          name="title"
          control={control}
          rules={{
            required: 'عنوان ایده الزامی است',
            minLength: {
              value: 5,
              message: 'عنوان باید حداقل ۲۰ کاراکتر باشد',
            },
          }}
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <Label className="text-xs" htmlFor="title">
                عنوان ایده
              </Label>
              <Input {...field} id="title" type="text" placeholder="عنوان ایدتو به صورت خلاصه بنویس" className="h-12 mt-2" />
              {fieldState.error && <p className="text-xs text-red-500">{fieldState.error.message}</p>}
            </div>
          )}
        />
        <div className="flex flex-col md:flex-row gap-10 md:gap-6">
          <Controller
            name="domain"
            control={control}
            rules={{ required: 'حوزه اصلی الزامی است' }}
            render={({ field, fieldState }) => (
              <div className="w-full flex flex-col gap-1">
                <Label className="mb-2 text-xs">حوزه‌های ایدت میتونه تو مطرح کردنش بهتر کمکت کنه</Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button type="button" variant="outline" role="combobox" aria-expanded={open} className="w-full h-12 justify-between">
                      {field.value ? DOMAINS.find((d) => d.key === field.value)?.value : 'یک حوزه انتخاب کن'}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-0">
                    <Command className="w-full">
                      <CommandInput placeholder="پیدا کردن حوزه‌ها..." className="h-10" />

                      <CommandList className="max-h-80 overflow-y-auto scrollbar-system">
                        <CommandEmpty>موردی پیدا نشد.</CommandEmpty>

                        <CommandGroup className="p-1">
                          {DOMAINS.map((domain) => (
                            <CommandItem
                              key={domain.key}
                              value={domain.value}
                              onSelect={() => {
                                field.onChange(domain.key);
                                setOpen(false);
                              }}
                            >
                              {domain.value}
                              <Check className={cn('ml-auto', field.value === domain.key ? 'opacity-100' : 'opacity-0')} />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {fieldState.error && <p className="text-xs text-destructive">{fieldState.error.message}</p>}
              </div>
            )}
          />
          <Controller
            name="commentsVisibility"
            control={control}
            rules={{ required: 'حوزه اصلی الزامی است' }}
            render={({ field, fieldState }) => (
              <div className="w-full flex flex-col gap-3 ">
                <Label className="text-xs">نمایش نظرات</Label>
                <Select dir="rtl" value={field.value === true ? 'PUBLIC' : 'PRIVATE'} onValueChange={(value) => field.onChange(value === 'PUBLIC' ? true : false)}>
                  <SelectTrigger className="w-full h-12">
                    <SelectValue placeholder="انتخاب نوع نمایش نظرات کاربران" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="POBLIC">نمایش نظرات به صورت عمومی</SelectItem>
                      <SelectItem value="PRIVATE">نمایش نظرات به صورت خصوصی</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {fieldState.error && <p className="text-xs text-destructive">{fieldState.error.message}</p>}
              </div>
            )}
          />
        </div>
        <Button onClick={() => setActiveTab('description')} className="h-12 w-full md:w-32 text-foreground">
          بخش بعدی
        </Button>
      </div>
    </section>
  );
}
