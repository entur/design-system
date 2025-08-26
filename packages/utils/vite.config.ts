import { defineConfig, mergeConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { createBaseConfig } from '../../vite.config.base';
import { getPackageName, createFileNameFunction } from '../../vite.utils';

export default defineConfig(() => {
  const packageName = getPackageName(__dirname);

  const packageConfig = {
    plugins: [
      react({
        jsxRuntime: 'automatic',
      }),
    ],
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        formats: ['es', 'cjs'],
        fileName: createFileNameFunction(packageName),
      },
    },
    css: {
      modules: false,
    },
  };

  return mergeConfig(createBaseConfig(), packageConfig);
});
