/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Hamburger, LayoutDashboard, LogIn, LogOut, MessageCircle } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/app';
import { useUserStore } from '@/store/user';
import { useSidebar } from '@/components/ui/sidebar';

export function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const hasAuth = useAppStore((state) => state.hasAuth);
  const setHasAuth = useAppStore((state) => state.setHasAuth);
  const { profile } = useUserStore();
  const { toggleSidebar, open, isMobile } = useSidebar();
  const [hasSidebar, setHasSidebar] = useState(false);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    setHasSidebar(Boolean(document.querySelector('[data-slot="sidebar-container"]')));
  }, [pathname]);

  const userInitials = useMemo(() => {
    if (!profile?.firstName) return 'شما';
    return profile.firstName + ' ' + profile.lastName;
  }, [profile?.firstName, profile?.lastName]);

  const handleSignOut = () => {
    setHasAuth(false);
    router.push('/sign-in');
  };

  const headerOffset = !hasSidebar || isMobile ? undefined : open ? 'var(--sidebar-width)' : 'var(--sidebar-width-icon)';
  const isDashboard = pathname.startsWith('/dashboard');
  const showHamburger = !isDashboard;
  const showLogo = isDashboard;

  return (
    <header className="sticky top-0 z-10 via-card/95 to-background/90 backdrop-blur-xl transition-[padding-right] duration-300 ease-in-out" style={{ paddingRight: headerOffset }}>
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-8 lg:px-10" dir="rtl">
        <div className="flex flex-1 items-center gap-3">
          {showHamburger && (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full border border-border/80 bg-card/80 shadow-xs md:hidden"
              onClick={toggleSidebar}
              aria-label="باز کردن منوی گفتگو"
            >
              <Hamburger className="size-5" />
            </Button>
          )}

          {showLogo && (
            <Link
              href="/"
              className="group flex items-center gap-3 rounded-2xl md:border border-border/70 px-3 py-2 shadow-xs transition duration-200 hover:-translate-y-0.5 hover:shadow-sm"
            >
              <span className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-primary to-chart-2 text-primary-foreground shadow">
                <MessageCircle className="size-5" />
              </span>
              <span className="leading-tight hidden md:block">
                <p className="text-sm font-semibold">زاربین</p>
                <p className="text-[11px] text-muted-foreground">همراه هوش و انسان برای راهنمایی سریع</p>
              </span>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {hasAuth ? (
            <>
              <DropdownMenu dir="rtl">
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="rounded-full bg-card/70 px-0 pl-3">
                    <Avatar className="size-8 rounded-full">
                      <AvatarImage src={'/api/' + profile?.avatar || '/avatar.png'} alt={userInitials} className="object-cover" />
                      <AvatarFallback className="rounded-full bg-accent object-contain text-accent-foreground text-sm font-semibold">{userInitials}</AvatarFallback>
                    </Avatar>
                    <span className="hidden text-sm font-semibold sm:inline">{userInitials || 'کاربر'}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel className="flex items-center gap-3">
                    <Avatar className="size-9 rounded-xl border border-border/70">
                      <AvatarImage src={'/api/' + profile?.avatar} alt={userInitials} className="object-cover" />
                      <AvatarFallback className="rounded-xl bg-accent text-accent-foreground text-sm font-semibold">{userInitials}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-0.5">
                      <p className="text-sm font-semibold">{userInitials || 'کاربر زاربین'}</p>
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
              <Button variant="ghost" size="sm" className="rounded-full" onClick={() => router.push('/sign-in')}>
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
