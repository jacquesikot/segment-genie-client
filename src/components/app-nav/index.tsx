import { Segment } from '@/api/segment';
import { Home, Layers, Rss } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import {
  Sidebar as CNSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../ui/sidebar';
import { NavMain } from './nav-main';
import { NavSegments } from './nav-segments';
import { NavUser } from './nav-user';
import Logo from '../../images/logo.png';

const mainNavRoutes = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/',
      icon: Home,
    },
    {
      title: 'Segments',
      url: '/segments',
      icon: Layers,
    },
    {
      title: 'Product Feed',
      url: '/feed',
      icon: Rss,
    },
  ],
};

interface Props extends React.ComponentProps<typeof CNSidebar> {
  segments: Segment[];
  isLoading: boolean;
}

function AppNav({ segments, isLoading, ...props }: Props) {
  const location = useLocation();
  const navMain = mainNavRoutes.navMain.map((item) => ({
    ...item,
    isActive: location.pathname === item.url,
  }));

  return (
    <CNSidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center justify-between">
            <SidebarMenuButton size="lg" asChild>
              <a href="/" className="flex items-center space-x-2">
                <img src={Logo} alt="Logo" className="w-10" />

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">SegmentGenie</span>
                  <span className="truncate text-xs">Product research</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavSegments segments={segments || []} isLoading={isLoading} />
      </SidebarContent>
      <SidebarFooter>
        {/* <SubscribeCTA /> */}
        <NavUser />
      </SidebarFooter>
    </CNSidebar>
  );
}

export default AppNav;
