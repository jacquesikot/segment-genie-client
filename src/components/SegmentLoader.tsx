import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
  progress: string;
  statusText: string;
  title?: string;
  error?: string;
  onRetry?: () => void;
  isComplete?: boolean;
}

export default function SegmentLoader({
  progress,
  statusText,
  title = 'Customer Report',
  error,
  onRetry,
  isComplete,
}: Props) {
  const [progressValue, setProgressValue] = useState(0);

  useEffect(() => {
    const target = parseInt(progress);
    if (target > progressValue) {
      const timer = setTimeout(() => {
        setProgressValue((prev) => Math.min(prev + 1, target));
      }, 20);
      return () => clearTimeout(timer);
    }
  }, [progress, progressValue]);

  const getStatusColor = () => {
    if (error) return 'text-red-600 dark:text-red-400';
    if (isComplete) return 'text-green-600 dark:text-green-400';
    return 'text-indigo-600 dark:text-indigo-400';
  };

  const getBackgroundColor = () => {
    if (error) return 'bg-red-50 dark:bg-red-950/50';
    if (isComplete) return 'bg-green-50 dark:bg-green-950/50';
    return 'bg-indigo-50 dark:bg-indigo-950/50';
  };

  const renderIcon = () => {
    if (error) return <XCircle className="w-12 h-12 text-red-500 dark:text-red-400" />;
    if (isComplete) return <CheckCircle2 className="w-12 h-12 text-green-500 dark:text-green-400" />;
    return (
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 bg-indigo-100 dark:bg-indigo-900/50 rounded-full animate-ping opacity-75"></div>
        <Loader2 className="relative w-12 h-12 text-indigo-600 dark:text-indigo-400 animate-spin" />
      </div>
    );
  };

  const renderStatus = () => {
    return (
      <div className={`mt-6 text-center ${getStatusColor()}`}>
        {error ? (
          <div className="flex flex-col items-center space-y-3">
            <p className="text-sm font-medium" role="alert">
              {error}
            </p>
            {onRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800
                  hover:bg-red-50 dark:hover:bg-red-900/50 hover:text-red-700 dark:hover:text-red-300"
              >
                Try Again
              </Button>
            )}
          </div>
        ) : (
          <p className="text-sm font-medium" role="status" aria-live="polite">
            {statusText}
          </p>
        )}
      </div>
    );
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border border-gray-200 dark:border-gray-800 transition-allbg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Icon Section */}
          <div className="relative">
            {renderIcon()}
            {!error && !isComplete && (
              <div className={`absolute -inset-1 rounded-full animate-pulse -z-10 ${getBackgroundColor()}`}></div>
            )}
          </div>

          {/* Title Section */}
          <div className="text-center space-y-1.5">
            <CardTitle className={`text-xl font-semibold ${getStatusColor()}`}>
              {isComplete ? `${title} Ready` : error ? `Error generating ${title}` : `Generating ${title}`}
            </CardTitle>
            {!error && !isComplete && (
              <p className="text-sm text-gray-600 dark:text-gray-400">Please wait while we process your data</p>
            )}
          </div>

          {/* Progress Section */}
          <div
            className="w-full space-y-2"
            role="progressbar"
            aria-valuenow={progressValue}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1.5">
              <span>Progress</span>
              <span className="font-medium">{progressValue}%</span>
            </div>
            <Progress
              value={progressValue}
              className={`h-3 ${error ? 'bg-red-100 dark:bg-red-950' : 'bg-indigo-100 dark:bg-indigo-950'}`}
            />
          </div>

          {/* Status Section */}
          {renderStatus()}
        </div>
      </CardContent>
    </Card>
  );
}
