import * as fs from 'fs';
import * as path from 'path';
import type { CssOverrideFinding } from '../types';
import { EXCLUDE_DIRS } from './constants';

/** File extensions to scan for CSS overrides. */
const CSS_EXTENSIONS = new Set(['.css', '.scss', '.sass', '.less']);

/** Regex to find .eds-* class selectors on a line. */
const EDS_SELECTOR_PATTERN = /\.eds-[a-zA-Z0-9_-]+/g;

/**
 * Collect all CSS/SCSS/LESS files in a directory tree, excluding common
 * non-source directories. Handles .module.* variants automatically since
 * we match by extension suffix.
 */
function findStyleFiles(dir: string): string[] {
  const files: string[] = [];
  try {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (!EXCLUDE_DIRS.has(entry.name)) {
          files.push(...findStyleFiles(path.join(dir, entry.name)));
        }
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        if (CSS_EXTENSIONS.has(ext)) {
          files.push(path.join(dir, entry.name));
        }
      }
    }
  } catch {
    // Skip inaccessible directories
  }
  return files;
}

export interface AnalyzeCssOverridesResult {
  findings: CssOverrideFinding[];
}

/**
 * Scan a repository for .eds-* CSS selector overrides.
 *
 * Walks all CSS/SCSS/SASS/LESS files and finds lines containing .eds-* class
 * selectors, which indicate consumers overriding design system styles.
 *
 * Known limitations:
 * - SCSS nesting: scans line-by-line, so the captured selector is the text on
 *   that line only, not the full expanded/nested selector.
 * - May match .eds-* inside CSS comments or string values (e.g. content: ".eds-foo").
 *   False positives are rare enough not to warrant a full CSS parser.
 */
export function analyzeCssOverrides(
  repoDir: string,
): AnalyzeCssOverridesResult {
  const findings: CssOverrideFinding[] = [];
  const styleFiles = findStyleFiles(repoDir);

  for (const filePath of styleFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');
      const relPath = path.relative(repoDir, filePath);
      const fileExtension = path.extname(filePath);

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        EDS_SELECTOR_PATTERN.lastIndex = 0;
        let match: RegExpExecArray | null;
        while ((match = EDS_SELECTOR_PATTERN.exec(line)) !== null) {
          findings.push({
            selector: match[0],
            filePath: relPath,
            lineNumber: i + 1,
            fileExtension,
          });
        }
      }
    } catch {
      // Skip unreadable files
    }
  }

  return { findings };
}
