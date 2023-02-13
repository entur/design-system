import resolve from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';
import pkg from './package.json';

const sharedPlugins = [
  babel({
    exclude: 'node_modules/**',
    babelHelpers: 'bundled',
  }),
  resolve(),
];

const webConfig = {
  input: 'tmp/web/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
    },
    {
      file: pkg.module,
      format: 'esm',
    },
  ],
  external: ['react'],
  plugins: sharedPlugins,
};

const nativeConfig = {
  input: 'tmp/native/index.js',
  output: {
    file: pkg['react-native'],
    format: 'esm',
  },
  external: ['react', 'react-native-svg'],
  plugins: sharedPlugins,
};

export default [webConfig, nativeConfig];
