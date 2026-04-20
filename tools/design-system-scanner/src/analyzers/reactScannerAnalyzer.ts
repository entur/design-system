import * as path from 'path';
import type { ComponentUsage, FileFinding, ImportStyle } from '../types';
import { DESIGN_SYSTEM_PACKAGES } from './packageAnalyzer';

interface ScannerInstance {
  importInfo?: {
    imported?: string;
    local?: string;
    moduleName?: string;
    importType?: string;
  };
  props?: Record<string, unknown>;
  propsSpread?: boolean;
  location?: {
    file?: string;
    start?: { line: number; column: number };
  };
}

interface ScannerComponent {
  instances: ScannerInstance[];
}

interface ForEachComponentEntry {
  componentName: string;
  component: ScannerComponent;
}

interface ProcessorHelpers {
  forEachComponent: (callback: (entry: ForEachComponentEntry) => void) => void;
}

export interface AnalyzeComponentsResult {
  components: ComponentUsage[];
  fileFindings: FileFinding[];
}

/** Map react-scanner importType string to our ImportStyle type. */
function mapImportStyle(importType?: string): ImportStyle {
  switch (importType) {
    case 'ImportSpecifier':
      return 'named';
    case 'ImportDefaultSpecifier':
      return 'default';
    case 'ImportNamespaceSpecifier':
      return 'namespace';
    default:
      return 'unknown';
  }
}

/**
 * Extract the deep import subpath from a module name.
 * E.g., "@entur/layout/beta" → "/beta", "@entur/button" → undefined
 */
function extractDeepImportPath(moduleName: string): string | undefined {
  for (const pkg of DESIGN_SYSTEM_PACKAGES) {
    if (moduleName.startsWith(pkg) && moduleName.length > pkg.length) {
      return moduleName.slice(pkg.length);
    }
  }
  return undefined;
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
 * Create a react-scanner processor that shapes output into our types.
 *
 * @param repoDir - Absolute path to the repository root (for relative path computation)
 * @param includeFileFindings - Whether to collect per-file findings
 */
function createEnturProcessor(repoDir: string, includeFileFindings: boolean) {
  return function enturProcessor({
    forEachComponent,
  }: ProcessorHelpers): AnalyzeComponentsResult {
    const components: ComponentUsage[] = [];
    const fileFindings: FileFinding[] = [];

    forEachComponent(({ componentName, component }) => {
      const instances = component.instances || [];
      if (instances.length === 0) return;

      // Count prop usage across all instances
      const propCounts: Record<string, number> = {};
      let spreadCount = 0;

      for (const instance of instances) {
        if (instance.propsSpread) spreadCount++;
        for (const propName of Object.keys(instance.props || {})) {
          propCounts[propName] = (propCounts[propName] || 0) + 1;
        }
      }

      // Derive fields from the first instance's importInfo
      const firstInstance = instances[0];
      const importInfo = firstInstance?.importInfo;
      const packageName = importInfo?.moduleName || 'unknown';
      const importStyle = mapImportStyle(importInfo?.importType);
      const imported = importInfo?.imported;
      const local = importInfo?.local;
      const isAliased = !!(imported && local && imported !== local);
      const deepImportPath = importInfo?.moduleName
        ? extractDeepImportPath(importInfo.moduleName)
        : undefined;

      // Collect file paths (basenames for ComponentUsage, relative for findings)
      const fileSet = new Set<string>();
      const files: string[] = [];

      for (const instance of instances) {
        const absFile = instance.location?.file;
        if (!absFile) continue;

        const basename = path.basename(absFile);
        if (!fileSet.has(basename)) {
          fileSet.add(basename);
          files.push(basename);
        }

        if (includeFileFindings) {
          const relativePath = path.relative(repoDir, absFile);
          const classification = classifyFile(relativePath);
          fileFindings.push({
            filePath: relativePath,
            fileExtension: path.extname(absFile),
            packageName,
            symbolName: componentName,
            findingType: deepImportPath ? 'deep_import' : 'jsx_usage',
            lineNumber: instance.location?.start?.line,
            ...classification,
          });
        }
      }

      components.push({
        componentName,
        packageName,
        instanceCount: instances.length,
        props: propCounts,
        propsSpreadCount: spreadCount,
        files,
        importStyle,
        isAliased,
        aliasName: isAliased ? local : undefined,
        deepImportPath,
      });
    });

    // Sort by instance count descending
    components.sort((a, b) => b.instanceCount - a.instanceCount);
    return { components, fileFindings };
  };
}

/** Directories to exclude from react-scanner crawl. */
const EXCLUDE_DIRS = new Set([
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

/**
 * Build a regex that matches design system package imports,
 * including subpath imports (e.g. @entur/layout/beta).
 */
function buildDesignSystemImportPattern(): RegExp {
  const escaped = [...DESIGN_SYSTEM_PACKAGES].map(p =>
    p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
  );
  return new RegExp(`^(${escaped.join('|')})(\/.*)?$`);
}

/**
 * Analyze a repository directory for @entur/* component usage using react-scanner.
 *
 * Uses Babel AST parsing (via react-scanner) for accurate detection of:
 * - Component JSX instances (actual renders, not just imports)
 * - Prop usage per component
 * - Spread prop detection
 * - Import style, alias, and deep import information
 *
 * Known limitations:
 * - Re-exports through barrel files are NOT followed
 * - React.lazy() dynamic imports are invisible
 * - Aliased imports are tracked as separate component names
 */
export async function analyzeComponents(
  repoDir: string,
  includeFileFindings = false,
): Promise<AnalyzeComponentsResult> {
  try {
    // Dynamic import — react-scanner is ESM-only in some versions
    const scanner = await import('react-scanner');
    const run = scanner.default?.run ?? scanner.run;

    if (typeof run !== 'function') {
      console.warn(
        `  [react-scanner] Could not find run() function, skipping component analysis`,
      );
      return { components: [], fileFindings: [] };
    }

    const config = {
      crawlFrom: repoDir,
      importedFrom: buildDesignSystemImportPattern(),
      includeSubComponents: true,
      exclude: (dirname: string) =>
        EXCLUDE_DIRS.has(dirname) || dirname.startsWith('.'),
      globs: ['**/!(*.test|*.spec|*.stories|*.story|*.d).@(js|ts)?(x)'],
      processors: [createEnturProcessor(repoDir, includeFileFindings)],
    };

    const result = await run(config);

    // The processor returns AnalyzeComponentsResult directly
    if (result && typeof result === 'object' && 'components' in result) {
      return result as AnalyzeComponentsResult;
    }

    return { components: [], fileFindings: [] };
  } catch (error) {
    // react-scanner can crash on unusual syntax — log and continue
    console.warn(
      `  [react-scanner] Analysis failed for ${path.basename(repoDir)}:`,
      error instanceof Error ? error.message : error,
    );
    return { components: [], fileFindings: [] };
  }
}
