import type { Metadata } from 'next';
import './globals.css';
import { LayoutWrapper } from '@/components/layout-wrapper';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ThemeChecker } from '@/lib/theme-checker';

export const metadata: Metadata = {
  title: 'Chat UI',
  description: 'A polished ChatGPT-like interface built with Next.js',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className={` min-h-screen antialiased bg-background text-foreground`}>
        <ThemeChecker />
        <SidebarProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </SidebarProvider>
      </body>
    </html>
  );
}
