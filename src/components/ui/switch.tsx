import { cn } from '@/lib/utils';

interface SwitchProps {
  checked: boolean;
  onToggle: () => void;
  className?: string;
}

const Switch: React.FC<SwitchProps> = ({ checked, onToggle, className }) => {
  return (
    <div
      role="switch"
      aria-checked={checked}
      onClick={onToggle}
      className={cn(
        'relative inline-flex items-center px-0.5 cursor-pointer h-5 w-9 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        checked ? 'bg-primary justify-end' : 'bg-muted justify-start dark:bg-gray-800',
        className
      )}
    >
      <div className="h-4 w-4 rounded-full bg-background shadow-md" />
    </div>
  );
};

export default Switch;
