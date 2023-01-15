import { grommet, ThemeType } from 'grommet';
import { deepMerge } from 'grommet/utils';

export const theme: ThemeType = deepMerge(grommet, {
  global: {
    colors: {
      brand: '#161B22',
    },
    font: {
      family: 'Roboto',
      size: '18px',
      height: '20px',
    },
  },
});
