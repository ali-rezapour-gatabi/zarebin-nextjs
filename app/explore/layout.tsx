import { AppSidebar } from '@/components/chat/sidebar';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AppSidebar />
      {children}
    </>
  );
}
