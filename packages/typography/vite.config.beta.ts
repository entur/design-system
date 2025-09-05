import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import pkg from './package.json';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
    dts({
      insertTypesEntry: true,
      outDir: 'dist/beta/types',
      entryRoot: 'src/beta',
      // Stop aliasing @entur to ../../../packages
      pathsToAliases: false,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/beta/index.tsx'),
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => {
        const _format = format === 'es' ? 'esm' : format;
        return `${_format}/${entryName}.${format === 'es' ? 'mjs' : 'cjs'}`;
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
        preserveModules: true,
      },
    },
    sourcemap: true,
    minify: false,
    outDir: 'dist/beta',
    emptyOutDir: true, // Clean beta directory on each build
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
