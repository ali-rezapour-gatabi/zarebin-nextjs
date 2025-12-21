'use client';

import { ChatContainer } from '@/components/chat/chat-container';
import { useChatStore } from '@/store/chat';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import getConversationsAction from '../actions/get-conversations';

export default function ChatPage() {
  const { chatSlug } = useParams();
  const { setCurrentConversation, setMessage, setExprtsList, setMessages } = useChatStore();

  useEffect(() => {
    if (!chatSlug) return;

    const getConversations = async () => {
      const res = await getConversationsAction(chatSlug as string);
      if (res.success) {
        setCurrentConversation(String(chatSlug));
        setMessages(res.data);
        setExprtsList([]);
      }
    };
    getConversations();
    setMessage('');
    setExprtsList([]);
    setMessages([]);
    setCurrentConversation(String(chatSlug));
  }, [chatSlug, setCurrentConversation, setExprtsList, setMessage, setMessages]);

  return (
    <div className="flex w-full px-3 sm:px-0 sm:w-4/5 lg:w-3/4 mx-auto ">
      <ChatContainer />
    </div>
  );
}
