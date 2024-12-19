import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import SignInPage from './auth/sign-in/SignInPage.jsx';
import SignUpPage from './auth/sign-up/SignUpPage.jsx';
import { ClerkProvider } from '@clerk/clerk-react';
import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import LandingPage from './pages/LandingPage.jsx';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const router = createBrowserRouter([
  {
    path: '/', 
    element: <LandingPage />
  },
  {
    path: '/home', 
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />, 
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
    ],
  },
  {
    path: 'auth/sign-in',
    element: <SignInPage />,
  },
  {
    path: 'auth/sign-up',
    element: <SignUpPage />,
  },
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
    >
      <RouterProvider router={router} />
    </ClerkProvider>
  </StrictMode>
);
