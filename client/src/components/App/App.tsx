import { Grommet, Page } from 'grommet';
import React from 'react';

import { theme } from '../../theme';
import { AppBar } from '../AppBar';
import { TournamentLeaderboard } from '../TournamentLeaderboard';

export function App() {
  const [dark, setDark] = React.useState(false);

  return (
    <Grommet theme={theme} full themeMode={dark ? 'dark' : 'light'}>
      <Page>
        <AppBar darkMode={dark} setDarkMode={setDark} />
        <TournamentLeaderboard />
      </Page>
    </Grommet>
  );
}
