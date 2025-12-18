'use client';
import { useChatStore } from '@/store/chat';
import { Button } from '@/components/ui/button';
import { MessageSquarePlus, MessageCircle, TextSearch, Trash2, MoreHorizontal, ChevronRight } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/app';

interface Conversation {
  id: string;
  title?: string;
  createdAt?: string | number | Date;
}

interface ConversationGroup {
  [key: string]: Conversation[];
}

export function AppSidebar() {
  const { conversations, currentConversationId, startNewConversation, selectConversation } = useChatStore();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const router = useRouter();
  const theme = useAppStore((state) => state.theme);
  const isDark = theme === 'dark';
  useEffect(() => {
    if (typeof document === 'undefined') return;

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const { toggleSidebar, open } = useSidebar();
  const hasConversations: boolean = conversations.length > 0;

  const groupConversationsByDate = (conversations: Conversation[]): [string, Conversation[]][] => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    const lastMonth = new Date(today);
    lastMonth.setDate(lastMonth.getDate() - 30);

    const groups: ConversationGroup = {
      امروز: [],
      دیروز: [],
      'هفته گذشته': [],
      'ماه گذشته': [],
      قدیمی‌تر: [],
    };

    conversations.forEach((conv: Conversation) => {
      const convDate = new Date(conv.createdAt || Date.now());

      if (convDate.toDateString() === today.toDateString()) {
        groups.امروز.push(conv);
      } else if (convDate.toDateString() === yesterday.toDateString()) {
        groups.دیروز.push(conv);
      } else if (convDate >= lastWeek) {
        groups['هفته گذشته'].push(conv);
      } else if (convDate >= lastMonth) {
        groups['ماه گذشته'].push(conv);
      } else {
        groups['قدیمی‌تر'].push(conv);
      }
    });

    return Object.entries(groups).filter(([_, convs]: [string, Conversation[]]) => convs.length > 0);
  };

  const groupedConversations: [string, Conversation[]][] = groupConversationsByDate(conversations);

  return (
    <Sidebar side="right" collapsible="icon" style={{ zIndex: 100 }} className="bg-background">
      <SidebarHeader className={`flex ${open ? 'flex-row items-center justify-between gap-3 p-4' : 'flex-col items-center gap-2 p-3'}`}>
        <Button className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center" onClick={toggleSidebar}>
          <MessageCircle className="size-5 text-white" />
        </Button>
        <Button onClick={toggleSidebar} variant="ghost" size="icon" className={`rounded-lg hover:bg-accent transition-all duration-300 bg-accent ${open ? 'w-9 h-9' : 'hidden'}`}>
          <ChevronRight className="size-5" />
        </Button>
      </SidebarHeader>

      <SidebarContent className={`px-3 py-2 ${open ? '' : 'cursor-pointer'}`} onClick={open ? undefined : toggleSidebar}>
        <SidebarGroup className="gap-2">
          <SidebarGroupContent className="space-y-5">
            <Button
              variant="ghost"
              size="lg"
              className={`w-full h-11 rounded-xl transition-all duration-200 ${open ? 'justify-start bg-accent hover:bg-accent/50 ' : 'justify-center hover:bg-transparent'}`}
              onClick={() => router.push('/explore')}
            >
              <TextSearch className="size-5 text-muted-foreground" />
              {open && <span className="mr-2">جستجوی متخصص</span>}
            </Button>
            <Button
              size="lg"
              className={`w-full h-11 rounded-xl font-medium transition-all hover:bg-accent/50 duration-200 ${
                open ? 'bg-gradient-to-r from-primary to-chart-2 justify-start' : 'justify-center bg-transparent text-ring'
              }`}
              onClick={startNewConversation}
            >
              <MessageSquarePlus className="size-5" />
              {open && <span className="mr-2">گفتگوی جدید</span>}
            </Button>

            {open && hasConversations && (
              <div className="pt-4 space-y-6">
                {groupedConversations.map(([groupName, convs]: [string, Conversation[]]) => (
                  <div key={groupName} className="space-y-1">
                    <SidebarGroupLabel className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{groupName}</SidebarGroupLabel>
                    <SidebarMenu className="space-y-1">
                      {convs.map((conversation: Conversation) => (
                        <SidebarMenuItem key={conversation.id}>
                          <div className="relative group" onMouseEnter={() => setHoveredId(conversation.id)} onMouseLeave={() => setHoveredId(null)}>
                            <SidebarMenuButton
                              isActive={conversation.id === currentConversationId}
                              size="lg"
                              onClick={() => selectConversation(conversation.id)}
                              className={`w-full rounded-lg transition-all duration-200 ${
                                conversation.id === currentConversationId ? 'bg-accent/80 shadow-sm' : 'hover:bg-accent/50'
                              }`}
                            >
                              <MessageCircle className="size-4 shrink-0" />
                              <span className="line-clamp-1 flex-1 text-right">{conversation.title || 'گفتگوی جدید'}</span>
                            </SidebarMenuButton>

                            {hoveredId === conversation.id && (
                              <div className="absolute left-2 top-1/2 -translate-y-1/2 flex gap-1 opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="w-7 h-7 rounded-lg hover:bg-background/80"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                >
                                  <MoreHorizontal className="size-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="w-7 h-7 rounded-lg hover:bg-destructive/10 hover:text-destructive"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                >
                                  <Trash2 className="size-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </div>
                ))}
              </div>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
