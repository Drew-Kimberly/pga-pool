import { Box } from 'grommet';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

import { Spinner } from '../components/Spinner';

import { useAuth0 } from '@auth0/auth0-react';

export const PostLoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, isLoading, error } = useAuth0();

  useEffect(() => {
    // Check for Auth0 error states
    const authError = searchParams.get('error');
    const authErrorDescription = searchParams.get('error_description');

    if (authError) {
      // Redirect to error page with error details
      navigate(
        `/error/auth?error=${authError}${
          authErrorDescription
            ? `&error_description=${encodeURIComponent(authErrorDescription)}`
            : ''
        }`
      );
      return;
    }

    // Check for Auth0 hook error
    if (error) {
      navigate(
        `/error/auth?error=auth0_error&error_description=${encodeURIComponent(error.message)}`
      );
      return;
    }

    if (!isLoading && isAuthenticated) {
      // Check if we have a stored redirect path
      const redirectPath = sessionStorage.getItem('redirectAfterLogin');
      if (redirectPath) {
        sessionStorage.removeItem('redirectAfterLogin');
        navigate(redirectPath);
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, isLoading, navigate, searchParams, error]);

  return (
    <Box fill align="center" justify="center">
      <Spinner />
    </Box>
  );
};
