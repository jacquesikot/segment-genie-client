import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ReactNode } from 'react';
import { ModeToggle } from './mode-toggle';
import { SidebarTrigger } from './ui/sidebar';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  hasPrevious?: boolean;
  hasNext?: boolean;
  children?: ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, hasPrevious = true, hasNext = true, children }) => {
  const navigate = useNavigate();
  return (
    <header className="flex h-16 shrink-0 items-center border-b">
      <div className="flex w-full items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="ml-1" />
            <Separator orientation="vertical" className="h-4" />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              disabled={!hasPrevious}
              className="hover:bg-primary/10"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(1)}
              disabled={!hasNext}
              className="hover:bg-primary/10"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          {title && <Separator orientation="vertical" className="h-4" />}
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold line-clamp-1">{title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {children}
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
