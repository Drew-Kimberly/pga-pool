import { Box, BoxExtendedProps, Spinner as GrommetSpinner, SpinnerExtendedProps } from 'grommet';
import { deepMerge } from 'grommet/utils';

import { useThemeContext } from '../../contexts/ThemeContext';

export interface SpinnerProps {
  box?: BoxExtendedProps;
  spinner?: SpinnerExtendedProps;
}

export function Spinner(props: SpinnerProps = { box: {}, spinner: {} }) {
  const themeContext = useThemeContext();

  const defaults: SpinnerProps = {
    box: { align: 'center', pad: 'xlarge', justify: 'center' },
    spinner: { size: 'medium', color: themeContext.darkMode ? 'white' : 'brand' },
  };
  const merged = deepMerge(props, defaults);

  return (
    <Box {...merged.box}>
      <GrommetSpinner {...merged.spinner} />
    </Box>
  );
}
