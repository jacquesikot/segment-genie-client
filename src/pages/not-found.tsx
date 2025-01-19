import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { HomeIcon, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center w-screen bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md mx-4 shadow-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <XCircle className="h-16 w-16 text-gray-400 dark:text-gray-500" />
          </div>
          <CardTitle className="text-3xl text-center text-gray-900 dark:text-gray-100">404</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Page Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center w-full">
          <Button onClick={() => navigate('/')} className="w-full max-w-xs">
            <HomeIcon className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
