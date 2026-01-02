import React from 'react';

export default function IdeaLayout({ children }: { children: React.ReactNode }) {
  return <main className="max-w-[1024px] mx-auto">{children}</main>;
}
