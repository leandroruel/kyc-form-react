/// <reference types="vitest/config" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    alias: {
      '@vladmandic/human': path.resolve(__dirname, './src/test/mocks/human.mock.ts')
    },
    projects: [{
      extends: true,
      plugins: [
      // The plugin will run tests for the stories defined in your Storybook config
      // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
      storybookTest({
        configDir: path.join(dirname, '.storybook')
      })],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: 'playwright',
          instances: [{
            browser: 'chromium'
          }]
        },
        setupFiles: ['.storybook/vitest.setup.ts']
      }
    }]
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: id => {
          // Separate each KYC step component into its own chunk
          if (id.includes('/components/kyc/PersonalInfoStep')) {
            return 'kyc-personal';
          }
          if (id.includes('/components/kyc/AddressStep')) {
            return 'kyc-address';
          }
          if (id.includes('/components/kyc/IdentityStep')) {
            return 'kyc-identity';
          }
          if (id.includes('/components/kyc/SelfieStep')) {
            return 'kyc-selfie';
          }
          if (id.includes('/components/kyc/ReviewStep')) {
            return 'kyc-review';
          }
        }
      }
    },
    // Enable minification
    minify: 'esbuild',
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable source maps for debugging (can disable for smaller builds)
    sourcemap: false
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query'],
    exclude: ['@vladmandic/human'] // Exclude heavy lib from pre-bundling
  }
});