'use client';

import Link from 'next/link';
import { useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, LogIn, LogOut, MessageCircle } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/app';
import { useUserStore } from '@/store/user';
import { logoutAction } from '@/app/apis/actions/logout';
import { toast } from 'sonner';
import { getUserAction } from '@/app/apis/actions/get-user';
import { User2 } from 'lucide-react';
import { clearAccessToken } from '@/lib/auth-token';

export function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const hasAuth = useAppStore((state) => state.hasAuth);
  const setSignInDrawerOpen = useAppStore((state) => state.setSignInDrawerOpen);
  const setHasAuth = useAppStore((state) => state.setHasAuth);
  const { profile, setExpert, setProfile } = useUserStore();

  useEffect(() => {
    if (typeof document === 'undefined') return;
  }, [pathname]);

  useEffect(() => {
    if (hasAuth && !profile) {
      getUserAction();
    }
  }, [hasAuth, profile]);

  const userInitials = useMemo(() => {
    if (!profile?.firstName) return 'شما';
    return profile.firstName + ' ' + profile.lastName;
  }, [profile?.firstName, profile?.lastName]);

  const handleSignOut = async () => {
    const res = await logoutAction();
    if (!res.success) return toast.error(res.message);
    setProfile(null);
    setExpert(null);
    setHasAuth(false);
    clearAccessToken();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-10 via-card/95 to-background/90 backdrop-blur-xl transition-[padding-right] duration-300 ease-in-out">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-8 lg:px-10" dir="rtl">
        <div className="flex flex-1 items-center gap-3">
          <Link href="/" className={'group items-center gap-3 rounded-2xl p-3 transition duration-200 flex'}>
            <span className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent-foreground text-primary-foreground">
              <MessageCircle className="size-6" />
            </span>
            <span className="leading-tight hidden md:block space-y-2">
              <p className="text-sm font-semibold">ذره بین</p>
              <p className="text-[11px] text-muted-foreground">همراه هوش و انسان برای راهنمایی سریع</p>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {hasAuth ? (
            <>
              <DropdownMenu dir="rtl">
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="rounded-full bg-card/70 px-0 pl-3">
                    <Avatar className="size-8 rounded-full items-center justify-center">
                      {profile?.avatar ? (
                        <AvatarImage src={'/api/' + profile?.avatar} alt={userInitials} className="object-cover" />
                      ) : (
                        <User2 className="size-8 bg-primary/10 rounded-full p-1" />
                      )}
                    </Avatar>
                    <span className="hidden text-sm font-semibold sm:inline">{userInitials || 'کاربر'}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel className="flex items-center gap-3">
                    <Avatar className="size-9 rounded-xl border border-border/70 items-center justify-center">
                      {profile?.avatar ? (
                        <AvatarImage src={'/api/' + profile?.avatar} alt={userInitials} className="object-cover" />
                      ) : (
                        <User2 className="size-8 rounded-full p-1" />
                      )}
                    </Avatar>
                    <div className="space-y-0.5">
                      <p className="text-sm font-semibold">{userInitials || 'کاربر ذره بین'}</p>
                      <p className="text-xs text-muted-foreground">{profile!.phoneNumber}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                    <LayoutDashboard className="size-4" />
                    مدیریت حساب
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="size-4" />
                    خروج
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" className="rounded-full" onClick={() => setSignInDrawerOpen(true)}>
                <LogIn className="size-4" />
                <span className="mr-1">ورود</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
