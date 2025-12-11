'use client'

import { useEffect, useRef } from "react"
import { useChatStore } from "@/store/chat"
import { ChatMessage } from "./chat-message"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatInput } from "./chat-input"
import { AppSidebar } from "./sidebar"
import { SidebarInset, useSidebar } from "@/components/ui/sidebar"
import { Button } from "../ui/button"
import { Hamburger } from "lucide-react"

export function ChatContainer() {
  const { messages, isLoading } = useChatStore()
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const { toggleSidebar } = useSidebar()

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages.length, isLoading])

  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col">
          <header >
            <div className="mx-auto flex max-w-2xl flex-col px-3 pb-4 pt-4 sm:px-4">
              <Button
                onClick={toggleSidebar}
                className="w-10 h-10 rounded-full"
              >
                <Hamburger />
              </Button>
            </div>
          </header>
          <ScrollArea className="flex-1">
            <div className="mx-auto flex max-w-2xl flex-col px-3 pb-4 pt-4 sm:px-4">
              {messages.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
                  <h1 className="text-lg font-semibold tracking-tight">
                    Start a new conversation
                  </h1>
                  <p className="max-w-xs text-xs text-muted-foreground">
                    Ask anything and a mock AI will respond instantly. The UI is
                    ready for a production chat model.
                  </p>
                </div>
              ) : (
                <div className="flex flex-1 flex-col">
                  {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                  {isLoading && (
                    <div className="flex justify-start py-3">
                      <div className="flex items-center gap-1 rounded-2xl px-4 py-3">
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </ScrollArea>
        </div>
        <ChatInput />
      </SidebarInset>
    </ >
  )
}
