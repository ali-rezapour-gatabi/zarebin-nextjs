'use client';
import { ChatContainer } from '@/components/chat/chat-container';
import { AppSidebar } from '@/components/chat/sidebar';
import { useChatStore } from '@/store/chat';
import { useEffect } from 'react';

export default function HomePage() {
  const { setCurrentConversation, setExprtsList, setMessage, setMessages } = useChatStore();
  useEffect(() => {
    setMessage('');
    setExprtsList([]);
    setMessages([]);
    setCurrentConversation(null);
  }, [setCurrentConversation, setExprtsList, setMessage, setMessages]);
  return (
    <>
      <AppSidebar />
      <ChatContainer />
    </>
  );
}
