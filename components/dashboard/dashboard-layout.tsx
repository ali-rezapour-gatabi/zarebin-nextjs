'use client';

import { useEffect } from 'react';
import { ShieldCheck, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/store/app';
import { useUserStore } from '@/store/user';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { role, setRole } = useUserStore();
  const theme = useAppStore((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <section className="flex-1 bg-background text-foreground" dir="rtl">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pb-10 pt-6 md:px-8 lg:px-10">
        <header className="flex flex-col gap-4 md:gap-6">
          <div className="flex gap-4 items-center justify-between">
            <div className="space-y-2">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold leading-tight tracking-tight md:text-3xl">پروفایل</h1>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-start">
              <div className="flex items-center gap-1 rounded-full border border-border/80 bg-card px-1 py-1 shadow-xs transition-colors">
                <Button variant={role === 'user' ? 'secondary' : 'ghost'} size="sm" className="rounded-full px-4" onClick={() => setRole('user')}>
                  کاربر
                </Button>
                <Button variant={role === 'expert' ? 'default' : 'ghost'} size="sm" className="rounded-full px-4" onClick={() => setRole('expert')}>
                  متخصص
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Card className="shadow-xs">
              <CardHeader className="flex flex-row items-start justify-between pb-3">
                <div className="space-y-1">
                  <CardTitle>نقش فعال</CardTitle>
                  <CardDescription>کنترل تجربه داشبورد بر اساس نقش</CardDescription>
                </div>
                <Users className="size-5 text-primary" />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span>اکنون</span>
                  <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">{role === 'expert' ? 'متخصص' : 'کاربر'}</span>
                </div>
                <p className="text-sm text-muted-foreground">تب تخصص تنها در حالت متخصص در دسترس است.</p>
              </CardContent>
            </Card>

            <Card className="shadow-xs">
              <CardHeader className="flex flex-row items-start justify-between pb-3">
                <div className="space-y-1">
                  <CardTitle>امنیت و مدارک</CardTitle>
                  <CardDescription>مدارک بارگذاری‌شده و وضعیت بررسی</CardDescription>
                </div>
                <ShieldCheck className="size-5 text-primary" />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span>تأیید شده</span>
                  <span className="text-primary">2 / 3</span>
                </div>
                <p className="text-sm text-muted-foreground">برای تسریع تأیید، فایل‌های جدید را در تب متخصص بارگذاری کنید.</p>
              </CardContent>
            </Card>
          </div>
        </header>

        {children}
      </div>
    </section>
  );
}
