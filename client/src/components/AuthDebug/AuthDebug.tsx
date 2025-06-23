import { Box, Button, Card, CardBody, CardHeader, Text } from 'grommet';
import React from 'react';

import { useAuth0 } from '@auth0/auth0-react';

export const AuthDebug: React.FC = () => {
  const {
    isAuthenticated,
    isLoading,
    error,
    user,
    getAccessTokenSilently,
    loginWithRedirect,
    logout,
  } = useAuth0();
  const [token, setToken] = React.useState<string | null>(null);
  const [tokenError, setTokenError] = React.useState<string | null>(null);

  const getToken = async () => {
    try {
      setTokenError(null);
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        },
      });
      setToken(accessToken);
      console.log('Token obtained successfully');
    } catch (err) {
      console.error('Token error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setTokenError(errorMessage);
    }
  };

  const testApiCall = async () => {
    try {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(`${process.env.REACT_APP_PGA_POOL_API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      console.log('API response:', data);
      alert(JSON.stringify(data, null, 2));
    } catch (err) {
      console.error('API call error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      alert(`API Error: ${errorMessage}`);
    }
  };

  return (
    <Box pad="medium" gap="medium">
      <Card>
        <CardHeader pad="medium">
          <Text weight="bold">Auth0 Debug Panel</Text>
        </CardHeader>
        <CardBody pad="medium" gap="small">
          <Text>
            Status:{' '}
            {isLoading ? 'Loading...' : isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
          </Text>
          {error && <Text color="status-error">Error: {error.message}</Text>}
          {user && (
            <Box gap="xsmall">
              <Text>User: {user.email}</Text>
              <Text>Sub: {user.sub}</Text>
            </Box>
          )}

          <Box direction="row" gap="small" margin={{ top: 'small' }}>
            {!isAuthenticated && (
              <Button label="Login" onClick={() => loginWithRedirect()} primary />
            )}
            {isAuthenticated && (
              <>
                <Button label="Get Token" onClick={getToken} />
                <Button label="Test API" onClick={testApiCall} />
                <Button label="Logout" onClick={() => logout()} />
              </>
            )}
          </Box>

          {token && (
            <Box margin={{ top: 'small' }}>
              <Text weight="bold">Token (first 50 chars):</Text>
              <Text size="small" wordBreak="break-all">
                {token.substring(0, 50)}...
              </Text>
            </Box>
          )}

          {tokenError && (
            <Box margin={{ top: 'small' }}>
              <Text weight="bold" color="status-error">
                Token Error:
              </Text>
              <Text size="small" color="status-error">
                {tokenError}
              </Text>
            </Box>
          )}

          <Box margin={{ top: 'small' }}>
            <Text weight="bold">Configuration:</Text>
            <Text size="small">Domain: {process.env.REACT_APP_AUTH0_DOMAIN}</Text>
            <Text size="small">Client ID: {process.env.REACT_APP_AUTH0_CLIENT_ID}</Text>
            <Text size="small">Audience: {process.env.REACT_APP_AUTH0_AUDIENCE}</Text>
          </Box>
        </CardBody>
      </Card>
    </Box>
  );
};
