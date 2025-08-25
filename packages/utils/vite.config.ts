import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  plugins: [],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),

      formats: ['es', 'cjs'],
      fileName: format => 'utils.' + (format === 'es' ? 'esm' : 'cjs') + '.js',
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        /^@entur\//,
        'tiny-warning',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
          'react/jsx-dev-runtime': 'jsxDevRuntime',
          'tiny-warning': 'tinyWarning',
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
  },
});
