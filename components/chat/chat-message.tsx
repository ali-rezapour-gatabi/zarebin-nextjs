'use client';

import { motion } from 'framer-motion';
import { ChatMessage as ChatMessageType } from '@/store/chat';
import { cn } from '@/lib/utils';

function MessageBubble({ content, createdAt, isUser }: { content: string; createdAt: string; isUser: boolean }) {
  return (
    <motion.div
      dir="rtl"
      className={cn('flex w-full gap-3 py-3 justify-start')}
      initial={{ opacity: 0, y: 12, x: 24 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
    >
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm',
          isUser ? 'bg-muted-foreground rounded-br-sm' : 'bg-muted text-foreground rounded-bl-sm',
        )}
      >
        <p className="whitespace-pre-wrap break-words">{content}</p>
        <div className="mt-1 text-[10px]">
          {new Date(createdAt).toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </motion.div>
  );
}

type ChatMessageProps = {
  message: ChatMessageType;
};

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <main dir="rtl" className="flex flex-col gap-3 ">
      {message.message && <MessageBubble content={message.message} createdAt={message.createdAt} isUser />}
      <div>{message.analysis}</div>
    </main>
  );
}
