import { resolve } from 'path';
import fs from 'fs';
import postcss from 'postcss';
import type { Plugin } from 'vite';

/**
 * Get the package name from package.json or fallback to directory name
 * @param dirname The __dirname from the calling vite config
 * @returns The package name (last part of the scoped name or directory name)
 */
export function getPackageName(dirname: string): string {
  const packageJsonPath = resolve(dirname, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    // Extract the last part of the package name (after the last slash)
    const fullName = packageJson.name;
    return fullName.split('/').pop() || 'unknown';
  }
  // Fallback to directory name if package.json doesn't exist
  return dirname.split('/').pop() || 'unknown';
}

/**
 * Generate the fileName function for vite lib build
 * @param packageName The package name
 * @returns A function that generates the correct filename based on format
 */
export function createFileNameFunction(packageName: string) {
  return (format: string) =>
    `${packageName}.${format === 'es' ? 'mjs' : 'cjs'}`;
}

export const STYLES_WITHOUT_BASE_TOKENS = 'styles.no-base-tokens.css';

// base.css imports semantic.css (which imports primitive.css) and transport.css
const BASE_TOKEN_FILES = ['base.css', 'primitive.css', 'transport.css'];
const TOKEN_SELECTOR = /^(:root|\[data-(color|view)-mode(=[^\]]+)?\])$/;

function readBaseTokenNames(): Set<string> {
  const tokensDist = resolve(__dirname, 'packages/tokens/dist');
  const names = new Set<string>();
  for (const file of BASE_TOKEN_FILES) {
    const css = fs.readFileSync(resolve(tokensDist, file), 'utf-8');
    postcss.parse(css).walkDecls(/^--/, decl => {
      names.add(decl.prop);
    });
  }
  return names;
}

/**
 * Remove the tokens that @entur/tokens/dist/base.css already ships, so apps
 * that load base.css once do not get a copy from every package.
 */
export function removeBaseTokens(css: string): string {
  const baseTokens = readBaseTokenNames();
  const root = postcss.parse(css);
  root.walkRules(rule => {
    if (!rule.selectors.every(selector => TOKEN_SELECTOR.test(selector)))
      return;
    rule.walkDecls(decl => {
      if (baseTokens.has(decl.prop)) decl.remove();
    });
    if (!rule.some(node => node.type === 'decl')) rule.remove();
  });
  root.walkAtRules(atRule => {
    if (atRule.nodes?.length === 0) atRule.remove();
  });
  return root.toString();
}

/** Emit styles.no-base-tokens.css next to styles.css. */
export function stylesWithoutBaseTokensPlugin(): Plugin {
  return {
    name: 'entur:styles-without-base-tokens',
    apply: 'build',
    enforce: 'post',
    generateBundle(_, bundle) {
      const styles = bundle['styles.css'];
      if (styles?.type !== 'asset') return;
      this.emitFile({
        type: 'asset',
        fileName: STYLES_WITHOUT_BASE_TOKENS,
        source: removeBaseTokens(String(styles.source)),
      });
    },
  };
}
