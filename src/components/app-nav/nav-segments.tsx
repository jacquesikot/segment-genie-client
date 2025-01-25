import { Segment } from '@/api/segment';
import { FolderSearch, HeartCrack, Hourglass, MoreHorizontal, StarOff, Trash2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '../../components/ui/sidebar';

export function NavSegments({ segments, isLoading }: { segments: Segment[]; isLoading: boolean }) {
  const { isMobile } = useSidebar();
  const location = useLocation();

  const handleDelete = () => {};

  const renderEmpty = () => (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative">
        <div className="absolute -inset-1 rounded-full animate-pulse bg-muted"></div>
        <div className="relative bg-background rounded-full p-3">
          <HeartCrack className="h-8 w-8 text-muted-foreground" />
        </div>
      </div>
      <div className="space-y-2 text-center">
        <h3 className="font-semibold text-foreground">No Favorites Yet</h3>
        <p className="text-sm text-muted-foreground">Start adding segments to your favorites</p>
      </div>
    </div>
  );

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative">
        <div className="absolute inset-0 rounded-full animate-ping opacity-75 bg-indigo-100 dark:bg-indigo-900/50"></div>
        <div className="relative bg-background rounded-full p-3">
          <Hourglass className="h-8 w-8 text-indigo-600 dark:text-indigo-400 animate-pulse" />
        </div>
      </div>
      <div className="space-y-1.5 text-center">
        <h3 className="font-semibold text-foreground animate-pulse">Loading Segments</h3>
        <div className="flex flex-col items-center gap-2">
          <div className="h-2 w-24 bg-muted rounded animate-pulse"></div>
          <div className="h-2 w-32 bg-muted rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Favorites 🚀</SidebarGroupLabel>
      {segments && segments.length > 0 ? (
        <SidebarMenu>
          {segments.map((item) => (
            <SidebarMenuItem key={item._id}>
              <SidebarMenuButton asChild isActive={`/segment/${item._id}` === location.pathname}>
                <a href={`/segment/${item._id}`} title={item.title}>
                  <FolderSearch />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover>
                    <MoreHorizontal />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 rounded-lg"
                  side={isMobile ? 'bottom' : 'right'}
                  align={isMobile ? 'end' : 'start'}
                >
                  <DropdownMenuItem>
                    <StarOff className="text-muted-foreground" />
                    <span>Remove from Favorites</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleDelete}>
                    <Trash2 className="text-muted-foreground" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      ) : !isLoading ? (
        renderEmpty()
      ) : (
        renderLoading()
      )}
    </SidebarGroup>
  );
}
