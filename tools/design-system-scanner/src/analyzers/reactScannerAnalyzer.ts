import * as path from 'path';
import type { ComponentUsage, FileFinding, ImportStyle } from '../types';
import {
  DESIGN_SYSTEM_PACKAGES,
  resolveDesignSystemSpecifier,
  symbolKey,
} from './packageAnalyzer';
import { EXCLUDE_DIRS } from './constants';

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
 * The exported name react-scanner's component key stands for.
 *
 * Named imports arrive resolved: an aliased `Heading as H` is keyed as
 * `Heading`, and a dot in the key is a real sub-component (`Expandable.Header`)
 * that has to survive. A namespace import has no export name to resolve, so
 * react-scanner keys it by the JSX expression instead and the local binding
 * ends up in front: `import * as Typo` renders as `Typo.Heading1`. Only that
 * prefix is dropped, or the classifier would see a name it cannot place.
 */
export function exportedComponentName(
  componentName: string,
  importStyle: ImportStyle,
  local: string | undefined,
): string {
  if (importStyle !== 'namespace') return componentName;
  if (local && componentName.startsWith(`${local}.`)) {
    return componentName.slice(local.length + 1);
  }
  // No local binding to match on; the namespace is still the first segment
  const firstDot = componentName.indexOf('.');
  return firstDot === -1 ? componentName : componentName.slice(firstDot + 1);
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

/** Import details of one instance, resolved from its own import. */
interface ResolvedImport {
  packageName: string;
  deepImportPath?: string;
  importStyle: ImportStyle;
  local?: string;
  isAliased: boolean;
  exportedName: string;
}

function resolveInstanceImport(
  componentName: string,
  instance: ScannerInstance,
): ResolvedImport {
  const importInfo = instance.importInfo;
  const moduleName = importInfo?.moduleName;
  // packageName is the root package; the subpath lives in deepImportPath only
  const resolved = moduleName ? resolveDesignSystemSpecifier(moduleName) : null;
  const importStyle = mapImportStyle(importInfo?.importType);
  const imported = importInfo?.imported;
  const local = importInfo?.local;
  return {
    packageName: resolved?.packageName ?? moduleName ?? 'unknown',
    deepImportPath: resolved?.deepImportPath,
    importStyle,
    local,
    isAliased: !!(imported && local && imported !== local),
    exportedName: exportedComponentName(componentName, importStyle, local),
  };
}

interface UsageGroup {
  first: ResolvedImport;
  instances: ScannerInstance[];
}

/**
 * Create a react-scanner processor that shapes output into our types.
 *
 * react-scanner groups instances by component name only, so they are regrouped
 * by (package, subpath, export name): Link from @entur/typography and from
 * @entur/typography/beta are different components.
 *
 * @param repoDir - Absolute path to the repository root (for relative path computation)
 * @param includeFileFindings - Whether to collect per-file findings
 */
function createEnturProcessor(repoDir: string, includeFileFindings: boolean) {
  return function enturProcessor({
    forEachComponent,
  }: ProcessorHelpers): AnalyzeComponentsResult {
    const groups = new Map<string, UsageGroup>();
    const fileFindings: FileFinding[] = [];

    forEachComponent(({ componentName, component }) => {
      for (const instance of component.instances || []) {
        const resolved = resolveInstanceImport(componentName, instance);
        const key = symbolKey(
          resolved.packageName,
          resolved.deepImportPath,
          resolved.exportedName,
        );
        const group = groups.get(key);
        if (group) group.instances.push(instance);
        else groups.set(key, { first: resolved, instances: [instance] });

        const absFile = instance.location?.file;
        if (includeFileFindings && absFile) {
          const relativePath = path.relative(repoDir, absFile);
          fileFindings.push({
            filePath: relativePath,
            fileExtension: path.extname(absFile),
            packageName: resolved.packageName,
            symbolName: resolved.exportedName,
            findingType: resolved.deepImportPath ? 'deep_import' : 'jsx_usage',
            lineNumber: instance.location?.start?.line,
            ...classifyFile(relativePath),
          });
        }
      }
    });

    const components: ComponentUsage[] = [];

    for (const { first, instances } of groups.values()) {
      const propCounts: Record<string, number> = {};
      let spreadCount = 0;
      const files = new Set<string>();

      for (const instance of instances) {
        if (instance.propsSpread) spreadCount++;
        for (const propName of Object.keys(instance.props || {})) {
          propCounts[propName] = (propCounts[propName] || 0) + 1;
        }
        const absFile = instance.location?.file;
        if (absFile) files.add(path.basename(absFile));
      }

      components.push({
        componentName: first.exportedName,
        packageName: first.packageName,
        instanceCount: instances.length,
        props: propCounts,
        propsSpreadCount: spreadCount,
        files: [...files],
        importStyle: first.importStyle,
        isAliased: first.isAliased,
        aliasName: first.isAliased ? first.local : undefined,
        deepImportPath: first.deepImportPath,
      });
    }

    // Sort by instance count descending
    components.sort((a, b) => b.instanceCount - a.instanceCount);
    return { components, fileFindings };
  };
}

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
