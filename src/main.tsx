import { ClerkProvider, SignIn, SignUp } from '@clerk/clerk-react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import AppLayout from './components/app-layout.js';
import './index.css';
import ProtectedRoute from './lib/protected-route.js';
import Dashboard from './pages/dashboard.js';
import NewSegment from './pages/new-segment';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Segment from './pages/segment.js';

export const queryClient = new QueryClient();

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env.local file');
}

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
    path: '/',
    element: <AppLayout />,
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
            <Segment />
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
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ClerkProvider>
  );
} else {
  console.error('Root element not found');
}
