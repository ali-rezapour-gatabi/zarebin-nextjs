'use client';

import { useRef } from 'react';
import { useChatStore } from '@/store/chat';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatInput } from './chat-input';
import { SidebarInset } from '@/components/ui/sidebar';
import clsx from 'clsx';

export function ChatContainer() {
  const { isLoading } = useChatStore();
  const isEmpty = useRef(true);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  return (
    <SidebarInset>
      <div className="relative flex h-full flex-col">
        {/* Messages Area */}
        <ScrollArea className="flex-1">
          <div className="mx-auto flex max-w-2xl flex-col px-3 pb-32 pt-4 sm:px-4">
            <>
              {isLoading && (
                <div className="flex justify-start py-3">
                  <div className="flex items-center gap-1 rounded-2xl px-4 py-3">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                </div>
              )}
            </>

            <div ref={bottomRef} />
          </div>
        </ScrollArea>

        <div
          className={clsx(
            'absolute left-0 right-0 mx-auto w-full max-w-3xl px-4 transition-all duration-500 ease-in-out',
            isEmpty ? 'top-1/2 -translate-y-1/2' : 'bottom-4 translate-y-0',
          )}
        >
          {isEmpty && (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <h1 className="text-xl font-bold tracking-tight">شروع یک گفت‌وگوی جدید</h1>
              <p className="text-sm text-muted-foreground">هر سؤالی دارید بپرسید؛ چت‌بات ما مشکل شما را تحلیل می‌کند و بهترین متخصص را برای حل آن پیدا می‌کند.</p>
            </div>
          )}
          <ChatInput />
        </div>
      </div>
    </SidebarInset>
  );
}
