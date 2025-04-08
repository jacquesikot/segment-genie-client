import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import AppLayout from './components/app-layout.js';
import { ThemeProvider } from './components/theme-provider.js';
import { Toaster } from './components/ui/toaster.js';
import './index.css';
import { AuthProvider } from './lib/auth-context.js';
import ProtectedRoute from './lib/protected-route.js';
import AuthCallback from './pages/auth-callback.js';
import Dashboard from './pages/dashboard.js';
import { ErrorPage } from './pages/error.js';
import Feed from './pages/feed.js';
import ForgotPassword from './pages/forgot-password.js';
import { NotFound } from './pages/not-found.js';
import ResetPassword from './pages/reset-password.js';
import Segment from './pages/segment.js';
import Segments from './pages/segments.js';
import SignIn from './pages/sign-in.tsx';
import SignUp from './pages/sign-up.tsx';
import { store } from './redux/store';

const queryClient = new QueryClient();

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
    element: <SignIn />,
  },
  {
    path: '/sign-up',
    element: <SignUp />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
  },
  {
    path: '/auth/callback',
    element: <AuthCallback />,
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
        path: 'segments',
        element: (
          <ProtectedRoute>
            <Segments />
          </ProtectedRoute>
        ),
      },
      {
        path: 'feed',
        element: (
          <ProtectedRoute>
            <Feed />
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
    <AuthProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider storageKey="vite-ui-theme">
            <RouterProvider router={router} />
            <Toaster />
          </ThemeProvider>
        </QueryClientProvider>
      </Provider>
    </AuthProvider>
  );
} else {
  console.error('Root element not found');
}
