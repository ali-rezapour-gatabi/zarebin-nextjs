'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/store/app';
import { useUserStore } from '@/store/user';
import { SendOtp } from '@/app/apis/actions/authentication/send-code';
import { SignInWithOtp } from '@/app/apis/actions/authentication/verify-code';
import { setAccessToken } from '@/lib/auth-token';

type FormValues = {
  phone: string;
  code: string;
  firstName: string;
  lastName: string;
};

const OTP_DURATION = 120;

export function SignInDrawer() {
  const { hasAuth, setHasAuth, isSignInDrawerOpen, setSignInDrawerOpen } = useAppStore();
  const { setProfile } = useUserStore();
  const [otpSent, setOtpSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(OTP_DURATION);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, reset } = useForm<FormValues>({
    defaultValues: { phone: '', code: '', firstName: '', lastName: '' },
  });

  useEffect(() => {
    if (hasAuth && isSignInDrawerOpen) {
      setSignInDrawerOpen(false);
    }
  }, [hasAuth, isSignInDrawerOpen, setSignInDrawerOpen]);

  useEffect(() => {
    if (!otpSent) return;

    setTimeLeft(OTP_DURATION);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setOtpSent(false);
          return OTP_DURATION;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [otpSent]);

  useEffect(() => {
    if (!isSignInDrawerOpen) {
      setOtpSent(false);
      setTimeLeft(OTP_DURATION);
      reset();
    }
  }, [isSignInDrawerOpen, reset]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const sendCodeHandler = async () => {
    const phone = watch('phone');
    const firstName = watch('firstName');
    const lastName = watch('lastName');
    if (phone.length !== 11) return;
    if (firstName.length === 0) return toast.error('لطفا نام را وارد کنید');
    if (lastName.length === 0) return toast.error('لطفا نام خانوادگی را وارد کنید');

    try {
      setLoading(true);
      const res = await SendOtp(phone);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success('کد تایید ارسال شد');
      setOtpSent(true);
    } catch {
      toast.success('خطا در ارسال کد لطفا مجدد تلاش کنید');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    if (!otpSent) return;

    const res = await SignInWithOtp({ phoneNumber: values.phone, code: values.code, firstName: values.firstName, lastName: values.lastName });
    if (!res.success) return toast.error(res.message);
    setAccessToken(res.access);
    setProfile({
      email: res.data.email,
      firstName: res.data.first_name,
      lastName: res.data.last_name,
      phoneNumber: res.data.phone_number,
      avatar: res.data.avatar,
    });
    setHasAuth(true);
    setSignInDrawerOpen(false);
  };

  if (hasAuth) return null;

  return (
    <Drawer open={isSignInDrawerOpen} onOpenChange={setSignInDrawerOpen}>
      <DrawerContent className="px-4 pb-6 pt-2 h-max">
        <div className="mx-auto w-full max-w-[420px]">
          <DrawerHeader className="items-center text-center">
            <div className="flex items-center justify-center gap-3">
              <DrawerTitle className="text-2xl">ادامه مسیر ذره بین</DrawerTitle>
              <span className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent-foreground text-primary-foreground">
                <MessageCircle className="size-5" />
              </span>
            </div>
            <DrawerDescription className="text-sm text-primary/80">حفظ اطلاعات و حریم خصوصی شما اولیت ماست</DrawerDescription>
          </DrawerHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
            <Input {...register('phone')} placeholder="شماره تلفن" className="h-14 text-[14px] text-center" disabled={otpSent} />
            <Input {...register('firstName')} placeholder="نام خود را وارد کنید" className="h-14 text-[14px] text-center" disabled={otpSent} />
            <Input {...register('lastName')} placeholder="نام خانوادگی خود را وارد کنید" className="h-14 text-[14px] text-center" disabled={otpSent} />

            <AnimatePresence>
              {otpSent && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center border rounded-md"
                >
                  <Input
                    {...register('code')}
                    placeholder="کد تایید"
                    className="h-14 border-none shadow-none outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 text-center"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {!otpSent ? (
              <Button type="button" onClick={sendCodeHandler} disabled={watch('phone').length < 10 || loading} className="h-12">
                ارسال کد تایید
              </Button>
            ) : (
              <>
                <Button type="submit" className="h-12">
                  تایید کد
                </Button>

                <Button type="button" variant="ghost" onClick={sendCodeHandler} disabled={timeLeft > 0} className="text-sm">
                  در ارسال مجدد کد {formatTime(timeLeft)}
                </Button>
              </>
            )}
          </form>
          <p className="text-xs text-muted-foreground mt-5 text-center">ورود شما به منزله تایید قوانین و مقررات می‌باشد</p>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
