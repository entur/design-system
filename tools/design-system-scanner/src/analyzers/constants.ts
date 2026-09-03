import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

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

/** TypeScript/JavaScript source extensions the analyzers parse. */
export const SOURCE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx']);

/** Stylesheet extensions the analyzers parse. */
export const STYLE_EXTENSIONS = new Set(['.css', '.scss', '.sass', '.less']);

/** Patterns for files to exclude (tests, stories, declarations). */
export const EXCLUDE_FILE_PATTERNS = [
  /\.(test|spec)\.[jt]sx?$/,
  /\.(stories|story)\.[jt]sx?$/,
  /\.d\.[jt]sx?$/,
];

/** Whether a file is collected for findings only, and kept out of the aggregate. */
export function isFindingsOnlyFile(filePath: string): boolean {
  const basename = path.basename(filePath);
  return EXCLUDE_FILE_PATTERNS.some(p => p.test(basename));
}

export interface FindFilesOptions {
  /** Include test, story and declaration files (default: false) */
  includeFindingsOnlyFiles?: boolean;
  /** Maximum recursion depth (default: 10) */
  maxDepth?: number;
}

/**
 * Recursively collect files with one of the given extensions, skipping
 * EXCLUDE_DIRS and any dot-directory.
 */
export function findFilesByExtension(
  dir: string,
  extensions: Set<string>,
  options: FindFilesOptions = {},
  depth = 0,
): string[] {
  const { includeFindingsOnlyFiles = false, maxDepth = 10 } = options;
  if (depth > maxDepth) return [];

  const results: string[] = [];

  try {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (EXCLUDE_DIRS.has(entry.name) || entry.name.startsWith('.')) {
          continue;
        }
        results.push(
          ...findFilesByExtension(
            path.join(dir, entry.name),
            extensions,
            options,
            depth + 1,
          ),
        );
      } else if (entry.isFile()) {
        if (!extensions.has(path.extname(entry.name))) continue;
        if (!includeFindingsOnlyFiles && isFindingsOnlyFile(entry.name)) {
          continue;
        }
        results.push(path.join(dir, entry.name));
      }
    }
  } catch {
    // Skip inaccessible directories
  }

  return results;
}

/**
 * The node kinds that carry the text of a template literal. A CSS-in-JS block
 * is split across these when it interpolates, so a walk has to look at all of
 * them rather than only the no-substitution case.
 */
export const TEMPLATE_TEXT_KINDS = new Set<ts.SyntaxKind>([
  ts.SyntaxKind.NoSubstitutionTemplateLiteral,
  ts.SyntaxKind.TemplateHead,
  ts.SyntaxKind.TemplateMiddle,
  ts.SyntaxKind.TemplateTail,
]);
