'use client';
import React, { useEffect } from 'react';
import { useAppStore } from '@/store/app';
import axios from 'axios';

import { Toaster } from '@/components/ui/sonner';
import { SiteHeader } from './site-header';
import { SignInDrawer } from '@/components/auth/sign-in-drawer';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { setHasAuth } = useAppStore();

  useEffect(() => {
    const checkAuth = async () => {
      const res = await axios.get('/apis/auth');
      setHasAuth(res.data.hasAuth);
    };

    checkAuth();
  }, [setHasAuth]);

  return (
    <main className="flex min-h-screen w-full flex-col">
      <SiteHeader />
      <SignInDrawer />
      <Toaster />
      <div className="flex w-full flex-1 flex-col md:flex-row">{children}</div>
    </main>
  );
}
