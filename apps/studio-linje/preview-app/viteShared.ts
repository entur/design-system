import path from 'path';
import type { Plugin } from 'vite';

export const docsSrc = path.resolve(__dirname, '../../documentation/src');

// Lets the docs site's components build outside Gatsby
export const docsAliases = [
  {
    find: /^gatsby$/,
    replacement: path.resolve(__dirname, 'gatsbyShim.tsx'),
  },
  { find: '@components', replacement: `${docsSrc}/components` },
  { find: '@data', replacement: `${docsSrc}/data` },
  { find: '@providers', replacement: `${docsSrc}/providers` },
  { find: '@layouts', replacement: `${docsSrc}/layouts` },
  { find: /^src\//, replacement: `${docsSrc}/` },
];

// The docs site's code examples get SandboxedPlayground instead of Playground,
// so code from a document never runs on Studio's origin
export const sandboxedPlaygrounds: Plugin = {
  name: 'sandboxed-playgrounds',
  enforce: 'pre',
  // The @components alias has already turned the import into a path
  resolveId(source, importer) {
    if (
      source === `${docsSrc}/components/Playground/Playground` &&
      importer?.startsWith(docsSrc)
    ) {
      return path.resolve(__dirname, 'sandboxedPlayground.tsx');
    }
    return null;
  },
};
