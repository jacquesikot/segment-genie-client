import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { HomeIcon, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md mx-auto p-4">
        <Card className="shadow-2xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm bg-white/95 dark:bg-gray-800/95">
          <CardHeader className="space-y-4">
            <div className="flex justify-center relative">
              <div className="absolute inset-0 flex items-center justify-center blur-2xl opacity-50">
                <XCircle className="h-24 w-24 text-gray-400 dark:text-gray-500" />
              </div>
              <div className="relative animate-float">
                <XCircle className="h-16 w-16 text-gray-500 dark:text-gray-400" />
              </div>
            </div>
            <CardTitle className="text-center space-y-1">
              <span className="block text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400">
                404
              </span>
              <span className="block text-2xl mt-2 text-gray-700 dark:text-gray-300">Page Not Found</span>
            </CardTitle>
          </CardHeader>

          <CardContent className="text-center pb-8">
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
                Oops! It seems like you've ventured into uncharted territory. The page you're looking for has gone on
                vacation.
              </p>
              <div className="flex flex-col items-center space-y-2">
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Let's get you back on track</p>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-center px-6 pb-6">
            <Button
              onClick={() => navigate('/')}
              className="w-full max-w-xs bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-700 dark:to-gray-600 hover:from-gray-900 hover:to-gray-700 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all group"
            >
              <HomeIcon className="mr-2 h-4 w-4 group-hover:animate-pulse" />
              Return to Safety
            </Button>
          </CardFooter>
        </Card>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0);
          }
          50% {
            transform: translateY(-10px) rotate(5deg);
          }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default NotFound;
