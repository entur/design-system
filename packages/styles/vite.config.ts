import { defineConfig, mergeConfig } from 'vite';
import { resolve } from 'path';
import { createBaseConfig } from '../../vite.config.base';
import { getPackageName, createFileNameFunction } from '../../vite.utils';
import pkg from './package.json';

export default defineConfig(() => {
  const packageName = getPackageName(__dirname);

  const packageConfig = {
    build: {
      rollupOptions: {
        external: [
          ...Object.keys((pkg as any).dependencies || {}),
          ...Object.keys((pkg as any).peerDependencies || {}),
        ],
        output: {
          assetFileNames: asset => {
            switch (asset.name.split('.').pop()) {
              case 'css':
                return 'css/' + `[name]` + '.min.css';
              default:
                return 'other/' + `[name]` + `[extname]`;
            }
          },
        },
      },
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        formats: ['es', 'cjs'],
        fileName: createFileNameFunction(packageName),
      },
    },
    css: {
      modules: false,
      preprocessorOptions: {
        scss: {
          // Silence deprecation warnings for @import (we use it for CSS files)
          // Sass naturally preserves @import statements for .css files as plain CSS imports
          // This allows CSS layer() syntax to work properly in the browser
          silenceDeprecations: ['import'],
        },
      },
    },
  };

  return mergeConfig(createBaseConfig(), packageConfig);
});
