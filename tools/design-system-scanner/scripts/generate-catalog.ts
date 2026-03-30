#!/usr/bin/env tsx
/**
 * Catalog generator for the design system usage scanner.
 *
 * Reads each @entur/* package's TypeScript source and extracts all exported
 * symbol names along with their self-defined props (props whose declarations
 * live inside the package source, not in node_modules).
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
}

interface CatalogPackage {
  packageName: string;
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
): string[] {
  const props: string[] = [];
  for (const symbol of checker.getPropertiesOfType(type)) {
    const decl = symbol.declarations?.[0];
    if (!decl) continue;
    const fileName = decl.getSourceFile().fileName.replace(/\\/g, '/');
    if (
      fileName.startsWith(packagesRootNorm) ||
      fileName.includes('/node_modules/@entur/')
    ) {
      props.push(symbol.getName());
    }
  }
  return props;
}

// ── Main ──────────────────────────────────────────────────────────────────────

function processPackage(packageName: string): CatalogPackage | null {
  const shortName = packageName.replace('@entur/', '');
  const srcDir = path.join(resolvedPackagesRoot, shortName, 'src');

  // Try .tsx then .ts for the index entry point
  const indexPath = fs.existsSync(path.join(srcDir, 'index.tsx'))
    ? path.join(srcDir, 'index.tsx')
    : fs.existsSync(path.join(srcDir, 'index.ts'))
    ? path.join(srcDir, 'index.ts')
    : null;

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

  const exportedSymbols = checker.getExportsOfModule(moduleSymbol);
  const symbols: CatalogSymbol[] = [];
  const seenNames = new Set<string>();

  for (const exportSymbol of exportedSymbols) {
    const name = exportSymbol.getName();

    // Skip duplicates and internal/type-only exports
    if (seenNames.has(name)) continue;

    // Skip type-only names that end with 'Props', 'Type', 'Options', etc.
    // We want value exports (components, hooks, utils, tokens)
    const decl = exportSymbol.declarations?.[0];
    if (!decl) continue;

    // Skip pure type alias / interface declarations (not runtime values)
    if (ts.isTypeAliasDeclaration(decl) || ts.isInterfaceDeclaration(decl)) {
      continue;
    }

    seenNames.add(name);
    const symbolType = classifySymbol(name);

    // Extract self-defined props for component exports
    let knownProps: string[] = [];
    if (symbolType === 'component') {
      // Try to find a XProps or XBaseProps type for this component
      const propsTypeName = `${name}Props`;
      const basePropsTypeName = `${name}BaseProps`;

      // Look up the props type in all source files of this package
      let propsType: ts.Type | null = null;

      for (const sf of program.getSourceFiles()) {
        if (sf.isDeclarationFile) continue;
        const sfName = sf.fileName.replace(/\\/g, '/');
        if (!sfName.startsWith(packagesRootNorm)) continue;

        // Look for BaseProps first (self-defined subset), then Props
        for (const stmt of sf.statements) {
          if (
            ts.isTypeAliasDeclaration(stmt) &&
            (stmt.name.text === basePropsTypeName ||
              stmt.name.text === propsTypeName)
          ) {
            const isBase = stmt.name.text === basePropsTypeName;
            const candidate = checker.getTypeAtLocation(stmt);
            if (isBase || propsType === null) {
              propsType = candidate;
              if (isBase) break; // Prefer BaseProps, stop searching
            }
          } else if (
            ts.isInterfaceDeclaration(stmt) &&
            (stmt.name.text === basePropsTypeName ||
              stmt.name.text === propsTypeName)
          ) {
            const isBase = stmt.name.text === basePropsTypeName;
            const candidate = checker.getTypeAtLocation(stmt);
            if (isBase || propsType === null) {
              propsType = candidate;
              if (isBase) break;
            }
          }
        }
        if (propsType !== null && propsTypeName.includes('Base')) break;
      }

      if (propsType !== null) {
        knownProps = getSelfDefinedProps(propsType, checker, packagesRootNorm);
      }
    }

    symbols.push({ symbolName: name, symbolType, knownProps });
  }

  // Sort symbols alphabetically for stable output
  symbols.sort((a, b) => a.symbolName.localeCompare(b.symbolName));

  return { packageName, latestVersion: null, symbols };
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
    process.stdout.write(`  ${packageName}...`);
    const result = processPackage(packageName);
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
