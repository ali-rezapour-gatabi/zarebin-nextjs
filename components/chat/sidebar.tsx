'use client'

import { useChatStore } from "@/store/chat"
import { Button } from "@/components/ui/button"
import { MessageSquarePlus, MessageCircle, Hamburger } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  useSidebar,
} from "@/components/ui/sidebar"
import { NavUser } from "./user-nav"

export function AppSidebar() {
  const {
    conversations,
    currentConversationId,
    startNewConversation,
    selectConversation,
  } = useChatStore()
  const user = {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  }

  const { toggleSidebar } = useSidebar()

  const hasConversations = conversations.length > 0

  return (
    <Sidebar side="right" className="w-[380px] z-11" collapsible="icon">
      <SidebarHeader className="flex flex-row items-center justify-between px-5 mt-2">
        <div className="flex items-center gap-2 text-sm font-semibold truncate">
          <span className="truncate group-data-[collapsible=icon]:hidden">
            زره بین
          </span>
        </div>
        <Button
          onClick={toggleSidebar}
          className="w-10 h-10 rounded-full"
        >
          <Hamburger />
        </Button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel >
            <MessageCircle className="size-5" />
            <span className="text-[14px]">سوابق</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="my-2 border-t border-border py-4">
              <Button
                size="lg"
                className="w-full h-12 justify-start rounded-lg text-xs"
                onClick={startNewConversation}
              >
                <MessageSquarePlus className="mr-2 size-5" />
                <span className="text-[14px]">اضافه کردن</span>
              </Button>
            </div>
            <SidebarMenu>
              {hasConversations ? (
                conversations.map((conversation) => (
                  <SidebarMenuItem key={conversation.id}>
                    <SidebarMenuButton
                      isActive={conversation.id === currentConversationId}
                      size="lg"
                      onClick={() => selectConversation(conversation.id)}
                    >
                      <MessageCircle className="size-3.5 shrink-0" />
                      <span className="line-clamp-1">
                        {conversation.title || "New chat"}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              ) : (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuSkeleton showIcon />
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuSkeleton showIcon />
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuSkeleton showIcon />
                  </SidebarMenuItem>
                </>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-secondary">
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
