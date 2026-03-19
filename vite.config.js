import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cssInjectedByJs from 'vite-plugin-css-injected-by-js';

export default defineConfig({
  plugins: [
    react(),
    cssInjectedByJs(),
  ],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    lib: {
      entry: 'src/main.jsx',
      name: 'HitterCard',
      fileName: () => 'hitter-card.js',
      formats: ['iife'],
    },
    assetsInlineLimit: 200000,
    cssCodeSplit: false,
  },
});
