import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Sparkles, Zap } from 'lucide-react';

export function SubscribeCTA() {
  const { toast } = useToast();

  const handleSubscribeClick = () => {
    toast({
      title: 'Coming soon!',
      description: 'Premium features will be available soon.',
    });
  };

  return (
    <SidebarMenu className="px-1 mb-4">
      <SidebarMenuItem>
        <Card
          className={cn(
            'relative overflow-hidden border-0 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all duration-300',
            'dark:from-indigo-900 dark:to-purple-900 dark:hover:from-indigo-800 dark:hover:to-purple-800',
            'shadow-md hover:shadow-lg py-3 px-4'
          )}
        >
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0 bg-white opacity-10"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            ></div>
          </div>

          {/* Glow effect */}
          <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full blur-3xl bg-indigo-400/20 dark:bg-indigo-600/20 pointer-events-none"></div>

          <div className="relative">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-indigo-100" />
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-100">Pro Plan</span>
            </div>

            <h3 className="text-sm font-semibold text-white mb-2">Unlock premium features</h3>

            <p className="text-xs text-indigo-100 mb-3">Get unlimited chat messages, report reruns and feed updates.</p>

            <Button
              size="sm"
              className="w-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
              onClick={handleSubscribeClick}
            >
              <Zap className="w-3.5 h-3.5 mr-1" />
              Upgrade Now
            </Button>
          </div>
        </Card>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
