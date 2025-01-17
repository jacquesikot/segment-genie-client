'use client';

import { Segment } from '@/api/segment';
// import { Segment } from '@/api/segment';
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
        <div className="flex flex-col items-center justify-center text-center p-4">
          <HeartCrack className="mb-2 h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-medium text-muted-foreground">No Segments Yet</p>
          <p className="text-sm text-muted-foreground">Create a new segment to see it here.</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-4">
          <Hourglass className="mb-2 h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-medium text-muted-foreground">Loading segments</p>
        </div>
      )}
    </SidebarGroup>
  );
}
