import { defineConfig, UserConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export const createBaseConfig = (): UserConfig =>
  defineConfig({
    plugins: [
      dts({
        insertTypesEntry: true,
      }),
    ],
    build: {
      rollupOptions: {
        external: [
          'react',
          'react-dom',
          'react/jsx-runtime',
          'react/jsx-dev-runtime',
          /^@entur\//,
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
    },
    css: {
      modules: false,
      preprocessorOptions: {
        scss: {
          loadPaths: [
            resolve(__dirname, 'packages'),
            resolve(__dirname, 'node_modules'),
          ],
        },
      },
    },
    resolve: {
      alias: {
        '@entur': resolve(__dirname, 'packages'),
      },
    },
  });
