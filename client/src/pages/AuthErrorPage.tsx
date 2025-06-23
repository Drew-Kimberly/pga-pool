import { Alert } from 'grommet-icons';
import { useSearchParams } from 'react-router-dom';

import { ErrorPage } from '../components/ErrorPage';

const AUTH_ERROR_MESSAGES: Record<string, { title: string; message: string }> = {
  access_denied: {
    title: 'Access Denied',
    message: 'You do not have permission to access this application.',
  },
  unauthorized: {
    title: 'Unauthorized',
    message: 'Your authentication request was not authorized.',
  },
  login_required: {
    title: 'Login Required',
    message: 'You must be logged in to access this page.',
  },
  user_cancelled: {
    title: 'Login Cancelled',
    message: 'You cancelled the login process.',
  },
  consent_required: {
    title: 'Consent Required',
    message: 'Please provide the necessary permissions to continue.',
  },
  interaction_required: {
    title: 'Interaction Required',
    message: 'Additional interaction is required to complete authentication.',
  },
  invalid_request: {
    title: 'Invalid Request',
    message: 'The authentication request was invalid.',
  },
  server_error: {
    title: 'Server Error',
    message: 'An error occurred on the authentication server.',
  },
  temporarily_unavailable: {
    title: 'Service Temporarily Unavailable',
    message: 'The authentication service is temporarily unavailable. Please try again later.',
  },
};

export const AuthErrorPage = () => {
  const [searchParams] = useSearchParams();
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  // Special handling for API configuration error
  if (error === 'access_denied' && errorDescription?.includes('Service not found')) {
    return (
      <ErrorPage
        title="Authentication Configuration Error"
        message="The Auth0 API is not properly configured. Please contact your administrator."
        error={error || undefined}
        errorDescription={errorDescription || undefined}
        showHomeButton={true}
        icon={<Alert size="large" color="status-error" />}
      />
    );
  }

  const errorInfo = error ? AUTH_ERROR_MESSAGES[error] : undefined;

  return (
    <ErrorPage
      title={errorInfo?.title || 'Authentication Error'}
      message={errorInfo?.message || 'An error occurred during authentication.'}
      error={error || undefined}
      errorDescription={errorDescription || undefined}
      showHomeButton={true}
      icon={<Alert size="large" color="status-error" />}
    />
  );
};
