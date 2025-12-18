'use client';

import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useAppStore } from '@/store/app';

export function ThemeToggle() {
  const theme = useAppStore((state) => state.theme);
  const toggleTheme = useAppStore((state) => state.toggleTheme);

  const isDark = theme === 'dark';

  return (
    <Button size="icon-sm" variant="ghost" aria-label="Toggle theme" onClick={toggleTheme}>
      {isDark ? <Sun className="size-6 text-amber-100" /> : <Moon className="size-6" />}
    </Button>
  );
}
