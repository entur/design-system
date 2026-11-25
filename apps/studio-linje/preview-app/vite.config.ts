import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { docsAliases, sandboxedPlaygrounds } from './viteShared';

// Built into static/preview, which Studio serves at /static/preview/.
// Presentation loads it there, on the same origin as Studio.
export default defineConfig({
  root: __dirname,
  base: '/static/preview/',
  // Not `public`: the repo's .gitignore leaves out every folder with that name
  publicDir: path.resolve(__dirname, 'sandbox/page'),
  plugins: [sandboxedPlaygrounds, react()],
  resolve: {
    alias: docsAliases,
    dedupe: ['react', 'react-dom'],
  },
  build: {
    outDir: path.resolve(__dirname, '../static/preview'),
    emptyOutDir: true,
  },
});
