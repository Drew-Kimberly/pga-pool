import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    root: './src',
    globals: false,
    environment: 'node',
    testTimeout: 30000,
  },
  plugins: [
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
});
