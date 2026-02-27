/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
// We use the direct vite-plugin-angular for better ESM compatibility
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [angular()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    include: ['src/**/*.spec.ts'],
    // This tells Vitest to transform Angular packages that might otherwise
    // cause ESM/CommonJS mismatch errors.
    server: {
      deps: {
        inline: [/@angular/, /@analogjs/],
      },
    },
  },
});
