import { Grommet, GrommetExtendedProps } from 'grommet';
import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';

import { setAuth0TokenGetter } from '../../api/auth-client';
import { ThemeContextProvider, useThemeContext } from '../../contexts/ThemeContext';
import { router } from '../../router';
import { theme } from '../../theme';
import { ErrorBoundary } from '../ErrorBoundary';

import { useAuth0 } from '@auth0/auth0-react';

export function App() {
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    // Set up auth client with token getter
    setAuth0TokenGetter(getAccessTokenSilently);
  }, [getAccessTokenSilently]);

  const ThemedGrommet = (props: Omit<GrommetExtendedProps, 'themeMode'>) => {
    const { darkMode } = useThemeContext();
    return <Grommet themeMode={darkMode ? 'dark' : 'light'} {...props} />;
  };

  return (
    <ThemeContextProvider>
      <ThemedGrommet theme={theme} full>
        <ErrorBoundary>
          <RouterProvider router={router} />
        </ErrorBoundary>
      </ThemedGrommet>
    </ThemeContextProvider>
  );
}
