import { Button, Header, Text } from 'grommet';
import { Moon, Sun } from 'grommet-icons';
import { useNavigate } from 'react-router-dom';

export interface AppBarProps {
  darkMode: boolean;
  setDarkMode: (isDark: boolean) => void;
}

export function AppBar({ darkMode, setDarkMode }: AppBarProps) {
  const navigate = useNavigate();
  const btnTitle = darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode';

  return (
    <Header
      background="brand"
      sticky="scrollup"
      pad={{ left: 'medium', right: 'small', vertical: 'small' }}
    >
      <Button
        onClick={(event) => {
          event.preventDefault();
          navigate('/');
        }}
      >
        <Text size="large">PGA Pool</Text>
      </Button>
      <Button
        a11yTitle={btnTitle}
        title={btnTitle}
        icon={darkMode ? <Moon /> : <Sun />}
        onClick={() => setDarkMode(!darkMode)}
      />
    </Header>
  );
}
