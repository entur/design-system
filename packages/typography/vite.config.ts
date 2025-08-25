import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.tsx'),

      formats: ['es', 'cjs'],
      fileName: format =>
        'typography.' + (format === 'es' ? 'esm' : 'cjs') + '.js',
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        /^@entur\//,
        'classnames',
        'normalize-scss',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
          'react/jsx-dev-runtime': 'jsxDevRuntime',
          classnames: 'classNames',
          'normalize-scss': 'normalizeScss',
        },
        assetFileNames: assetInfo => {
          if (assetInfo.name === 'style.css') return 'styles.css';
          return assetInfo.name || 'asset';
        },
      },
    },
    sourcemap: true,
    minify: false,
  },
  css: {
    modules: false,
    preprocessorOptions: {
      scss: {
        additionalData: `@use "sass:math";`,
        includePaths: ['node_modules', '../../node_modules'],
      },
    },
  },
  resolve: {
    alias: {
      '@entur/tokens': resolve(__dirname, '../../packages/tokens'),
      '@entur/utils': resolve(__dirname, '../../packages/utils'),
      '@entur/loader': resolve(__dirname, '../../packages/loader'),
      '@entur/icons': resolve(__dirname, '../../packages/icons'),
      '~normalize-scss': resolve(
        __dirname,
        '../../node_modules/normalize-scss',
      ),
    },
  },
});
