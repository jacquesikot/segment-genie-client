import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { HomeIcon, AlertTriangle, RefreshCw } from 'lucide-react';
import { useNavigate, useRouteError } from 'react-router-dom';

export const ErrorPage: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const error = useRouteError() as any;
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md mx-auto p-4">
        <Card className="shadow-2xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm bg-white/95 dark:bg-gray-800/95">
          <CardHeader className="space-y-4">
            <div className="flex justify-center relative">
              <div className="absolute inset-0 flex items-center justify-center blur-2xl opacity-50">
                <AlertTriangle className="h-24 w-24 text-red-500/50" />
              </div>
              <div className="relative animate-bounce-slow">
                <AlertTriangle className="h-16 w-16 text-red-500" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400">
              Oops! Something went wrong
            </CardTitle>
          </CardHeader>

          <CardContent className="text-center space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                {error?.statusText || error?.message || 'An unexpected error occurred'}
              </h2>
              {error?.status && (
                <div className="inline-block px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30">
                  <p className="text-sm text-red-600 dark:text-red-400">Error {error.status}</p>
                </div>
              )}
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              Don't worry! This is just a temporary setback. You can try refreshing the page or return to the home page.
            </p>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-3 p-6">
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="w-full group hover:border-red-500/50 hover:bg-red-500/5 transition-all"
            >
              <RefreshCw className="mr-2 h-4 w-4 group-hover:animate-spin" />
              Try Again
            </Button>
            <Button
              onClick={() => navigate('/')}
              className="w-full bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-700 dark:to-gray-600 hover:from-gray-900 hover:to-gray-700 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all"
            >
              <HomeIcon className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          </CardFooter>
        </Card>
      </div>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite;
        }
      `}</style>
    </div>
  );
};

export default ErrorPage;
