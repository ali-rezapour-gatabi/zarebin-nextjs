'use client';

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';
import expertUserAction from '@/app/apis/actions/expert-user';
import expertGetAction from '@/app/apis/actions/expert-get';
import {
  MAX_CONTACT_LINKS,
  MAX_CONTACT_NUMBERS,
  MAX_FILE_SIZE_BYTES,
  MAX_FILES,
  MAX_SAMPLE_ITEMS,
  ALLOWED_TYPES,
  MAX_FILE_SIZE_MB,
  defaultDomainOptions,
  defaultSubdomainOptions,
} from '@/constant/expert.constant';
import { DocumentValue, ExpertFormValues } from '@/type/expert';
import { useUserStore } from '@/store/user';

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

const normalizeUrl = (value: string) => {
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
};

const normalizePhone = (value: string) => {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  const normalized = value.trim().startsWith('+') ? digits : digits;
  if (normalized.length < 7 || normalized.length > 15) return '';
  return normalized;
};

const validateImageFile = (file: File): boolean => {
  if (!ALLOWED_TYPES.includes(file.type)) {
    toast.error(`فایل ${file.name} تصویر معتبر نیست. فقط PNG، JPEG و WEBP مجاز است.`);
    return false;
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    toast.error(`حجم فایل ${file.name} بیشتر از ${MAX_FILE_SIZE_MB} مگابایت است.`);
    return false;
  }
  return true;
};

export const useExpertForm = () => {
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
  }, [sampleInput, watchedSample, setValue]);

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
  }, [contactLinkInput, watchedContactLinks, setValue]);

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
  }, [contactNumberInput, watchedContactNumbers, setValue]);

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
    [getValues, setValue],
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

  return {
    control,
    errors,
    handleSubmit,
    onSubmit,
    isExpertSaving,
    loading,
    canSubmit,
    domainInput,
    setDomainInput,
    subdomainInput,
    setSubdomainInput,
    skillInput,
    setSkillInput,
    sampleInput,
    setSampleInput,
    contactLinkInput,
    setContactLinkInput,
    contactNumberInput,
    setContactNumberInput,
    mergedDomainOptions,
    mergedSubdomainOptions,
    watchedDomain,
    watchedSubdomains,
    watchedSkills,
    watchedDescription,
    watchedSample,
    watchedContactLinks,
    watchedContactNumbers,
    watchedDocuments,
    watchedProvince,
    watchedCity,
    watchedLocation,
    domainHint,
    locationHint,
    addDomainOption,
    addSubdomainOption,
    toggleOption,
    addSkill,
    removeSkill,
    addSampleJob,
    removeSampleJob,
    addContactLink,
    removeContactLink,
    addContactNumber,
    removeContactNumber,
    setValue,
    documentPreviews,
    handleAddDocuments,
    removeDocument,
    fileInputRef,
  };
};
