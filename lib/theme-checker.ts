'use client';

import { useAppStore } from '@/store/app';
import { useEffect } from 'react';

export function ThemeChecker() {
  const theme = useAppStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return null;
}
