'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateUserAction } from '@/app/actions/update-user';
import { useUserStore } from '@/store/user';
import { useShallow } from 'zustand/react/shallow';
import type { ProfileData } from '@/store/user';

type ProfileFormValues = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  avatar?: FileList;
  nationalId: string;
};

export function ProfileForm() {
  const { profile, setProfile } = useUserStore(
    useShallow((state) => ({
      profile: state.profile,
      setProfile: state.setProfile,
    })),
  );

  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar ?? '');
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      firstName: profile?.firstName,
      lastName: profile?.lastName,
      phone: profile?.phoneNumber,
      email: profile?.email,
      nationalId: profile?.nationalId,
    },
  });

  useEffect(() => {
    reset({
      firstName: profile?.firstName,
      lastName: profile?.lastName,
      phone: profile?.phoneNumber,
      email: profile?.email,
      nationalId: profile?.nationalId,
    });
    setAvatarPreview(profile?.avatar ?? '');
  }, [profile, reset]);

  const avatarFile = watch('avatar');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarRegister = register('avatar');
  const currentName = watch('firstName') || profile?.firstName;

  useEffect(() => {
    if (avatarFile && avatarFile.length > 0) {
      const file = avatarFile[0];
      const objectUrl = URL.createObjectURL(file);
      setAvatarPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [avatarFile]);

  const initials = useMemo(() => {
    if (!currentName) return 'کاربر';
    const parts = currentName.trim().split(' ').filter(Boolean);
    return parts
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }, [currentName]);

  const onSubmit = (values: ProfileFormValues) => {
    const formData = new FormData();
    formData.append('firstName', values.firstName);
    formData.append('lastName', values.lastName);
    formData.append('phone', values.phone);
    formData.append('email', values.email);
    formData.append('nationalId', values.nationalId);
    if (values.avatar?.[0]) {
      formData.append('avatar', values.avatar[0]);
    }

    setIsSaving(true);

    updateUserAction(formData)
      .then((result) => {
        if (!result.success) {
          toast.error(result.message ?? 'خطا در ارتباط با سرور');
          return;
        }

        const incomingProfile = (result.data ?? null) as Partial<ProfileData> | null;
        const nextProfile: ProfileData | null =
          profile || incomingProfile
            ? {
                firstName: incomingProfile?.firstName ?? values.firstName ?? profile?.firstName ?? '',
                lastName: incomingProfile?.lastName ?? values.lastName ?? profile?.lastName ?? '',
                phoneNumber: incomingProfile?.phoneNumber ?? profile?.phoneNumber ?? values.phone,
                email: incomingProfile?.email ?? values.email ?? profile?.email ?? '',
                avatar: incomingProfile?.avatar ?? profile?.avatar,
                nationalId: incomingProfile?.nationalId ?? values.nationalId ?? profile?.nationalId ?? '',
              }
            : null;

        if (nextProfile) {
          setProfile(nextProfile);
          setAvatarPreview((prev) => nextProfile.avatar ?? prev);
          reset({
            firstName: nextProfile.firstName,
            lastName: nextProfile.lastName,
            phone: nextProfile.phoneNumber,
            email: nextProfile.email,
            nationalId: nextProfile.nationalId,
            avatar: undefined,
          });
        } else {
          reset({
            ...values,
            avatar: undefined,
          });
        }

        toast.success(result.message ?? 'اطلاعات با موفقیت ذخیره شد');
      })
      .catch(() => {
        toast.error('خطا در ارتباط با سرور');
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  return (
    <form className="space-y-0" onSubmit={handleSubmit(onSubmit)} dir="rtl">
      <Card className="shadow-xs">
        <CardHeader className="gap-2">
          <CardTitle>اطلاعات عمومی</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-xl border border-border/60 bg-muted/40 p-4">
            <div className="flex items-center gap-3">
              <Avatar className="size-20 rounded-xl ring-2 ring-offset-2 ring-primary/20 ring-offset-background cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <AvatarImage src={'api/' + avatarPreview} alt={currentName} className="object-cover" />
                <AvatarFallback className="rounded-xl bg-accent text-accent-foreground text-lg font-semibold">{initials}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-semibold">تصویر پروفایل</p>
                <p className="text-xs text-muted-foreground">حداکثر ۳ مگابایت | فرمت PNG یا JPG</p>
              </div>
            </div>
            <Input
              id="avatar"
              type="file"
              accept="image/*"
              aria-invalid={Boolean(errors.avatar)}
              disabled={isSaving}
              className="hidden"
              {...avatarRegister}
              ref={(element) => {
                avatarRegister.ref(element);
                fileInputRef.current = element;
              }}
            />
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr,320px]">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">نام</Label>
                  <Input
                    id="firstName"
                    placeholder="مثلاً: آرمان"
                    aria-invalid={Boolean(errors.firstName)}
                    disabled={isSaving}
                    className="h-14"
                    {...register('firstName', { required: 'نام الزامی است', minLength: { value: 3, message: 'حداقل ۳ کاراکتر وارد کنید' } })}
                  />
                  {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">نام خانوادگی</Label>
                  <Input
                    id="lastName"
                    placeholder="مثلاً: رضایی"
                    aria-invalid={Boolean(errors.lastName)}
                    className="h-14"
                    disabled={isSaving}
                    {...register('lastName', { required: 'نام الزامی است', minLength: { value: 3, message: 'حداقل ۳ کاراکتر وارد کنید' } })}
                  />
                  {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">شماره همراه</Label>
                  <Input id="phone" type="text" readOnly disabled className="cursor-not-allowed opacity-80 h-14" {...register('phone')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nationalId">کد ملی</Label>
                  <Input
                    id="nationalId"
                    type="text"
                    inputMode="numeric"
                    placeholder="کد ملی خود را وارد کنید"
                    className="h-14"
                    disabled={isSaving}
                    {...register('nationalId', {
                      pattern: {
                        value: /^[0-9]*$/,
                        message: 'فقط عدد مجاز است',
                      },
                      maxLength: {
                        value: 10,
                        message: 'کد ملی باید ۱۰ رقم باشد',
                      },
                      minLength: {
                        value: 10,
                        message: 'کد ملی باید ۱۰ رقم باشد',
                      },
                      onChange: (e) => {
                        e.target.value = e.target.value.replace(/\D/g, '');
                      },
                    })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">ایمیل</Label>
                <Input id="email" type="email" placeholder="ایمیل خود را وارد کنید" className="h-14" disabled={isSaving} {...register('email')} />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button type="submit" disabled={isSaving || (!isDirty && !avatarFile)} className="h-12">
            {isSaving && <Loader2 className="mr-2 size-4 animate-spin" />}
            ذخیره اطلاعات
          </Button>
          <div className="text-xs text-muted-foreground">تغییرات بعد از ذخیره در حساب شما اعمال می‌شود. شماره همراه به‌عنوان نام کاربری ثابت باقی می‌ماند.</div>
        </CardFooter>
      </Card>
    </form>
  );
}
