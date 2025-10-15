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
          // Separate heavy vendor libraries
          if (id.includes('node_modules')) {
            // Bundle React and Radix UI together to avoid context issues
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router') || id.includes('@radix-ui')) {
              return 'react-vendor';
            }
            if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('zod')) {
              return 'form-vendor';
            }
            if (id.includes('@vladmandic/human')) {
              return 'face-detection';
            }
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            if (id.includes('framer-motion')) {
              return 'animation';
            }
            // Other node_modules
            return 'vendor';
          }

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
