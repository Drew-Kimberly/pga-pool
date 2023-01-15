import { Button, Header, Text } from 'grommet';
import { Moon, Sun } from 'grommet-icons';

export interface AppBarProps {
  darkMode: boolean;
  setDarkMode: (isDark: boolean) => void;
}

export function AppBar({ darkMode, setDarkMode }: AppBarProps) {
  const btnTitle = darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode';

  return (
    <Header
      background="brand"
      sticky="scrollup"
      pad={{ left: 'medium', right: 'small', vertical: 'small' }}
    >
      <Text size="large">PGA Pool</Text>
      <Button
        a11yTitle={btnTitle}
        title={btnTitle}
        icon={darkMode ? <Moon /> : <Sun />}
        onClick={() => setDarkMode(!darkMode)}
      />
    </Header>
  );
}
