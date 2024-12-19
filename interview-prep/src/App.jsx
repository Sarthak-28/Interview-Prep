import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

function App() {
  const { isSignedIn, isLoaded } = useUser();
  const location = useLocation();

  if (!isSignedIn && isLoaded && location.pathname !== '/auth/sign-in' && location.pathname !== '/auth/sign-up') {
    return <Navigate to="/" />;
  }

  if (isSignedIn && isLoaded && (location.pathname === '/auth/sign-in' || location.pathname === '/auth/sign-up')) {
    return <Navigate to="/home" />;
  }

  return <Outlet />;
}

export default App;
