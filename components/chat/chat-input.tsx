'use client'

import { useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useChatStore } from "@/store/chat"
import { Send, StopCircle } from "lucide-react"

type FormValues = { message: string }
type ChatInputProps = { disabled?: boolean }

export function ChatInput({ disabled }: ChatInputProps) {
  const {
    handleSubmit,
    register,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { message: "" },
  })

  const isLoading = useChatStore((state) => state.isLoading)
  const sendMessage = useChatStore((state) => state.sendMessage)

  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const messageValue = watch("message")

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    textarea.style.height = "auto"
    textarea.style.height = textarea.scrollHeight + "px"
  }, [messageValue])

  const onSubmit = async (values: FormValues) => {
    await sendMessage(values.message)
    reset()
  }

  const isDisabled = disabled || isLoading || isSubmitting

  return (
    <div className="z-10 backdrop-blur">
      <form
        dir="rtl"
        onSubmit={handleSubmit(onSubmit)}
        className="relative mx-auto mb-4 flex w-full max-w-3xl px-2 pt-3"
      >
        <div className="relative flex w-full flex-col rounded-xl border border-muted-foreground/10 bg-muted/50 px-4 py-3 shadow-sm">
          <textarea
            {...register("message", {
              required: true,
              validate: (value) => value.trim().length > 0,
            })}
            ref={(el) => {
              register("message").ref(el)
              textareaRef.current = el
            }}
            placeholder="چیجوری میتونم کمکتون کنم؟؟"
            disabled={isDisabled}
            rows={1}
            className="w-full resize-none bg-transparent outline-none text-base leading-relaxed 
                 max-h-40 overflow-y-auto pr-2 custom-scroll"
          />

          <div className="flex justify-end mt-3">
            <Button
              type="submit"
              size="icon"
              disabled={isDisabled || !messageValue?.trim()}
              className={cn(
                "rounded-xl h-10 w-10 flex items-center justify-center transition-all",
                !messageValue?.trim() ? "opacity-50 cursor-not-allowed" : ""
              )}
            >
              {isLoading ? (
                <StopCircle className="size-5" />
              ) : (
                <Send className="size-5" />
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>

  )
}
