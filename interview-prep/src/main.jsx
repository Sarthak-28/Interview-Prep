import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import SignInPage from './auth/sign-in/SignInPage.jsx';
import SignUpPage from './auth/sign-up/SignUpPage.jsx';
import { ClerkProvider } from '@clerk/clerk-react';
import Dashboard from './pages/Dashboard.jsx'; // Use the new Dashboard component
import LandingPage from './pages/LandingPage.jsx';
import Resume from './pages/Resume.jsx';
import InterviewPage from './pages/InterviewPage.jsx';
import QuestionsPage from './pages/QuestionPage.jsx';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/dashboard', 
    element: <App />,
    children: [
      {
        index: true,
        element: <Dashboard />, 
      },
    ],
  },
  {
    path: 'resume', 
    element: <Resume />, 
  },
  {
    path: '/interview/:mockId', 
    element: <InterviewPage />,
  },
  {
    path: '/interview/:mockId/questions', 
    element: <QuestionsPage />,
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
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <RouterProvider router={router} />
    </ClerkProvider>
  </StrictMode>
);
