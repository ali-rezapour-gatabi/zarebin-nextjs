'use client';

import { ChatContainer } from '@/components/chat/chat-container';
import { useParams } from 'next/navigation';

export default function ChatPage() {
  const { chatSlug } = useParams();
  return (
    <div className="flex w-full px-3 sm:px-0 sm:w-4/5 lg:w-3/4 mx-auto ">
      <ChatContainer />
    </div>
  );
}
