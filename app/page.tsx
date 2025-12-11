import { ChatContainer } from "@/components/chat/chat-container"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function HomePage() {
  return <SidebarProvider>
    <ChatContainer />
  </SidebarProvider>
}
