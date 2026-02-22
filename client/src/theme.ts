import { grommet, ThemeType } from 'grommet';
import { deepMerge } from 'grommet/utils';
import { css } from 'styled-components';

const toggleCheckedStyle = css`
  background-color: #34c759;
  border-color: #34c759;
`;
const toggleKnobCheckedStyle = css`
  background-color: white !important;
`;

export const theme: ThemeType = deepMerge(grommet, {
  global: {
    colors: {
      brand: '#161B22',
      'rank-badge': { light: '#161B22', dark: '#6B7280' },
      'toggle-knob': '#F9F9F9',
      'toggle-bg': '#E5E5E5',
    },
    font: {
      family: 'Roboto',
      size: '18px',
      height: '20px',
    },
  },
  checkBox: {
    hover: {
      border: {
        color: undefined,
      },
    },
    toggle: {
      background: { light: 'toggle-bg' },
      knob: {
        extend: (ctx: { checked?: boolean }) => `
          ${ctx?.checked && toggleKnobCheckedStyle}
        `,
      },
      color: {
        light: 'toggle-knob',
      },
      extend: (ctx: { checked?: boolean }) => `
        ${ctx?.checked && toggleCheckedStyle}
      `,
    },
  },
} as ThemeType);
