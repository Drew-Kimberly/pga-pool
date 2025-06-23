import { Box } from 'grommet';
import React from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from '../../hooks';
import { LeagueSelector } from '../LeagueSelector';
import { Spinner } from '../Spinner';

import { useAuth0 } from '@auth0/auth0-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, currentLeague, leagues } = useAuth();
  const { error } = useAuth0();

  if (isLoading) {
    return (
      <Box fill align="center" justify="center">
        <Spinner />
      </Box>
    );
  }

  // Handle Auth0 errors
  if (error) {
    return (
      <Navigate
        to={`/error/auth?error=auth0_error&error_description=${encodeURIComponent(error.message)}`}
        replace
      />
    );
  }

  if (!isAuthenticated) {
    // Store current location for redirect after login
    sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
    return <Navigate to="/" replace />;
  }

  // If user is authenticated but has no league selected (and has leagues available)
  if (!currentLeague && leagues.length > 0) {
    return <LeagueSelector />;
  }

  return <>{children}</>;
};
