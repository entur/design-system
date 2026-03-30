/** Directories to exclude when walking source files. */
export const EXCLUDE_DIRS = new Set([
  'node_modules',
  '.next',
  'dist',
  'build',
  'coverage',
  '__tests__',
  '__mocks__',
  'storybook-static',
  '.storybook',
  'public',
  '.cache',
  '.turbo',
  '.nx',
  'out',
]);
