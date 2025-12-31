'use client';

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Loader2, Plus, UploadCloud, X } from 'lucide-react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useShallow } from 'zustand/react/shallow';
import expertUserAction from '@/app/apis/actions/expert-user';
import expertGetAction from '@/app/apis/actions/expert-get';
import {
  MAX_CONTACT_LINKS,
  MAX_CONTACT_NUMBERS,
  MAX_FILE_SIZE_BYTES,
  MAX_FILES,
  MAX_SAMPLE_ITEMS,
  IRAN_PROVINCES,
  ALLOWED_TYPES,
  MAX_FILE_SIZE_MB,
  defaultDomainOptions,
  defaultSubdomainOptions,
  EXPERIENCE_OPTIONS,
} from '@/constant/expert.constant';
import { DocumentValue, ExpertFormValues } from '@/type/expert';
import { ExperienceLevel, useUserStore } from '@/store/user';
import { Spinner } from '../ui/spinner';

const buildLocationLabel = (province?: string, city?: string) => {
  const trimmedProvince = province?.trim() ?? '';
  const trimmedCity = city?.trim() ?? '';
  if (trimmedProvince && trimmedCity) {
    return `${trimmedProvince} / ${trimmedCity}`;
  }
  if (trimmedProvince) return trimmedProvince;
  if (trimmedCity) return trimmedCity;
  return '';
};

const getLocationDefaults = (expert?: { province?: string; city?: string; location?: string } | null) => {
  const fallbackParts = (expert?.location ?? '').split('/').map((part) => part.trim());
  return {
    province: expert?.province ?? fallbackParts[0] ?? '',
    city: expert?.city ?? fallbackParts[1] ?? '',
  };
};

export const ExpertForm = () => {
  const [customDomainOptions, setCustomDomainOptions] = useState<string[]>([]);
  const [customSubdomainOptions, setCustomSubdomainOptions] = useState<string[]>([]);
  const [domainInput, setDomainInput] = useState('');
  const [subdomainInput, setSubdomainInput] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [sampleInput, setSampleInput] = useState('');
  const [contactLinkInput, setContactLinkInput] = useState('');
  const [contactNumberInput, setContactNumberInput] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { expert, isExpertSaving, setExpert } = useUserStore(
    useShallow((state) => ({
      expert: state.expert,
      isExpertSaving: state.isExpertSaving,
      setExpert: state.setExpert,
    })),
  );

  useEffect(() => {
    async function getExpert() {
      const response = await expertGetAction();
      if (!response.success) {
        toast.error(response.message);
        return;
      }
      setExpert(response.data);
    }
    getExpert();
  }, [setExpert]);

  const locationDefaults = useMemo(() => getLocationDefaults(expert), [expert]);

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    getValues,
    formState: { errors, isDirty },
  } = useForm<ExpertFormValues>({
    defaultValues: {
      domains: expert?.domains ?? '',
      subdomains: expert?.subdomains ?? [],
      skills: expert?.skills ?? [],
      sampleJob: expert?.sampleJob ?? [],
      contactLinks: expert?.contactLinks ?? [],
      contactNumbers: expert?.contactNumbers ?? [],
      province: locationDefaults.province,
      city: locationDefaults.city,
      location: buildLocationLabel(locationDefaults.province, locationDefaults.city) || expert?.location || '',
      yearsOfExperience: expert?.yearsOfExperience || undefined,
      availability: expert?.availability ?? '',
      description: expert?.description ?? '',
      documents: expert?.documents ?? [],
    },
  });

  const watchedDomain = useWatch({ control, name: 'domains' });
  const watchedSubdomains = useWatch({ control, name: 'subdomains' });
  const watchedSkills = useWatch({ control, name: 'skills' });
  const watchedDescription = useWatch({ control, name: 'description' });
  const watchedSample = useWatch({ control, name: 'sampleJob' });
  const watchedContactLinks = useWatch({ control, name: 'contactLinks' });
  const watchedContactNumbers = useWatch({ control, name: 'contactNumbers' });
  const watchedDocuments = useWatch({ control, name: 'documents' });
  const watchedProvince = useWatch({ control, name: 'province' });
  const watchedCity = useWatch({ control, name: 'city' });
  const watchedLocation = useWatch({ control, name: 'location' });
  const hasNewDocuments = useMemo(() => (watchedDocuments || []).some((doc: DocumentValue) => doc instanceof File), [watchedDocuments]);
  const locationPreview = useMemo(() => buildLocationLabel(watchedProvince, watchedCity), [watchedProvince, watchedCity]);
  const locationHint = locationPreview ? `موقعیت انتخاب شده: ${locationPreview}` : 'مثلاً: مازندران / بابل';
  const mergedDomainOptions = useMemo(
    () => Array.from(new Set([...defaultDomainOptions, ...(expert?.domains ? [expert.domains] : []), ...customDomainOptions])),
    [customDomainOptions, expert],
  );
  const mergedSubdomainOptions = useMemo(
    () => Array.from(new Set([...defaultSubdomainOptions, ...(expert?.subdomains ?? []), ...customSubdomainOptions])),
    [customSubdomainOptions, expert],
  );
  const autoLocationRef = useRef('');

  useEffect(() => {
    reset({
      domains: expert?.domains ?? '',
      subdomains: expert?.subdomains ?? [],
      skills: expert?.skills ?? [],
      sampleJob: expert?.sampleJob ?? [],
      contactLinks: expert?.contactLinks ?? [],
      contactNumbers: expert?.contactNumbers ?? [],
      province: locationDefaults.province,
      city: locationDefaults.city,
      location: buildLocationLabel(locationDefaults.province, locationDefaults.city) || expert?.location || '',
      yearsOfExperience: expert?.yearsOfExperience,
      availability: expert?.availability ?? '',
      description: expert?.description ?? '',
      documents: expert?.documents ?? [],
    });
    autoLocationRef.current = buildLocationLabel(locationDefaults.province, locationDefaults.city) || expert?.location || '';
  }, [expert, reset, locationDefaults]);

  useEffect(() => {
    const combined = buildLocationLabel(watchedProvince, watchedCity);
    if (!combined) return;
    if (!watchedLocation || watchedLocation === autoLocationRef.current) {
      setValue('location', combined, { shouldDirty: false, shouldValidate: true });
      autoLocationRef.current = combined;
    }
  }, [watchedCity, watchedProvince, watchedLocation, setValue]);

  const normalizeUrl = useCallback((value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return '';
    const candidate = trimmed.startsWith('http://') || trimmed.startsWith('https://') ? trimmed : `https://${trimmed}`;
    try {
      const parsed = new URL(candidate);
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        return parsed.toString();
      }
      return '';
    } catch {
      return '';
    }
  }, []);

  const normalizePhone = useCallback((value: string) => {
    const digits = value.replace(/\D/g, '');
    if (!digits) return '';
    const normalized = value.trim().startsWith('+') ? digits : digits;
    if (normalized.length < 7 || normalized.length > 15) return '';
    return normalized;
  }, []);

  const validateImageFile = useCallback((file: File): boolean => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error(`فایل ${file.name} تصویر معتبر نیست. فقط PNG، JPEG و WEBP مجاز است.`);
      return false;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error(`حجم فایل ${file.name} بیشتر از ${MAX_FILE_SIZE_MB} مگابایت است.`);
      return false;
    }
    return true;
  }, []);

  const removeDocument = useCallback(
    (index: number) => {
      const existing = getValues('documents') ?? [];
      const nextDocuments = existing.filter((_: DocumentValue, i: number) => i !== index);
      setValue('documents', nextDocuments, { shouldDirty: true, shouldValidate: true });
    },
    [getValues, setValue],
  );

  const toggleOption = useCallback(
    (key: 'subdomains', value: string) => {
      const current = getValues(key) || [];
      const exists = current.includes(value);
      const updated = exists ? current.filter((item: string) => item !== value) : [...current, value];
      setValue(key, updated, { shouldDirty: true, shouldValidate: true });
    },
    [getValues, setValue],
  );

  const addDomainOption = useCallback(() => {
    const trimmed = domainInput.trim();
    if (!trimmed) return;
    if (!mergedDomainOptions.includes(trimmed)) {
      setCustomDomainOptions((prev) => [...prev, trimmed]);
    }
    setDomainInput('');
    setValue('domains', trimmed, { shouldDirty: true, shouldValidate: true });
  }, [domainInput, mergedDomainOptions, setValue]);

  const addSubdomainOption = useCallback(() => {
    const trimmed = subdomainInput.trim();
    if (!trimmed) return;
    if (!mergedSubdomainOptions.includes(trimmed)) {
      setCustomSubdomainOptions((prev) => [...prev, trimmed]);
    }
    setSubdomainInput('');
    toggleOption('subdomains', trimmed);
  }, [mergedSubdomainOptions, subdomainInput, toggleOption]);

  const addSkill = useCallback(() => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    const nextSkills = Array.from(new Set([...(watchedSkills || []), trimmed]));
    setValue('skills', nextSkills, { shouldDirty: true, shouldValidate: true });
    setSkillInput('');
  }, [skillInput, watchedSkills, setValue]);

  const removeSkill = useCallback(
    (skill: string) => {
      const filtered = (watchedSkills || []).filter((item: string) => item !== skill);
      setValue('skills', filtered, { shouldDirty: true, shouldValidate: true });
    },
    [watchedSkills, setValue],
  );

  const addSampleJob = useCallback(() => {
    const normalized = normalizeUrl(sampleInput);
    if (!normalized) {
      toast.error('لینک نمونه کار معتبر وارد کنید');
      return;
    }

    const current = watchedSample || [];
    if (current.includes(normalized)) {
      toast.info('این لینک نمونه کار قبلاً ثبت شده است');
      setSampleInput('');
      return;
    }

    if (current.length >= MAX_SAMPLE_ITEMS) {
      toast.error(`حداکثر ${MAX_SAMPLE_ITEMS} نمونه کار مجاز است`);
      return;
    }

    const nextSampleJobs = [...current, normalized];
    setValue('sampleJob', nextSampleJobs, { shouldDirty: true, shouldValidate: true });
    setSampleInput('');
  }, [normalizeUrl, sampleInput, watchedSample, setValue]);

  const removeSampleJob = useCallback(
    (link: string) => {
      const filtered = (watchedSample || []).filter((item: string) => item !== link);
      setValue('sampleJob', filtered, { shouldDirty: true, shouldValidate: true });
    },
    [watchedSample, setValue],
  );

  const addContactLink = useCallback(() => {
    const normalized = normalizeUrl(contactLinkInput);
    if (!normalized) {
      toast.error('لینک شبکه اجتماعی یا وب‌سایت معتبر وارد کنید');
      return;
    }

    const current = watchedContactLinks || [];
    if (current.includes(normalized)) {
      toast.info('این راه ارتباطی قبلاً اضافه شده است');
      setContactLinkInput('');
      return;
    }

    if (current.length >= MAX_CONTACT_LINKS) {
      toast.error(`حداکثر ${MAX_CONTACT_LINKS} مسیر ارتباطی مجاز است`);
      return;
    }

    const nextContacts = [...current, normalized];
    setValue('contactLinks', nextContacts, { shouldDirty: true, shouldValidate: true });
    setContactLinkInput('');
  }, [normalizeUrl, contactLinkInput, watchedContactLinks, setValue]);

  const removeContactLink = useCallback(
    (link: string) => {
      const filtered = (watchedContactLinks || []).filter((item: string) => item !== link);
      setValue('contactLinks', filtered, { shouldDirty: true, shouldValidate: true });
    },
    [watchedContactLinks, setValue],
  );

  const addContactNumber = useCallback(() => {
    const normalized = normalizePhone(contactNumberInput);
    if (!normalized) {
      toast.error('شماره تماس معتبر وارد کنید (۷ تا ۱۵ رقم)');
      return;
    }

    const current = watchedContactNumbers || [];
    if (current.includes(normalized)) {
      toast.info('این شماره قبلاً اضافه شده است');
      setContactNumberInput('');
      return;
    }

    if (current.length >= MAX_CONTACT_NUMBERS) {
      toast.error(`حداکثر ${MAX_CONTACT_NUMBERS} شماره مجاز است`);
      return;
    }

    const next = [...current, normalized];
    setValue('contactNumbers', next, { shouldDirty: true, shouldValidate: true });
    setContactNumberInput('');
  }, [normalizePhone, contactNumberInput, watchedContactNumbers, setValue]);

  const removeContactNumber = useCallback(
    (phone: string) => {
      const filtered = (watchedContactNumbers || []).filter((item: string) => item !== phone);
      setValue('contactNumbers', filtered, { shouldDirty: true, shouldValidate: true });
    },
    [watchedContactNumbers, setValue],
  );

  const handleAddDocuments = useCallback(
    (files?: FileList) => {
      if (!files) return;

      const validFiles = Array.from(files).filter((file): file is File => validateImageFile(file));

      if (validFiles.length === 0) return;

      const existing = getValues('documents') ?? [];
      const availableSlots = MAX_FILES - existing.length;

      if (availableSlots <= 0) {
        toast.error(`حداکثر ${MAX_FILES} تصویر مجاز است`);
        return;
      }

      const filesToAdd = validFiles.slice(0, availableSlots);
      if (validFiles.length > availableSlots) {
        toast.warning(`فقط ${availableSlots} تصویر اضافه شد. حداکثر ${MAX_FILES} تصویر مجاز است.`);
      }

      setValue('documents', [...existing, ...filesToAdd], { shouldDirty: true, shouldValidate: true });

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [getValues, setValue, validateImageFile],
  );

  const onSubmit = async (values: ExpertFormValues) => {
    setLoading(true);
    const formData = new FormData();

    const appendArrayField = (key: string, list: (string | undefined | null)[]) => {
      list.filter((item): item is string => typeof item === 'string' && item.trim().length > 0).forEach((item) => formData.append(`${key}[]`, item.trim()));
    };

    formData.append('domains', values.domains);
    appendArrayField('subdomains', values.subdomains ?? []);
    appendArrayField('skills', values.skills ?? []);
    appendArrayField('sampleJob', values.sampleJob ?? []);
    appendArrayField('contactLinks', values.contactLinks ?? []);
    appendArrayField('contactNumbers', values.contactNumbers ?? []);
    const normalizedProvince = values.province?.trim();
    const normalizedCity = values.city?.trim();

    if (!normalizedProvince || !normalizedCity) {
      toast.error('استان و شهر را مشخص کنید');
      return;
    }

    const normalizedLocation = values.location?.trim() || buildLocationLabel(normalizedProvince, normalizedCity);
    if (!normalizedLocation) {
      toast.error('عبارت مکان معتبر نیست');
      return;
    }

    formData.append('province', normalizedProvince);
    formData.append('city', normalizedCity);
    formData.append('location', normalizedLocation);
    formData.append('yearsOfExperience', values.yearsOfExperience || '');
    formData.append('availability', values.availability);
    formData.append('description', values.description);

    values.documents?.forEach((item: DocumentValue) => {
      if (item instanceof File) {
        formData.append('documents', item);
      }

      if (typeof item === 'string') {
        formData.append('documents', item);
      }
    });

    if ((!values.contactNumbers || values.contactNumbers.length === 0) && (!values.contactLinks || values.contactLinks.length === 0)) {
      toast.error('حداقل یک راه ارتباطی وارد کنید');
      return;
    }

    try {
      const response = await expertUserAction(formData);
      if (!response.success) {
        toast.error(response.message);
        return;
      }

      toast.success('اطلاعات تخصصی ذخیره شد');
      window.location.reload();
    } catch {
      toast.error('ذخیره اطلاعات متخصص با خطا مواجه شد');
    } finally {
      setLoading(false);
    }
  };

  const domainHint = useMemo(() => {
    if (!watchedDomain?.trim()) return 'یک حوزه اصلی انتخاب کنید.';
    return `انتخاب شده: ${watchedDomain}`;
  }, [watchedDomain]);

  const documentPreviews = useMemo<{ src: string; revoke?: () => void }[]>(
    () =>
      (watchedDocuments ?? []).map((doc: DocumentValue) => {
        if (typeof doc === 'string') {
          return { src: 'api' + doc, revoke: undefined as (() => void) | undefined };
        }
        const url = URL.createObjectURL(doc);
        return { src: url, revoke: () => URL.revokeObjectURL(url) };
      }),
    [watchedDocuments],
  );

  useEffect(() => {
    return () => {
      documentPreviews.forEach((item) => item.revoke?.());
    };
  }, [documentPreviews]);

  const canSubmit = (isDirty || hasNewDocuments) && !isExpertSaving && !loading;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" dir="rtl">
      <Card className="shadow-xs">
        <CardHeader className="gap-2">
          <CardTitle>اطلاعات تخصصی</CardTitle>
          <CardDescription>حوزه‌های کاری، مهارت‌ها و ... خود را مدیریت کنید.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
          </div>

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

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr,1.05fr]">
            <div className="space-y-4 rounded-xl border border-border/60 bg-card/60 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">مهارت‌ها</p>
                <span className="text-xs text-muted-foreground">افزودن با Enter</span>
              </div>
              <Controller name="skills" control={control} rules={{ validate: (value) => (value && value.length > 0) || 'حداقل یک مهارت لازم است' }} render={() => <></>} />
              <div className="flex items-center gap-2">
                <Input
                  placeholder="مثلاً: React, API Design"
                  value={skillInput}
                  className="h-14"
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  disabled={isExpertSaving}
                  aria-invalid={Boolean(errors.skills)}
                />
                <Button type="button" size="icon" variant="secondary" className="rounded-xl h-14 w-14 border border-2" onClick={addSkill} disabled={isExpertSaving}>
                  <Plus className="size-6" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(watchedSkills || []).map((skill: string) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="bg-accent text-accent-foreground/90 hover:text-accent-foreground flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold transition-colors"
                    disabled={isExpertSaving}
                  >
                    {skill}
                    <X className="size-3" />
                  </button>
                ))}
                {errors.skills && <p className="text-xs text-destructive">{errors.skills.message}</p>}
              </div>
            </div>
            <div className="space-y-4">
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

              <div className="space-y-4 rounded-xl border border-border/60 bg-card/60 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">راه‌های ارتباطی</p>
                  <span className="text-xs text-muted-foreground">وب‌سایت شخصی، شبکه اجتماعی یا شماره ثابت/دفتر</span>
                </div>
                <Controller
                  name="contactNumbers"
                  control={control}
                  rules={{
                    validate: (value) => {
                      const count = value?.length ?? 0;
                      return count <= MAX_CONTACT_NUMBERS || `حداکثر ${MAX_CONTACT_NUMBERS} شماره مجاز است`;
                    },
                  }}
                  render={() => <></>}
                />
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="شماره ثابت/دفتر یا همراه دوم (مثلاً 02188887777 یا 0989121234567)"
                    value={contactNumberInput}
                    className="h-14"
                    onChange={(e) => setContactNumberInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        addContactNumber();
                      }
                    }}
                    disabled={isExpertSaving}
                    aria-invalid={Boolean(errors.contactNumbers)}
                  />
                  <Button type="button" size="icon" variant="secondary" className="rounded-xl h-14 w-14 border border-2" onClick={addContactNumber} disabled={isExpertSaving}>
                    <Plus className="size-6" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(watchedContactNumbers || []).map((phone: string) => (
                    <button
                      key={phone}
                      type="button"
                      onClick={() => removeContactNumber(phone)}
                      className="bg-secondary text-secondary-foreground hover:text-secondary-foreground/80 flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold transition-colors"
                      disabled={isExpertSaving}
                    >
                      {phone}
                      <X className="size-3" />
                    </button>
                  ))}
                </div>
                {errors.contactNumbers && <p className="text-xs text-destructive">{errors.contactNumbers.message}</p>}

                <Controller
                  name="contactLinks"
                  control={control}
                  rules={{
                    validate: (value) => {
                      const count = value?.length ?? 0;
                      return count <= MAX_CONTACT_LINKS || `حداکثر ${MAX_CONTACT_LINKS} لینک مجاز است`;
                    },
                  }}
                  render={() => <></>}
                />
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="https://linkedin.com/in/username یا https://yourdomain.com"
                    value={contactLinkInput}
                    className="h-14"
                    onChange={(e) => setContactLinkInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        addContactLink();
                      }
                    }}
                    disabled={isExpertSaving}
                    aria-invalid={Boolean(errors.contactLinks)}
                  />
                  <Button type="button" size="icon" variant="secondary" className="rounded-xl h-14 w-14 border border-2" onClick={addContactLink} disabled={isExpertSaving}>
                    <Plus className="size-6" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(watchedContactLinks || []).map((link: string) => (
                    <button
                      key={link}
                      type="button"
                      onClick={() => removeContactLink(link)}
                      className="bg-accent text-accent-foreground/90 hover:text-accent-foreground flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold transition-colors"
                      disabled={isExpertSaving}
                    >
                      {link}
                      <X className="size-3" />
                    </button>
                  ))}
                  {!watchedContactLinks?.length && !watchedContactNumbers?.length && (
                    <span className="text-xs text-muted-foreground">مثلاً لینک وب‌سایت، لینکدین، اینستاگرام، گیت‌هاب یا شماره تماس دفتر</span>
                  )}
                </div>
                {errors.contactLinks && <p className="text-xs text-destructive">{errors.contactLinks.message}</p>}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 rounded-xl border border-border/60 bg-card/60 p-4 sm:grid-cols-2">
            <div className="flex flex-col gap-4">
              <Label htmlFor="yearsOfExperience">سال‌های تجربه</Label>

              <Controller
                control={control}
                name="yearsOfExperience"
                defaultValue={expert?.yearsOfExperience}
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

            <input type="file" ref={fileInputRef} hidden multiple accept="image/png,image/jpeg,image/webp" onChange={(e) => handleAddDocuments(e.target.files ?? undefined)} />
          </div>

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
        </CardContent>
        <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
        </CardFooter>
      </Card>
    </form>
  );
};
