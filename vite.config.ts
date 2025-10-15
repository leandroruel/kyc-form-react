import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
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
        },
      },
    },
    // Enable minification
    minify: 'esbuild',
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable source maps for debugging (can disable for smaller builds)
    sourcemap: false,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
    ],
    exclude: ['@vladmandic/human'], // Exclude heavy lib from pre-bundling
  },
})
