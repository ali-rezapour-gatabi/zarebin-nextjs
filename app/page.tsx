import { ChatContainer } from '@/components/chat/chat-container';
import { AppSidebar } from '@/components/chat/sidebar';

export default function HomePage() {
  return (
    <>
      <AppSidebar />
      <ChatContainer />
    </>
  );
}
