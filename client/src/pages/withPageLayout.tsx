import { Page } from 'grommet';
import React from 'react';

import { AppBar } from '../components/AppBar';
import { useThemeContext } from '../contexts/ThemeContext';

export function withPageLayout<TProps extends object>(PageContents: React.ComponentType<TProps>) {
  const PageComponent = (props: TProps) => {
    const { darkMode, setDarkMode } = useThemeContext();

    return (
      <>
        <AppBar darkMode={darkMode} setDarkMode={setDarkMode} />
        <Page>
          <PageContents {...props} />
        </Page>
      </>
    );
  };

  PageComponent.displayName = PageContents.displayName ?? PageContents.name;

  return PageComponent;
}
