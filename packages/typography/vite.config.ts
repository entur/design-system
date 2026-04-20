import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import pkg from './package.json';

// Main config for backward-compatible src build
// This maintains the old structure with individual component files
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
    dts({
      insertTypesEntry: true,
      rollupTypes: false,
      // Stop aliasing @entur to ../../packages
      pathsToAliases: false,
    }),
  ],
  build: {
    lib: {
      entry: {
        typography: resolve(__dirname, 'src/index.tsx'),
      },
      formats: ['es', 'cjs'],
      fileName: (format) => {
        // Match old structure: typography.cjs.js and typography.esm.js
        return `typography.${format === 'es' ? 'esm.js' : 'cjs.js'}`;
      },
    },
    rollupOptions: {
      external: [
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {}),
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
      ],
      output: {
        assetFileNames: assetInfo => {
          if (assetInfo.names?.find(name => name.endsWith('.css'))) {
            return 'styles.css';
          }
          return assetInfo.names?.[0] || 'asset';
        },
      },
    },
    sourcemap: true,
    minify: false,
    outDir: 'dist',
    emptyOutDir: true, // Don't empty - we'll build beta separately
  },
  css: {
    modules: false,
    preprocessorOptions: {
      scss: {
        loadPaths: [
          resolve(__dirname, '../../packages'),
          resolve(__dirname, '../../node_modules'),
        ],
      },
    },
  },
});
