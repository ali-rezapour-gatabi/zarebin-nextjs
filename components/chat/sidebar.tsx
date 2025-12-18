'use client';
import { Button } from '@/components/ui/button';
import { MessageSquarePlus, MessageCircle, TextSearch, ChevronRight } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader, useSidebar } from '@/components/ui/sidebar';
import { useRouter } from 'next/navigation';

export function AppSidebar() {
  const router = useRouter();

  const { toggleSidebar, open, openMobile, isMobile } = useSidebar();
  const isExpanded = isMobile ? openMobile : open;

  return (
    <Sidebar side="right" collapsible="icon" style={{ zIndex: 100 }} className="bg-background">
      <SidebarHeader className={`flex border-b border-sidebar-border ${isExpanded ? 'flex-row items-center justify-between gap-3 p-4' : 'flex-col items-center gap-2 p-3'}`}>
        <Button className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-chart-2 shadow-sm" onClick={toggleSidebar}>
          <MessageCircle className="size-5 text-white" />
        </Button>
        <Button onClick={toggleSidebar} variant="ghost" size="icon" className={`rounded-xl bg-accent shadow-xs transition-all duration-300 hover:bg-accent/80 ${isExpanded ? 'size-10' : 'hidden'}`}>
          <ChevronRight className="size-5" />
        </Button>
      </SidebarHeader>

      <SidebarContent className={`px-3 py-3 ${isExpanded ? '' : 'cursor-pointer'}`} onClick={isExpanded ? undefined : toggleSidebar}>
        <SidebarGroup className="gap-2 px-0">
          <SidebarGroupContent className="space-y-5">
            <Button
              variant="ghost"
              size="lg"
              className={`w-full h-10 md:h-14 rounded-xl transition-all duration-200 ${isExpanded ? 'justify-start bg-accent text-accent-foreground hover:bg-accent/70' : 'justify-center hover:bg-transparent'}`}
              onClick={() => router.push('/explore')}
            >
              <TextSearch className={`size-5 ${isExpanded ? 'text-accent-foreground' : 'text-muted-foreground'}`} />
              {isExpanded && <span className="mr-2">جستجوی متخصص</span>}
            </Button>
            <Button
              size="lg"
              className={`w-full h-10 md:h-14 rounded-xl font-medium transition-all hover:bg-accent/50 duration-200 ${
                isExpanded ? 'bg-gradient-to-r from-primary to-chart-2 justify-start' : 'justify-center bg-transparent text-ring'
              }`}
            >
              <MessageSquarePlus className="size-5" />
              {isExpanded && <span className="mr-2">گفتگوی جدید</span>}
            </Button>

            {isExpanded && <div className="pt-4 space-y-6"></div>}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
