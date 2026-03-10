import { defineConfig, mergeConfig } from 'vitest/config';

import baseConfig from './vitest.config.base';

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      include: ['**/*.spec.ts'],
      exclude: ['**/*.integration.spec.ts'],
      coverage: {
        enabled: false,
        provider: 'v8',
        reportsDirectory: '../coverage',
        exclude: ['**/test/**'],
      },
    },
  })
);
