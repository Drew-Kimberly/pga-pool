import { Page } from 'grommet';
import React from 'react';

import { AppBar } from '../components/AppBar';
import { Footer } from '../components/Footer';
import { useThemeContext } from '../contexts/ThemeContext';

export function withPageLayout<TProps extends object>(PageContents: React.ComponentType<TProps>) {
  const PageComponent = (props: TProps) => {
    const { darkMode, setDarkMode } = useThemeContext();
    const authEnabled = process.env.REACT_APP_AUTH_ENABLED === 'true';

    return (
      <>
        <AppBar authEnabled={authEnabled} darkMode={darkMode} setDarkMode={setDarkMode} />
        <Page>
          <PageContents {...props} />
        </Page>
        <Footer />
      </>
    );
  };

  PageComponent.displayName = PageContents.displayName ?? PageContents.name;

  return PageComponent;
}
