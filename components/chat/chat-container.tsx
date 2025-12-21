'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useChatStore } from '@/store/chat';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatInput } from './chat-input';
import { SidebarInset } from '@/components/ui/sidebar';
import clsx from 'clsx';
import { ChatMessage } from './chat-message';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { Button } from '../ui/button';
import { ChevronDown } from 'lucide-react';

function CollapsibleExpertList({ experts }: { experts: any[] }) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="w-full pl-12">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2 text-xs text-muted-foreground">
          <ChevronDown className={clsx('size-3 transition-transform', open && 'rotate-180')} />
          مشاهده متخصصین پیشنهاد شده ({experts.length})
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2 mt-2">
        {experts.map((expert) => (
          <div key={expert._id} className="flex items-center justify-between p-2 rounded-lg bg-accent/30 border border-border/50">
            <span className="text-sm font-medium">{expert.name}</span>
            <Button size="sm" variant="outline" className="h-7 text-xs">
              مشاهده پروفایل
            </Button>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

export function ChatContainer() {
  const { isLoading, messages, exprtsList } = useChatStore();
  const isEmpty = messages.length === 0;
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <SidebarInset>
      <div className="relative flex h-full flex-col">
        <ScrollArea className="flex-1">
          <div className="mx-auto flex max-w-3xl flex-col px-3 pb-32 pt-4 sm:px-4 mb-10">
            <AnimatePresence initial={false}>
              {messages.map((item) => (
                <div key={item.id} className="flex flex-col gap-4">
                  <ChatMessage message={item} />
                  <div className="flex flex-col gap-2">{exprtsList && exprtsList.length > 0 && <CollapsibleExpertList experts={exprtsList || []} />}</div>
                </div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <div className="flex justify-start py-3" dir="rtl">
                <div className="flex items-center gap-1 rounded-2xl px-4 py-3">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>

        {isEmpty && (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center w-full">
            <h1 className="text-xl font-bold tracking-tight">شروع یک گفت‌وگوی جدید</h1>
            <p className="text-sm text-muted-foreground">هر سؤالی دارید بپرسید؛ چت‌بات ما مشکل شما را تحلیل می‌کند و بهترین متخصص را برای حل آن پیدا می‌کند.</p>
            <ChatInput isMessage={false} />
          </div>
        )}
        {!isEmpty && <ChatInput isMessage={true} />}
      </div>
    </SidebarInset>
  );
}
