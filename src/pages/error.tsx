import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { HomeIcon, AlertTriangle } from 'lucide-react';
import { useNavigate, useRouteError } from 'react-router-dom';

// ErrorPage Component for general errors
export const ErrorPage: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const error = useRouteError() as any;
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl text-center">Oops! Something went wrong</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">{error?.statusText || error?.message || 'An unexpected error occurred'}</p>
          {error?.status && <p className="text-sm text-gray-500">Error {error.status}</p>}
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
          <Button onClick={() => navigate('/')}>
            <HomeIcon className="mr-2 h-4 w-4" />
            Go Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
