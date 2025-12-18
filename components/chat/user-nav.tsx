'use client';
import { Bell, ChevronsUpDown, LogOut, Moon, Sun, User2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { useAppStore } from '@/store/app';
import { useRouter } from 'next/navigation';
export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const router = useRouter();
  const theme = useAppStore((state) => state.theme);
  const themeToggle = useAppStore((state) => state.toggleTheme);
  const { hasAuth } = useAppStore();
  const { isMobile, open } = useSidebar();
  const isCollapsed = !open && !isMobile;
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu dir="rtl">
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              tooltip={isCollapsed ? user.name : undefined}
              className={`data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground ${isCollapsed ? 'justify-center' : ''}`}
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              {hasAuth ? (
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              ) : (
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">ورود</span>
                </div>
              )}
              {!isCollapsed && <ChevronsUpDown className="ml-auto size-4" />}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg" side={isMobile ? 'bottom' : 'right'} align="end" sideOffset={4}>
            {hasAuth && (
              <DropdownMenuLabel className="p-0 font-normal px-0">
                <div className="flex items-center gap-2 px-4 py-3 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
                <DropdownMenuSeparator />
              </DropdownMenuLabel>
            )}
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push(hasAuth ? '/dashboard' : '/sign-in')}>
                <User2 />
                {hasAuth ? 'ورود به پنل کاربری' : 'ورود به حساب کاربری'}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Bell />
                اعلان‌ها
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={themeToggle}>
              {theme === 'dark' ? <Sun className="size-5 text-amber-100" /> : <Moon className="size-4 " />}
              {theme === 'dark' ? 'روشن' : 'تاریک'}
            </DropdownMenuItem>
            {hasAuth && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut />
                  خروج
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
