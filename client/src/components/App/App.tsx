import { Grommet, GrommetExtendedProps } from 'grommet';
import { RouterProvider } from 'react-router-dom';

import { ThemeContextProvider, useThemeContext } from '../../contexts/ThemeContext';
import { router } from '../../router';
import { theme } from '../../theme';

export function App() {
  const ThemedGrommet = (props: Omit<GrommetExtendedProps, 'themeMode'>) => {
    const { darkMode } = useThemeContext();
    return <Grommet themeMode={darkMode ? 'dark' : 'light'} {...props} />;
  };

  return (
    <ThemeContextProvider>
      <ThemedGrommet theme={theme} full>
        <RouterProvider router={router} />
      </ThemedGrommet>
    </ThemeContextProvider>
  );
}
