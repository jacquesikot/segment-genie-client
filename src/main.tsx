import { ClerkProvider, SignIn, SignUp } from '@clerk/clerk-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import AppLayout from './components/app-layout.js';
import './index.css';
import ProtectedRoute from './lib/protected-route.js';
import Dashboard from './pages/dashboard.js';
import { ErrorPage } from './pages/error.js';
import NewSegment from './pages/new-segment';
import { NotFound } from './pages/not-found.js';
import Segment from './pages/segment.js';
import { store } from './redux/store';
import { ThemeProvider } from './components/theme-provider.js';

const queryClient = new QueryClient();

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env.local file');
}

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="mt-4 text-lg text-gray-600">Loading...</p>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: '/sign-in',
    element: <SignIn routing="path" path="/sign-in" />,
  },
  {
    path: '/sign-up',
    element: <SignUp routing="path" path="/sign-up" />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/new-segment',
        element: (
          <ProtectedRoute>
            <NewSegment />
          </ProtectedRoute>
        ),
      },
      {
        path: '/segment/:id',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <Segment />
            </Suspense>
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider storageKey="vite-ui-theme">
            <RouterProvider router={router} />
          </ThemeProvider>
        </QueryClientProvider>
      </Provider>
    </ClerkProvider>
  );
} else {
  console.error('Root element not found');
}
