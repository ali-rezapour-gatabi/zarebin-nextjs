'use client';

import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const path = usePathname();
  const router = useRouter();

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
                <Button variant={path === '/dashboard' ? 'secondary' : 'ghost'} size="sm" className="rounded-full px-4" onClick={() => router.push('/dashboard')}>
                  کاربر
                </Button>
                <Button
                  variant={path === '/dashboard/notification' ? 'default' : 'ghost'}
                  size="sm"
                  className="rounded-full px-4"
                  onClick={() => router.push('/dashboard/notification')}
                >
                  اعلانات
                </Button>
                <Button variant={path === '/dashboard/contents' ? 'default' : 'ghost'} size="sm" className="rounded-full px-4" onClick={() => router.push('/dashboard/contents')}>
                  محتوا
                </Button>
              </div>
            </div>
          </div>
        </header>

        {children}
      </div>
    </section>
  );
}
