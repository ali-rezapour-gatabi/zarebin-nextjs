'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import { MessageCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/store/app';
import axios from 'axios';
import { useUserStore } from '@/store/user';

type FormValues = {
  phone: string;
  code: string;
  firstName: string;
  lastName: string;
};

const OTP_DURATION = 120;

export default function SignInPage() {
  const router = useRouter();
  const { hasAuth, setHasAuth } = useAppStore();
  const { setProfile } = useUserStore();
  const [otpSent, setOtpSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(OTP_DURATION);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: { phone: '', code: '', firstName: '', lastName: '' },
  });

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

    setLoading(true);
    const res = await axios.post('/apis/send-code', { phone });
    setLoading(false);

    if (!res.data.success) {
      toast.error(res.data.message);
      return;
    }

    toast.success('کد تایید ارسال شد');
    setOtpSent(true);
  };

  const onSubmit = async (values: FormValues) => {
    if (!otpSent) return;

    const res = await axios.post('/apis/sign-in', { phoneNumber: values.phone, code: values.code, firstName: values.firstName, lastName: values.lastName });
    if (!res.data.success) return toast.error(res.data.message);
    setProfile(res.data.data);
    setHasAuth(true);

    router.push('/');
  };

  if (hasAuth) {
    router.push('/');
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 mx-auto w-full">
      <div className="w-full max-w-[400px] items-center flex flex-col gap-3 text-center mb-4">
        <Button className="w-20 h-20 mx-auto rounded-xl bg-gradient-to-br from-primary to-chart-2" onClick={() => router.push('/')}>
          <MessageCircle className="size-12 text-white" />
        </Button>

        <h1 className="text-2xl font-bold">ورود به حساب کاربری</h1>
        <p className="text-sm text-muted-foreground">ورود شما به منزله تایید قوانین و مقررات می‌باشد</p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
          <Input {...register('phone')} placeholder="شماره تلفن" className="h-13 text-center" disabled={otpSent} />
          <Input {...register('firstName')} placeholder="نام خود را وارد کنید" className="h-13 text-center" disabled={otpSent} />
          <Input {...register('lastName')} placeholder="نام خانوادگی خود را وارد کنید" className="h-13 text-center" disabled={otpSent} />

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
      </div>
    </main>
  );
}
