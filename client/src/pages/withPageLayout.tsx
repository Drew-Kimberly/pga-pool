import { Page, ResponsiveContext } from 'grommet';
import React from 'react';

import { AppBar } from '../components/AppBar';
import { PoolNav, usePoolNavModel } from '../components/PoolNav';
import { useThemeContext } from '../contexts/ThemeContext';

export function withPageLayout<TProps extends object>(PageContents: React.ComponentType<TProps>) {
  const PageComponent = (props: TProps) => {
    const { darkMode, setDarkMode } = useThemeContext();
    const authEnabled = import.meta.env.VITE_AUTH_ENABLED === 'true';
    const size = React.useContext(ResponsiveContext);
    const navModel = usePoolNavModel();
    return (
      <>
        <AppBar authEnabled={authEnabled} darkMode={darkMode} setDarkMode={setDarkMode} />
        {navModel && size !== 'small' && <PoolNav model={navModel} mobile={false} />}
        <Page style={{ maxWidth: '960px', margin: '0 auto', width: '100%' }}>
          <PageContents {...props} />
        </Page>
        {navModel && size === 'small' && <PoolNav model={navModel} mobile={true} />}
      </>
    );
  };

  PageComponent.displayName = PageContents.displayName ?? PageContents.name;

  return PageComponent;
}
