'use client';
import { Button } from '@/components/ui/button';
import { MessageSquarePlus, MessageCircle, TextSearch, ChevronRight, ChevronDown } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, useSidebar } from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Trash2 } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import createChatAction from '@/app/actions/create-chat';
import { useChatStore } from '@/store/chat';
import getChatListAction from '@/app/actions/get-chat-list';
import { useEffect, useState } from 'react';
import deleteChatAction from '@/app/actions/delete-chat';

export function AppSidebar() {
  const router = useRouter();

  const { toggleSidebar, open, openMobile, isMobile } = useSidebar();
  const { setConversations, conversations } = useChatStore();
  const isExpanded = isMobile ? openMobile : open;
  const params = useParams();
  const [chatsOpen, setChatsOpen] = useState(true);

  useEffect(() => {
    getChatListAction().then((res) => {
      if (res.data.length > 0) {
        setConversations(res.data);
      }
    });
  }, [setConversations]);

  const makeChatTab = async () => {
    const res = await createChatAction({ title: 'گفتگوی جدید' });
    if (res.success) {
      await getChatListAction().then((res) => {
        setConversations(res.data);
      });
      router.push(`/${res.data}`);
    }
  };

  const deleteChat = async (chatId: string) => {
    const res = await deleteChatAction({ chatId });
    if (res.success) {
      await getChatListAction().then((res) => {
        setConversations(res.data);
      });
      router.push('/');
    }
  };

  return (
    <Sidebar side="right" collapsible="icon" style={{ zIndex: 100 }} className="bg-background">
      <SidebarHeader className={`flex border-b border-sidebar-border ${isExpanded ? 'flex-row items-center justify-between gap-3 p-4' : 'flex-col items-center gap-2 p-3'}`}>
        <Button className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-chart-2 shadow-sm" onClick={toggleSidebar}>
          <MessageCircle className="size-5 text-white" />
        </Button>
        <Button
          onClick={toggleSidebar}
          variant="ghost"
          size="icon"
          className={`rounded-xl bg-accent shadow-xs transition-all duration-300 hover:bg-accent/80 ${isExpanded ? 'size-10' : 'hidden'}`}
        >
          <ChevronRight className="size-5" />
        </Button>
      </SidebarHeader>

      <SidebarContent className={`px-3 py-3 ${isExpanded ? '' : 'cursor-pointer'}`} onClick={isExpanded ? undefined : toggleSidebar}>
        <SidebarGroup className="gap-2 px-0">
          <SidebarGroupContent className="space-y-5">
            <Button
              variant="ghost"
              size="lg"
              className={`w-full h-10 md:h-14 rounded-lg transition-all duration-200 ${isExpanded ? 'justify-start bg-accent text-accent-foreground hover:bg-accent/70' : 'justify-center hover:bg-transparent'}`}
              onClick={() => router.push('/explore')}
            >
              <TextSearch className={`size-6 ${isExpanded ? 'text-accent-foreground' : 'text-muted-foreground'}`} />
              {isExpanded && <span className="mr-2">جستجوی متخصص</span>}
            </Button>
            <Button
              onClick={makeChatTab}
              size="lg"
              className={`w-full h-10 md:h-14 rounded-lg font-medium transition-all hover:bg-accent/50 duration-200 ${
                isExpanded ? 'bg-gradient-to-r from-primary to-chart-2 justify-start' : 'justify-center bg-transparent text-ring'
              }`}
            >
              <MessageSquarePlus className="size-6" />
              {isExpanded && <span className="mr-2">گفتگوی جدید</span>}
            </Button>

            {isExpanded && <div className="pt-4 space-y-6"></div>}
          </SidebarGroupContent>
        </SidebarGroup>
        {isExpanded && (
          <SidebarContent>
            <SidebarGroup className="space-y-2 px-0">
              <Collapsible open={chatsOpen} onOpenChange={setChatsOpen} className="space-y-2">
                <SidebarGroupLabel asChild>
                  <CollapsibleTrigger type="button" className="group w-full justify-between transition-colors hover:bg-accent/60">
                    <span>گفتگوها</span>
                    <ChevronDown className="size-4 transition-transform group-data-[state=open]:rotate-180" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent className="space-y-2 pt-1">
                    {conversations.length > 0 &&
                      conversations.map((conversation) => (
                        <Button
                          key={conversation._id}
                          variant={params.chatSlug === conversation.slug ? 'secondary' : 'ghost'}
                          className={`group/conversation  w-full h-12 rounded-lg transition-all duration-200 justify-start text-accent-foreground hover:bg-accent/70 text-xs justify-between pl-2`}
                          onClick={() => router.push(`/${conversation.slug}`)}
                        >
                          <span className="truncate">{conversation.title}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover/conversation:opacity-100 transition-opacity"
                            onClick={() => deleteChat(conversation._id)}
                          >
                            <Trash2 className="size-5" />
                          </Button>
                        </Button>
                      ))}
                  </SidebarGroupContent>
                </CollapsibleContent>
              </Collapsible>
            </SidebarGroup>
          </SidebarContent>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
