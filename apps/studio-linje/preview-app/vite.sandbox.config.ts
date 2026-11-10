import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { docsAliases } from './viteShared';

// The sandboxed playground runtime: one classic script and one stylesheet,
// added to the preview app's output. WOFF2 fonts are inlined, because a page
// without an origin cannot load fonts without CORS. Browsers skip the older
// font formats, so those stay as files.
export default defineConfig({
  plugins: [react()],
  define: { 'process.env.NODE_ENV': JSON.stringify('production') },
  resolve: {
    alias: docsAliases,
    dedupe: ['react', 'react-dom'],
  },
  base: '/static/preview/',
  build: {
    outDir: path.resolve(__dirname, '../static/preview'),
    emptyOutDir: false,
    assetsInlineLimit: file => /\.(woff2|svg)$/.test(file),
    cssCodeSplit: false,
    rollupOptions: {
      input: path.resolve(__dirname, 'sandbox/main.tsx'),
      output: {
        format: 'iife',
        entryFileNames: 'playground.js',
        assetFileNames: asset =>
          asset.names.some(name => name.endsWith('.css'))
            ? 'playground.css'
            : 'assets/[name]-[hash][extname]',
      },
    },
  },
});
