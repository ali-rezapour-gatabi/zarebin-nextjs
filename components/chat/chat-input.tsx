'use client';

import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/store/chat';
import { Send, StopCircle } from 'lucide-react';
import sendMessageAction from '@/app/apis/actions/chat/send-message';

type FormValues = { message: string };
type ChatInputProps = { disabled?: boolean; isMessage?: boolean };

export function ChatInput({ disabled, isMessage }: ChatInputProps) {
  const {
    handleSubmit,
    register,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { message: '' },
  });

  const isLoading = useChatStore((state) => state.isLoading);
  const { currentConversation, setMessage, setExpertsList, setLoading, addMessage } = useChatStore();

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const messageValue = watch('message');

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }, [messageValue]);

  const createMessageId = () => {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  };

  const onSubmit = async (values: FormValues) => {
    const trimmedMessage = values.message.trim();
    if (!trimmedMessage) return;

    addMessage({
      id: createMessageId(),
      message: trimmedMessage,
      createdAt: new Date().toISOString(),
    });

    setLoading(true);
    try {
      const res = await sendMessageAction({ message: trimmedMessage, chatTabId: currentConversation });
      if (res.success) {
        const assistantContent = typeof res.chat === 'string' ? res.chat : String(res.chat ?? '');
        if (assistantContent.trim().length > 0) {
          addMessage({
            id: createMessageId(),
            analysis: assistantContent,
            createdAt: new Date().toISOString(),
          });
        }
        setMessage(typeof res.chat === 'string' ? res.chat : '');
        setExpertsList(res.expertsList);
        reset();
      }
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = disabled || isLoading || isSubmitting;

  return (
    <div className={`z-10 backdrop-blur w-full sticky ${isMessage && 'bottom-0 flex flex-col items-center justify-center gap-3 p-4 text-center'}`}>
      <form dir="rtl" onSubmit={handleSubmit(onSubmit)} className="relative mx-auto mb-4 flex w-full max-w-3xl px-2 pt-3">
        <div className="relative flex w-full flex-col rounded-xl border border-muted-foreground/20 bg-muted/50 px-4 py-3">
          <textarea
            {...register('message', {
              required: true,
              validate: (value) => value.trim().length > 0,
            })}
            ref={(el) => {
              register('message').ref(el);
              textareaRef.current = el;
            }}
            placeholder="چیجوری میتونم کمکتون کنم؟؟"
            disabled={isDisabled}
            className="w-full resize-none bg-transparent outline-none max-h-52 min-h-20 overflow-y-auto pr-2 custom-scroll p-2"
          />

          <div className="flex justify-end mt-3">
            <Button
              type="submit"
              size="icon"
              disabled={isDisabled || !messageValue?.trim()}
              className={cn('rounded-xl h-12 w-12 flex items-center justify-center transition-all', !messageValue?.trim() ? 'opacity-50 cursor-not-allowed' : '')}
            >
              {isLoading ? <StopCircle className="size-6" rotate={45} /> : <Send className="size-6" rotate={90} />}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
