import React from 'react';

import { ParentComponentProps } from '../components/types';
import { usePersistedState } from '../hooks';

export interface ThemeContext {
  darkMode: boolean;
  setDarkMode: (isDark: boolean) => void;
}

const Context = React.createContext<ThemeContext | null>(null);

export function ThemeContextProvider({ children }: ParentComponentProps) {
  const [darkMode, setDarkMode] = usePersistedState(false, 'theme-selection');

  return <Context.Provider value={{ darkMode, setDarkMode }}>{children}</Context.Provider>;
}

export function useThemeContext() {
  const themeContext = React.useContext(Context);

  if (!themeContext) {
    throw new Error(`${useThemeContext.name} must be used within <ThemeContextProvider>`);
  }

  return themeContext;
}
