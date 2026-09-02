import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';
import type {
  ImportUsage,
  ImportStyle,
  SymbolType,
  FileFinding,
} from '../types';
import { resolveDesignSystemSpecifier } from './packageAnalyzer';
import {
  SOURCE_EXTENSIONS,
  findFilesByExtension,
  isFindingsOnlyFile,
} from './constants';

/** Per-file import entry before aggregation. */
interface FileImportEntry {
  packageName: string;
  deepImportPath?: string;
  symbolName: string;
  localName: string;
  symbolType: SymbolType;
  importStyle: ImportStyle;
  isAliased: boolean;
  aliasName?: string;
  filePath: string;
  lineNumber: number;
  referenceCount: number;
}

export interface AnalyzeImportsResult {
  imports: ImportUsage[];
  fileFindings: FileFinding[];
}

/**
 * Classify a symbol name into a type based on naming conventions.
 *
 * - PascalCase → component
 * - use* prefix with PascalCase → hook
 * - camelCase → util
 * - UPPER_CASE or known token names → token
 */
function classifySymbol(name: string): SymbolType {
  if (/^use[A-Z]/.test(name)) return 'hook';
  if (/^[A-Z]/.test(name)) return 'component';
  if (/^[A-Z_]+$/.test(name)) return 'token';

  // Known token exports from @entur/tokens
  const knownTokens = new Set([
    'colors',
    'space',
    'breakpoints',
    'fontSizes',
    'fontWeights',
    'lineHeights',
    'borderRadius',
    'shadows',
    'zIndex',
  ]);
  if (knownTokens.has(name)) return 'token';

  return 'util';
}

/** Classify a file path based on naming conventions. */
function classifyFile(relativePath: string): {
  isTestFile: boolean;
  isStorybookFile: boolean;
  isGeneratedFile: boolean;
} {
  const basename = path.basename(relativePath);
  return {
    isTestFile:
      /\.(test|spec)\.[jt]sx?$/.test(basename) ||
      relativePath.includes('__tests__/'),
    isStorybookFile:
      /\.(stories|story)\.[jt]sx?$/.test(basename) ||
      relativePath.includes('.storybook/'),
    isGeneratedFile:
      relativePath.includes('generated') || /\.gen\.[jt]sx?$/.test(basename),
  };
}

/**
 * Count references to a local binding name in a source file AST.
 * Walks all Identifier nodes and counts matches (subtracts 1 for the import).
 */
function countReferences(sourceFile: ts.SourceFile, localName: string): number {
  let count = 0;

  function visit(node: ts.Node): void {
    if (ts.isIdentifier(node) && node.text === localName) {
      count++;
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  // Subtract 1 for the import declaration itself
  return Math.max(0, count - 1);
}

/**
 * Extract @entur/* import entries from a single TypeScript/JavaScript source file.
 */
function analyzeFile(filePath: string, repoDir: string): FileImportEntry[] {
  const source = fs.readFileSync(filePath, 'utf-8');
  const relativePath = path.relative(repoDir, filePath);

  const sourceFile = ts.createSourceFile(
    filePath,
    source,
    ts.ScriptTarget.Latest,
    true,
  );

  const entries: FileImportEntry[] = [];

  for (const statement of sourceFile.statements) {
    if (!ts.isImportDeclaration(statement)) continue;

    const moduleSpecifier = statement.moduleSpecifier;
    if (!ts.isStringLiteral(moduleSpecifier)) continue;

    const resolved = resolveDesignSystemSpecifier(moduleSpecifier.text);
    if (!resolved) continue;
    const { packageName, deepImportPath } = resolved;

    const importClause = statement.importClause;
    if (!importClause) continue; // side-effect import: import '@entur/styles'

    const lineNumber =
      sourceFile.getLineAndCharacterOfPosition(statement.getStart()).line + 1;

    // Default import: import Button from '@entur/button'
    if (importClause.name) {
      const localName = importClause.name.text;
      entries.push({
        packageName,
        deepImportPath,
        symbolName: 'default',
        localName,
        symbolType: classifySymbol(localName),
        importStyle: 'default',
        isAliased: false,
        aliasName: undefined,
        filePath: relativePath,
        lineNumber,
        referenceCount: countReferences(sourceFile, localName),
      });
    }

    const namedBindings = importClause.namedBindings;
    if (!namedBindings) continue;

    // Namespace import: import * as Icons from '@entur/icons'
    if (ts.isNamespaceImport(namedBindings)) {
      const localName = namedBindings.name.text;
      entries.push({
        packageName,
        deepImportPath,
        symbolName: '*',
        localName,
        symbolType: 'unknown',
        importStyle: 'namespace',
        isAliased: true,
        aliasName: localName,
        filePath: relativePath,
        lineNumber,
        referenceCount: countReferences(sourceFile, localName),
      });
      continue;
    }

    // Named imports: import { Button, Heading1 as H1 } from '@entur/button'
    if (ts.isNamedImports(namedBindings)) {
      for (const element of namedBindings.elements) {
        const originalName = element.propertyName
          ? element.propertyName.text
          : element.name.text;
        const localName = element.name.text;
        const isAliased = !!element.propertyName;

        entries.push({
          packageName,
          deepImportPath,
          symbolName: originalName,
          localName,
          symbolType: classifySymbol(originalName),
          importStyle: 'named',
          isAliased,
          aliasName: isAliased ? localName : undefined,
          filePath: relativePath,
          lineNumber,
          referenceCount: countReferences(sourceFile, localName),
        });
      }
    }
  }

  return entries;
}

/**
 * Aggregate per-file import entries into per-symbol ImportUsage summaries.
 */
function aggregateImports(entries: FileImportEntry[]): ImportUsage[] {
  const map = new Map<string, ImportUsage>();
  const filesByKey = new Map<string, Set<string>>();

  for (const entry of entries) {
    // The subpath is part of the key: Link from @entur/typography and Link from
    // @entur/typography/beta are different symbols despite the shared root.
    const key = `${entry.packageName}${entry.deepImportPath ?? ''}::${
      entry.symbolName
    }`;
    const existing = map.get(key);

    if (existing) {
      existing.referenceCount += entry.referenceCount;
      filesByKey.get(key)!.add(entry.filePath);
      existing.filesUsedIn = filesByKey.get(key)!.size;
    } else {
      filesByKey.set(key, new Set([entry.filePath]));
      map.set(key, {
        packageName: entry.packageName,
        deepImportPath: entry.deepImportPath,
        symbolName: entry.symbolName,
        symbolType: entry.symbolType,
        importStyle: entry.importStyle,
        isAliased: entry.isAliased,
        aliasName: entry.aliasName,
        referenceCount: entry.referenceCount,
        filesUsedIn: 1,
      });
    }
  }

  // Sort by reference count descending
  return Array.from(map.values()).sort(
    (a, b) => b.referenceCount - a.referenceCount,
  );
}

/**
 * Convert per-file import entries to FileFinding objects.
 */
function entriesToFileFindings(entries: FileImportEntry[]): FileFinding[] {
  return entries.map(entry => {
    const classification = classifyFile(entry.filePath);
    return {
      filePath: entry.filePath,
      fileExtension: path.extname(entry.filePath),
      packageName: entry.packageName,
      symbolName: entry.symbolName,
      findingType: 'import' as const,
      lineNumber: entry.lineNumber,
      ...classification,
    };
  });
}

/**
 * Analyze a repository for non-JSX @entur/* import usage using TypeScript AST.
 *
 * This fills the blind spot where react-scanner only detects JSX component renders.
 * The import analyzer catches:
 * - Hooks (useContrast, useMediaQuery)
 * - Tokens (colors, space, breakpoints)
 * - Utilities (getTextColor, debounce)
 * - Components imported but used programmatically (not as JSX)
 */
export async function analyzeImports(
  repoDir: string,
  includeFileFindings = false,
): Promise<AnalyzeImportsResult> {
  try {
    const sourceFiles = findFilesByExtension(repoDir, SOURCE_EXTENSIONS, {
      includeFindingsOnlyFiles: includeFileFindings,
    });

    const allEntries: FileImportEntry[] = [];

    for (const filePath of sourceFiles) {
      try {
        const fileEntries = analyzeFile(filePath, repoDir);
        allEntries.push(...fileEntries);
      } catch {
        // Skip files that fail to parse
      }
    }

    // includeFileFindings widens the crawl to test, story and declaration files;
    // excluding them here keeps aggregateImports comparable across scans.
    const imports = aggregateImports(
      includeFileFindings
        ? allEntries.filter(entry => !isFindingsOnlyFile(entry.filePath))
        : allEntries,
    );
    const fileFindings = includeFileFindings
      ? entriesToFileFindings(allEntries)
      : [];

    return { imports, fileFindings };
  } catch (error) {
    console.warn(
      `  [import-analyzer] Analysis failed for ${path.basename(repoDir)}:`,
      error instanceof Error ? error.message : error,
    );
    return { imports: [], fileFindings: [] };
  }
}
