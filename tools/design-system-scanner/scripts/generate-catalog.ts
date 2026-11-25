#!/usr/bin/env tsx
/**
 * Catalog generator for the design system usage scanner.
 *
 * Reads each @entur/* package's TypeScript source and extracts all exported
 * symbol names along with their self-defined props (props whose declarations
 * live inside the package source, not in node_modules). Subpath entry points
 * such as `@entur/typography/beta` get their own entry.
 *
 * Usage:
 *   tsx scripts/generate-catalog.ts --packages-root ../../packages --output catalog.json
 */
import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

// ── CLI args ──────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
let packagesRoot = '../../packages';
let outputPath = 'catalog.json';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--packages-root') packagesRoot = args[++i];
  else if (args[i] === '--output') outputPath = args[++i];
}

const resolvedPackagesRoot = path.resolve(packagesRoot);
const resolvedOutput = path.resolve(outputPath);

// ── Package list (mirrors DESIGN_SYSTEM_PACKAGES in packageAnalyzer.ts) ──────

const DESIGN_SYSTEM_PACKAGES = [
  '@entur/a11y',
  '@entur/alert',
  '@entur/button',
  '@entur/chip',
  '@entur/datepicker',
  '@entur/dropdown',
  '@entur/expand',
  '@entur/fileupload',
  '@entur/form',
  '@entur/grid',
  '@entur/icons',
  '@entur/layout',
  '@entur/loader',
  '@entur/menu',
  '@entur/modal',
  '@entur/styles',
  '@entur/tab',
  '@entur/table',
  '@entur/tokens',
  '@entur/tooltip',
  '@entur/travel',
  '@entur/typography',
  '@entur/utils',
];

// ── Types ─────────────────────────────────────────────────────────────────────

type SymbolType = 'component' | 'hook' | 'util' | 'token' | 'unknown';

interface CatalogSymbol {
  symbolName: string;
  symbolType: SymbolType;
  knownProps: string[];
  enumProps: string[];
  deprecated: boolean;
  deprecatedProps: string[];
}

interface CatalogPackage {
  packageName: string;
  deepImportPath?: string;
  latestVersion: string | null;
  symbols: CatalogSymbol[];
}

interface DesignSystemCatalog {
  packages: CatalogPackage[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function classifySymbol(name: string): SymbolType {
  if (name.startsWith('use') && name[3] === name[3]?.toUpperCase())
    return 'hook';
  if (name[0] === name[0]?.toUpperCase() && name[0] !== name[0]?.toLowerCase())
    return 'component';
  if (name === name.toUpperCase() && name.length > 1) return 'token';
  return 'util';
}

/**
 * Given a resolved type, extract property names whose declarations live inside
 * the design system's packages directory (i.e. self-defined props, not inherited
 * HTML/React/CSS props from node_modules).
 */
function getSelfDefinedProps(
  type: ts.Type,
  checker: ts.TypeChecker,
  packagesRootNorm: string,
): ts.Symbol[] {
  const props: ts.Symbol[] = [];
  for (const symbol of checker.getPropertiesOfType(type)) {
    const decl = symbol.declarations?.[0];
    if (!decl) continue;
    const fileName = decl.getSourceFile().fileName.replace(/\\/g, '/');
    if (
      fileName.startsWith(packagesRootNorm) ||
      fileName.includes('/node_modules/@entur/')
    ) {
      props.push(symbol);
    }
  }
  return props;
}

const ENUM_MEMBER_FLAGS =
  ts.TypeFlags.StringLiteral |
  ts.TypeFlags.NumberLiteral |
  ts.TypeFlags.BooleanLiteral;
const NULLISH_FLAGS = ts.TypeFlags.Undefined | ts.TypeFlags.Null;

/** Whether a prop's type is a union of string/number literals or boolean. */
function isEnumLikeProp(symbol: ts.Symbol, checker: ts.TypeChecker): boolean {
  const type = checker.getTypeOfSymbol(symbol);
  const members = (type.isUnion() ? type.types : [type]).filter(
    member => !(member.flags & NULLISH_FLAGS),
  );
  return (
    members.length > 0 &&
    members.every(member => (member.flags & ENUM_MEMBER_FLAGS) !== 0)
  );
}

function isDeprecated(symbol: ts.Symbol, checker: ts.TypeChecker): boolean {
  return symbol.getJsDocTags(checker).some(tag => tag.name === 'deprecated');
}

/** Props from a component's first parameter, for props types without an XProps name. */
function propsTypeFromSignature(
  componentType: ts.Type,
  checker: ts.TypeChecker,
): ts.Type | null {
  const param = componentType.getCallSignatures()[0]?.getParameters()[0];
  return param ? checker.getTypeOfSymbol(param) : null;
}

/** Static component members, e.g. `Item` in `Object.assign(Root, { Item })`. */
function findSubcomponents(
  componentType: ts.Type,
  checker: ts.TypeChecker,
): ts.Symbol[] {
  return checker
    .getPropertiesOfType(componentType)
    .filter(
      member =>
        /^[A-Z]/.test(member.getName()) &&
        !['Provider', 'Consumer'].includes(member.getName()) &&
        checker.getTypeOfSymbol(member).getCallSignatures().length > 0,
    );
}

/** Subpath entry points (e.g. "/beta") with a src/<subpath>/index.ts(x). */
function findSubpathEntryPoints(packageDir: string): string[] {
  const manifestPath = path.join(packageDir, 'package.json');
  if (!fs.existsSync(manifestPath)) return [];
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8')) as {
    exports?: Record<string, unknown>;
  };
  return Object.keys(manifest.exports ?? {})
    .filter(key => /^\.\/[\w-]+$/.test(key))
    .map(key => key.slice(1))
    .filter(subpath => findIndex(path.join(packageDir, 'src', subpath)));
}

function findIndex(srcDir: string): string | null {
  for (const file of ['index.tsx', 'index.ts']) {
    const candidate = path.join(srcDir, file);
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

/**
 * Resolve @entur/* imports to source, not dist, so cross-package types such
 * as `FeedbackAnnouncementProps` from @entur/form resolve without a build.
 */
function buildPathMappings(): Record<string, string[]> {
  const paths: Record<string, string[]> = {};
  for (const packageName of DESIGN_SYSTEM_PACKAGES) {
    const packageDir = path.join(
      resolvedPackagesRoot,
      packageName.replace('@entur/', ''),
    );
    for (const subpath of ['', ...findSubpathEntryPoints(packageDir)]) {
      const index = findIndex(path.join(packageDir, 'src', subpath));
      if (index) paths[packageName + subpath] = [index];
    }
  }
  return paths;
}

let pathMappings: Record<string, string[]> | undefined;

// ── Main ──────────────────────────────────────────────────────────────────────

function processPackage(
  packageName: string,
  deepImportPath?: string,
): CatalogPackage | null {
  const shortName = packageName.replace('@entur/', '');
  const srcDir = path.join(
    resolvedPackagesRoot,
    shortName,
    'src',
    deepImportPath ?? '',
  );
  const indexPath = findIndex(srcDir);

  if (!indexPath) {
    console.warn(
      `  Skipping ${packageName}: no index.tsx/ts found in ${srcDir}`,
    );
    return null;
  }

  const compilerOptions: ts.CompilerOptions = {
    strict: false,
    jsx: ts.JsxEmit.React,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    esModuleInterop: true,
    allowSyntheticDefaultImports: true,
    skipLibCheck: true,
    noEmit: true,
    paths: (pathMappings ??= buildPathMappings()),
  };

  const program = ts.createProgram([indexPath], compilerOptions);
  const checker = program.getTypeChecker();
  const sourceFile = program.getSourceFile(indexPath);

  if (!sourceFile) {
    console.warn(`  Skipping ${packageName}: could not parse source file`);
    return null;
  }

  // Normalize packages root path for prefix matching
  const packagesRootNorm = resolvedPackagesRoot.replace(/\\/g, '/');

  // Get all exports from this module
  const moduleSymbol = checker.getSymbolAtLocation(sourceFile);
  if (!moduleSymbol) {
    console.warn(`  Skipping ${packageName}: no module symbol`);
    return null;
  }

  /** XBaseProps or XOwnProps (self-defined) before XProps, by name. */
  function findNamedPropsType(name: string): ts.Type | null {
    const preferredNames = [`${name}BaseProps`, `${name}OwnProps`];
    let propsType: ts.Type | null = null;
    for (const sf of program.getSourceFiles()) {
      if (sf.isDeclarationFile) continue;
      if (!sf.fileName.replace(/\\/g, '/').startsWith(packagesRootNorm)) {
        continue;
      }
      for (const stmt of sf.statements) {
        if (
          !ts.isTypeAliasDeclaration(stmt) &&
          !ts.isInterfaceDeclaration(stmt)
        ) {
          continue;
        }
        if (preferredNames.includes(stmt.name.text)) {
          return checker.getTypeAtLocation(stmt);
        }
        if (propsType === null && stmt.name.text === `${name}Props`) {
          propsType = checker.getTypeAtLocation(stmt);
        }
      }
    }
    return propsType;
  }

  function describeProps(propsType: ts.Type | null) {
    const props = propsType
      ? getSelfDefinedProps(propsType, checker, packagesRootNorm)
      : [];
    return {
      knownProps: props.map(prop => prop.getName()),
      enumProps: props
        .filter(prop => isEnumLikeProp(prop, checker))
        .map(prop => prop.getName()),
      deprecatedProps: props
        .filter(prop => isDeprecated(prop, checker))
        .map(prop => prop.getName()),
    };
  }

  const exportedSymbols = checker.getExportsOfModule(moduleSymbol);
  const symbols: CatalogSymbol[] = [];
  const seenNames = new Set<string>();

  for (const exportSymbol of exportedSymbols) {
    const name = exportSymbol.getName();

    // Skip duplicates and internal/type-only exports
    if (seenNames.has(name)) continue;

    // Skip type-only names that end with 'Props', 'Type', 'Options', etc.
    // We want value exports (components, hooks, utils, tokens)
    // `export { X } from './X'` is an alias; check what it points to
    const target =
      exportSymbol.flags & ts.SymbolFlags.Alias
        ? checker.getAliasedSymbol(exportSymbol)
        : exportSymbol;
    // Unresolved targets (e.g. gitignored generated tokens) keep the specifier
    const decl = target.declarations?.[0] ?? exportSymbol.declarations?.[0];
    if (!decl) continue;
    if (
      ts.isExportSpecifier(decl) &&
      (decl.isTypeOnly || decl.parent.parent.isTypeOnly)
    ) {
      continue;
    }

    // Skip pure type alias / interface declarations (not runtime values)
    if (ts.isTypeAliasDeclaration(decl) || ts.isInterfaceDeclaration(decl)) {
      continue;
    }

    seenNames.add(name);
    const symbolType = classifySymbol(name);
    const deprecated = isDeprecated(target, checker);

    if (symbolType !== 'component') {
      symbols.push({
        symbolName: name,
        symbolType,
        knownProps: [],
        enumProps: [],
        deprecated,
        deprecatedProps: [],
      });
      continue;
    }

    const componentType = checker.getTypeOfSymbol(target);
    const propsType =
      findNamedPropsType(name) ??
      propsTypeFromSignature(componentType, checker);
    symbols.push({
      symbolName: name,
      symbolType,
      ...describeProps(propsType),
      deprecated,
    });

    // `Object.assign(Root, { Item })` renders as <Root.Item>
    for (const sub of findSubcomponents(componentType, checker)) {
      symbols.push({
        symbolName: `${name}.${sub.getName()}`,
        symbolType: 'component',
        ...describeProps(
          propsTypeFromSignature(checker.getTypeOfSymbol(sub), checker),
        ),
        deprecated: deprecated || isDeprecated(sub, checker),
      });
    }
  }

  // Sort symbols alphabetically for stable output
  symbols.sort((a, b) => a.symbolName.localeCompare(b.symbolName));

  return {
    packageName,
    ...(deepImportPath && { deepImportPath }),
    latestVersion: null,
    symbols,
  };
}

/**
 * Fetch the latest published version for an npm package.
 * Returns null on any network or parse error.
 * Written to catalog.json but excluded from verify-catalog diffs (since it changes on every npm publish).
 */
async function fetchLatestVersion(packageName: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://registry.npmjs.org/${encodeURIComponent(packageName)}/latest`,
    );
    if (!response.ok) return null;
    const data = (await response.json()) as { version?: string };
    return data.version ?? null;
  } catch {
    return null;
  }
}

async function main(): Promise<void> {
  console.log(`Generating catalog from ${resolvedPackagesRoot}...`);

  // Fetch all latest versions in parallel
  console.log('Fetching latest npm versions...');
  const versionEntries = await Promise.all(
    DESIGN_SYSTEM_PACKAGES.map(async name => {
      const version = await fetchLatestVersion(name);
      return [name, version] as const;
    }),
  );
  const latestVersions = new Map(versionEntries);

  const catalog: DesignSystemCatalog = { packages: [] };

  for (const packageName of DESIGN_SYSTEM_PACKAGES) {
    const packageDir = path.join(
      resolvedPackagesRoot,
      packageName.replace('@entur/', ''),
    );
    for (const deepImportPath of [
      undefined,
      ...findSubpathEntryPoints(packageDir),
    ]) {
      process.stdout.write(`  ${packageName}${deepImportPath ?? ''}...`);
      const result = processPackage(packageName, deepImportPath);
      if (result) {
        result.latestVersion = latestVersions.get(packageName) ?? null;
        catalog.packages.push(result);
        const versionStr = result.latestVersion
          ? ` (latest: ${result.latestVersion})`
          : '';
        console.log(` ${result.symbols.length} symbols${versionStr}`);
      } else {
        console.log(' skipped');
      }
    }
  }

  fs.writeFileSync(resolvedOutput, JSON.stringify(catalog, null, 2) + '\n');
  console.log(`\nCatalog written to ${resolvedOutput}`);

  const totalSymbols = catalog.packages.reduce(
    (sum, p) => sum + p.symbols.length,
    0,
  );
  console.log(
    `Total: ${catalog.packages.length} packages, ${totalSymbols} symbols`,
  );
}

main();
