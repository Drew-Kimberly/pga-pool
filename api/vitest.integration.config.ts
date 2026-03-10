import { defineConfig, mergeConfig } from 'vitest/config';

import baseConfig from './vitest.config.base';

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      include: ['**/*.integration.spec.ts'],
      testTimeout: 60000,
      hookTimeout: 120000,
      globalSetup: ['../test-helpers/global-setup.ts'],
      pool: 'forks',
      poolOptions: {
        forks: {
          singleFork: true,
        },
      },
    },
  })
);
