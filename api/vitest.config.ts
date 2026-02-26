import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    root: './src',
    globals: false,
    environment: 'node',
    testTimeout: 30000,
    coverage: {
      enabled: false,
      provider: 'v8',
      reportsDirectory: '../coverage',
      exclude: ['**/test/**'],
    },
  },
  plugins: [
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
});
