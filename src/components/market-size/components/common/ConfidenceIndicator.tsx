import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export const ConfidenceIndicator = ({ confidence, tooltip }: { confidence: number; tooltip: string }) => (
  <Tooltip>
    <TooltipTrigger>
      <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Confidence</span>
        <div className="flex items-center gap-2">
          <div className="relative w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="absolute h-full bg-indigo-600 dark:bg-indigo-500 transition-all duration-500"
              style={{ width: `${confidence * 100}%` }}
            />
          </div>
          <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
            {(confidence * 100).toFixed(0)}%
          </span>
        </div>
      </div>
    </TooltipTrigger>
    <TooltipContent className="p-3 max-w-xs">{tooltip}</TooltipContent>
  </Tooltip>
);
