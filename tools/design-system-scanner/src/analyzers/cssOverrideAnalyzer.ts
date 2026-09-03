import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';
import type { CssOverrideFinding, OverrideSource } from '../types';
import {
  SOURCE_EXTENSIONS,
  STYLE_EXTENSIONS,
  TEMPLATE_TEXT_KINDS,
  findFilesByExtension,
} from './constants';
import type { StyleCatalogIndex } from './styleCatalog';

/** Matches an .eds-* class selector, e.g. in `.eds-heading { ... }`. */
const EDS_SELECTOR_PATTERN = /\.(eds-[a-zA-Z0-9_-]+)/g;

/** Matches a bare eds-* class token, e.g. in `className="eds-heading foo"`. */
const EDS_CLASS_TOKEN_PATTERN = /(?:^|[\s"'`])(eds-[a-zA-Z0-9_-]+)/g;

/**
 * Documented public API rather than an internal class: consumers are told to put
 * `eds-contrast` on a wrapper to switch a subtree to contrast colours, so seeing
 * it in a className is expected usage, not going behind a component's back.
 */
const PUBLIC_CLASS_NAMES = new Set(['eds-contrast']);

export interface AnalyzeCssOverridesResult {
  findings: CssOverrideFinding[];
  /** Number of stylesheet files inspected (for the repo-level rollup) */
  styleFilesScanned: number;
}

function classify(
  className: string,
  catalog: StyleCatalogIndex | null,
): Pick<CssOverrideFinding, 'packageName' | 'baseClass' | 'classGeneration'> {
  if (!catalog) {
    return { packageName: null, baseClass: null, classGeneration: 'unknown' };
  }
  const result = catalog.classifyClass(className);
  return {
    packageName: result.packageName,
    baseClass: result.baseClass,
    classGeneration: result.generation,
  };
}

// ── Stylesheets ─────────────────────────────────────────────────────────────

function scanStylesheet(
  filePath: string,
  repoDir: string,
  catalog: StyleCatalogIndex | null,
  findings: CssOverrideFinding[],
): void {
  let content: string;
  try {
    content = fs.readFileSync(filePath, 'utf-8');
  } catch {
    return;
  }

  const relPath = path.relative(repoDir, filePath);
  const fileExtension = path.extname(filePath);
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    EDS_SELECTOR_PATTERN.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = EDS_SELECTOR_PATTERN.exec(lines[i])) !== null) {
      findings.push({
        selector: `.${match[1]}`,
        filePath: relPath,
        lineNumber: i + 1,
        fileExtension,
        source: 'stylesheet',
        ...classify(match[1], catalog),
      });
    }
  }
}

// ── CSS-in-JS and className strings ─────────────────────────────────────────

function lineOf(sourceFile: ts.SourceFile, position: number): number {
  return sourceFile.getLineAndCharacterOfPosition(position).line + 1;
}

function pushMatches(
  text: string,
  pattern: RegExp,
  baseOffset: number,
  sourceFile: ts.SourceFile,
  relPath: string,
  fileExtension: string,
  source: OverrideSource,
  catalog: StyleCatalogIndex | null,
  findings: CssOverrideFinding[],
): void {
  pattern.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    const className = match[1];
    if (source === 'jsx-classname' && PUBLIC_CLASS_NAMES.has(className)) {
      continue;
    }
    findings.push({
      selector: `.${className}`,
      filePath: relPath,
      lineNumber: lineOf(sourceFile, baseOffset + match.index),
      fileExtension,
      source,
      ...classify(className, catalog),
    });
  }
}

/** Read a className attribute's literal text, when it has any. */
function classNameLiterals(
  attribute: ts.JsxAttribute,
): Array<{ text: string; start: number }> {
  const initializer = attribute.initializer;
  if (!initializer) return [];

  const literals: Array<{ text: string; start: number }> = [];

  const collect = (node: ts.Node): void => {
    if (ts.isStringLiteral(node)) {
      literals.push({ text: node.text, start: node.getStart() + 1 });
    } else if (TEMPLATE_TEXT_KINDS.has(node.kind)) {
      const literal = node as ts.LiteralLikeNode;
      literals.push({ text: literal.text, start: node.getStart() + 1 });
    } else {
      ts.forEachChild(node, collect);
    }
  };

  collect(initializer);
  return literals;
}

function scanSourceFile(
  filePath: string,
  repoDir: string,
  catalog: StyleCatalogIndex | null,
  findings: CssOverrideFinding[],
): void {
  let content: string;
  try {
    content = fs.readFileSync(filePath, 'utf-8');
  } catch {
    return;
  }

  // Cheap pre-filter: parsing every source file of every repo to find nothing
  // would dominate the scan.
  if (!content.includes('eds-')) return;

  const relPath = path.relative(repoDir, filePath);
  const fileExtension = path.extname(filePath);

  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true,
  );

  const visit = (node: ts.Node): void => {
    // styled-components / emotion and any other tagged or plain template literal
    if (TEMPLATE_TEXT_KINDS.has(node.kind)) {
      const literal = node as ts.LiteralLikeNode;
      pushMatches(
        literal.text,
        EDS_SELECTOR_PATTERN,
        node.getStart() + 1,
        sourceFile,
        relPath,
        fileExtension,
        'css-in-js',
        catalog,
        findings,
      );
    }

    // className="eds-heading" — hand-written internal class names in markup
    if (
      ts.isJsxAttribute(node) &&
      ts.isIdentifier(node.name) &&
      (node.name.text === 'className' || node.name.text === 'class')
    ) {
      for (const { text, start } of classNameLiterals(node)) {
        pushMatches(
          text,
          EDS_CLASS_TOKEN_PATTERN,
          start,
          sourceFile,
          relPath,
          fileExtension,
          'jsx-classname',
          catalog,
          findings,
        );
      }
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
}

/**
 * Scan a repository for uses of the design system's internal .eds-* class names.
 *
 * Three sources are covered, each recorded on the finding:
 * - `stylesheet`   — .eds-* selectors in .css/.scss/.sass/.less
 * - `css-in-js`    — .eds-* selectors inside template literals (styled-components,
 *                    emotion, or any other tagged template)
 * - `jsx-classname` — bare eds-* tokens in a className/class attribute
 *
 * Findings are classified against the style catalogue, so an override can be
 * attributed to the owning package and to the generation of styles it targets
 * (legacy vs beta). Classification is an exact class-name lookup with a
 * base-class fallback — a prefix match would report `.eds-textfield__wrapper`
 * as a hit on typography's `.eds-text`.
 *
 * Known limitations:
 * - Stylesheets are scanned line by line, so a captured selector is the text on
 *   that line only, not the full expanded/nested selector.
 * - May match .eds-* inside CSS comments or string values (e.g. content: ".eds-foo").
 * - Class names assembled at runtime from fragments are invisible.
 */
export function analyzeCssOverrides(
  repoDir: string,
  catalog: StyleCatalogIndex | null = null,
): AnalyzeCssOverridesResult {
  const findings: CssOverrideFinding[] = [];

  const styleFiles = findFilesByExtension(repoDir, STYLE_EXTENSIONS, {
    includeFindingsOnlyFiles: true,
  });
  for (const filePath of styleFiles) {
    scanStylesheet(filePath, repoDir, catalog, findings);
  }

  for (const filePath of findFilesByExtension(repoDir, SOURCE_EXTENSIONS)) {
    try {
      scanSourceFile(filePath, repoDir, catalog, findings);
    } catch {
      // Skip files that fail to parse
    }
  }

  return { findings, styleFilesScanned: styleFiles.length };
}
