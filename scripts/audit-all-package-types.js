#!/usr/bin/env node

/**
 * Design System Type Export Audit Script
 *
 * This script audits type exports across all packages in the design system.
 * Run this after switching build tools to ensure all intended public types are available.
 *
 * NEW: Now helps migrate from "export *" to named exports for better tree-shaking.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const ROOT_DIR = path.join(__dirname, '..');
const PACKAGES_DIR = path.join(ROOT_DIR, 'packages');
const APPS_DIR = path.join(ROOT_DIR, 'apps');
const EXCLUDED_DIRS = [
  '__tests__',
  'tests',
  'test',
  '.test.',
  '.spec.',
  'node_modules',
  'dist',
  'build',
];
const EXCLUDED_PACKAGES = ['tokens']; // Packages that don't export React components

// Types that should always be public (common patterns)
const COMMON_PUBLIC_TYPES = [
  'Props',
  'Context',
  'Provider',
  'Hook',
  'Ref',
  'State',
  'Event',
  'Value',
  'Values',
  'Option',
  'Options',
  'Item',
  'Items',
  'Data',
  'Config',
  'Settings',
  'Theme',
  'Variant',
  'Variants',
  'Size',
  'Sizes',
  'Color',
  'Colors',
  'Status',
  'Direction',
  'Position',
  'Alignment',
  'Orientation',
];

function extractExportedTypes(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const exportedTypes = [];

    // Find exported types
    const typeExports = content.match(/export\s+type\s+(\w+)/g);
    if (typeExports) {
      typeExports.forEach(match => {
        const typeName = match.replace(/export\s+type\s+/, '');
        exportedTypes.push(typeName);
      });
    }

    // Find exported interfaces
    const interfaceExports = content.match(/export\s+interface\s+(\w+)/g);
    if (interfaceExports) {
      interfaceExports.forEach(match => {
        const interfaceName = match.replace(/export\s+interface\s+/, '');
        exportedTypes.push(interfaceName);
      });
    }

    return exportedTypes;
  } catch (error) {
    console.warn(`Warning: Could not read ${filePath}:`, error.message);
    return [];
  }
}

function extractExportedComponents(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const exportedComponents = [];

    // Find exported components (default exports)
    const defaultExports = content.match(/export\s+default\s+(\w+)/g);
    if (defaultExports) {
      defaultExports.forEach(match => {
        const componentName = match.replace(/export\s+default\s+/, '');
        exportedComponents.push(componentName);
      });
    }

    // Find named component exports
    const namedExports = content.match(/export\s+{\s*([^}]+)\s*}/g);
    if (namedExports) {
      namedExports.forEach(match => {
        const exports = match.replace(/export\s+{\s*([^}]+)\s*}/, '$1');
        exports.split(',').forEach(exp => {
          const trimmed = exp.trim();
          if (trimmed && !trimmed.includes(' as ')) {
            exportedComponents.push(trimmed);
          }
        });
      });
    }

    return exportedComponents;
  } catch (error) {
    return [];
  }
}

function extractAllExports(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const allExports = [];

    // Find exported types
    const typeExports = content.match(/export\s+type\s+(\w+)/g);
    if (typeExports) {
      typeExports.forEach(match => {
        const typeName = match.replace(/export\s+type\s+/, '');
        allExports.push({ name: typeName, kind: 'type' });
      });
    }

    // Find exported interfaces
    const interfaceExports = content.match(/export\s+interface\s+(\w+)/g);
    if (interfaceExports) {
      interfaceExports.forEach(match => {
        const interfaceName = match.replace(/export\s+interface\s+/, '');
        allExports.push({ name: interfaceName, kind: 'interface' });
      });
    }

    // Find exported components (default exports)
    const defaultExports = content.match(/export\s+default\s+(\w+)/g);
    if (defaultExports) {
      defaultExports.forEach(match => {
        const componentName = match.replace(/export\s+default\s+/, '');
        allExports.push({ name: componentName, kind: 'component' });
      });
    }

    // Find named exports (components, functions, constants, etc.)
    const namedExports = content.match(/export\s+{\s*([^}]+)\s*}/g);
    if (namedExports) {
      namedExports.forEach(match => {
        const exports = match.replace(/export\s+{\s*([^}]+)\s*}/, '$1');
        exports.split(',').forEach(exp => {
          const trimmed = exp.trim();
          if (trimmed && !trimmed.includes(' as ')) {
            // Try to determine if it's a component, function, or other
            const isComponent =
              /^[A-Z]/.test(trimmed) && trimmed.includes('Component');
            const isHook = trimmed.startsWith('use');
            const kind = isComponent ? 'component' : isHook ? 'hook' : 'export';
            allExports.push({ name: trimmed, kind });
          }
        });
      });
    }

    // Find const exports
    const constExports = content.match(/export\s+const\s+(\w+)/g);
    if (constExports) {
      constExports.forEach(match => {
        const constName = match.replace(/export\s+const\s+/, '');
        allExports.push({ name: constName, kind: 'constant' });
      });
    }

    // Find function exports
    const functionExports = content.match(/export\s+function\s+(\w+)/g);
    if (functionExports) {
      functionExports.forEach(match => {
        const functionName = match.replace(/export\s+function\s+/, '');
        allExports.push({ name: functionName, kind: 'function' });
      });
    }

    return allExports;
  } catch (error) {
    console.warn(`Warning: Could not read ${filePath}:`, error.message);
    return [];
  }
}

function findTypeFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;

  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!EXCLUDED_DIRS.some(excluded => file.includes(excluded))) {
        findTypeFiles(filePath, fileList);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      if (!file.includes('.test.') && !file.includes('.spec.')) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

function getCurrentExports(indexFile) {
  try {
    const content = fs.readFileSync(indexFile, 'utf8');
    const exports = [];

    // Find all export * from statements
    const exportStatements = content.match(
      /export\s+\*\s+from\s+['"]([^'"]+)['"]/g,
    );
    if (exportStatements) {
      exportStatements.forEach(statement => {
        const modulePath = statement.match(
          /export\s+\*\s+from\s+['"]([^'"]+)['"]/,
        )[1];
        exports.push({
          type: 'wildcard',
          path: modulePath,
          statement: statement.trim(),
        });
      });
    }

    // Find named exports
    const namedExportStatements = content.match(
      /export\s+{\s*([^}]+)\s*}\s+from\s+['"]([^'"]+)['"]/g,
    );
    if (namedExportStatements) {
      namedExportStatements.forEach(statement => {
        const match = statement.match(
          /export\s+{\s*([^}]+)\s*}\s+from\s+['"]([^'"]+)['"]/,
        );
        if (match) {
          const exports = match[1].split(',').map(e => e.trim());
          const modulePath = match[2];
          exports.forEach(exp => {
            if (exp && !exp.includes(' as ')) {
              exports.push({
                type: 'named',
                path: modulePath,
                export: exp,
                statement: statement.trim(),
              });
            }
          });
        }
      });
    }

    return exports;
  } catch (error) {
    return [];
  }
}

function findPackageIndexFiles(packageDir) {
  const possibleIndexFiles = [
    path.join(packageDir, 'src', 'index.tsx'),
    path.join(packageDir, 'src', 'index.ts'),
    path.join(packageDir, 'index.tsx'),
    path.join(packageDir, 'index.ts'),
  ];

  for (const indexFile of possibleIndexFiles) {
    if (fs.existsSync(indexFile)) {
      return indexFile;
    }
  }

  return null;
}

function auditPackage(packagePath, packageName) {
  const indexFile = findPackageIndexFiles(packagePath);
  if (!indexFile) {
    console.log(`⚠️  ${packageName}: No index file found`);
    return null;
  }

  const srcDir = path.join(packagePath, 'src');
  if (!fs.existsSync(srcDir)) {
    console.log(`⚠️  ${packageName}: No src directory found`);
    return null;
  }

  const currentExports = getCurrentExports(indexFile);
  const typeFiles = findTypeFiles(srcDir);

  const allTypes = new Map();
  const allComponents = new Map();
  const allExports = new Map();
  const missingExports = [];
  const wildcardExports = [];

  // Analyze each file for all exports
  typeFiles.forEach(file => {
    const relativePath = path.relative(srcDir, file);
    const exportedTypes = extractExportedTypes(file);
    const exportedComponents = extractExportedComponents(file);
    const allFileExports = extractAllExports(file);

    if (
      exportedTypes.length > 0 ||
      exportedComponents.length > 0 ||
      allFileExports.length > 0
    ) {
      allTypes.set(relativePath, exportedTypes);
      allComponents.set(relativePath, exportedComponents);
      allExports.set(relativePath, allFileExports);

      // Check if this file is exported from index
      const isExported = currentExports.some(exp => {
        if (exp.type === 'wildcard') {
          if (exp.path.startsWith('./')) {
            return relativePath.startsWith(exp.path.slice(2));
          }
          return relativePath === exp.path;
        }
        return false;
      });

      if (!isExported) {
        missingExports.push({
          file: relativePath,
          types: exportedTypes,
          components: exportedComponents,
          allExports: allFileExports,
          reason: 'File not exported from index',
        });
      } else {
        // This is a wildcard export - suggest named exports
        wildcardExports.push({
          file: relativePath,
          types: exportedTypes,
          components: exportedComponents,
          allExports: allFileExports,
          exportPath: currentExports.find(exp => {
            if (exp.type === 'wildcard') {
              if (exp.path.startsWith('./')) {
                return relativePath.startsWith(exp.path.slice(2));
              }
              return relativePath === exp.path;
            }
            return false;
          })?.path,
        });
      }
    }
  });

  return {
    packageName,
    packagePath: packagePath,
    indexFile: path.relative(ROOT_DIR, indexFile),
    currentExports,
    typeFiles: typeFiles.length,
    allTypes,
    allComponents,
    allExports,
    missingExports,
    wildcardExports,
  };
}

function generateNamedExportSuggestion(
  filePath,
  types,
  components,
  allExports = [],
) {
  // Filter out internal types that are usually composed into public types
  const filterInternalTypes = typeList => {
    return typeList.filter(type => {
      // Filter out types that are typically internal implementation details
      const isInternal =
        type.includes('Base') ||
        type.includes('Own') ||
        type.includes('Internal') ||
        type.includes('Private') ||
        type.includes('Helper') ||
        type.includes('Utility');

      return !isInternal;
    });
  };

  const filteredTypes = filterInternalTypes(types);
  const filteredComponents = filterInternalTypes(components);

  // Get all non-type exports (components, functions, constants, etc.)
  const nonTypeExports = allExports
    .filter(exp => exp.kind !== 'type' && exp.kind !== 'interface')
    .map(exp => exp.name);

  const relativePath = filePath.replace(/\.(tsx?|js)$/, '');

  // For individual file suggestions, keep the current format
  // The grouping will be handled at the package level
  const exportStatements = [];

  // Add runtime exports first (components, functions, constants, etc.)
  if (nonTypeExports.length > 0) {
    exportStatements.push(
      `export { ${nonTypeExports.join(', ')} } from './${relativePath}';`,
    );
  }

  // Add a space between runtime and type exports if both exist
  if (
    nonTypeExports.length > 0 &&
    (filteredTypes.length > 0 || filteredComponents.length > 0)
  ) {
    exportStatements.push('');
  }

  // Add type exports
  if (filteredTypes.length > 0) {
    exportStatements.push(
      `export type { ${filteredTypes.join(', ')} } from './${relativePath}';`,
    );
  }

  // Add component type exports (if any components have types)
  if (filteredComponents.length > 0) {
    exportStatements.push(
      `export type { ${filteredComponents.join(
        ', ',
      )} } from './${relativePath}';`,
    );
  }

  return exportStatements.join('\n');
}

function generatePackageLevelExportSuggestion(wildcardExports, packagePath) {
  // Check if this package has barrel exports
  const barrelExports = findBarrelExports(packagePath);

  if (barrelExports.length > 0) {
    // Use barrel exports approach
    const exportStatements = [];

    barrelExports.forEach(barrel => {
      const barrelWildcardExports = wildcardExports.filter(({ file }) =>
        file.startsWith(barrel.path + '/'),
      );

      if (barrelWildcardExports.length > 0) {
        // Update the barrel export with named exports
        const barrelContent = generateBarrelExportSuggestion(
          barrelWildcardExports,
          barrel.path,
        );
        exportStatements.push(
          `// Update ${barrel.relativePath}/index.ts with:`,
        );
        exportStatements.push(barrelContent);
        exportStatements.push('');

        // Export from the barrel (this should be preserved)
        exportStatements.push(`export * from '${barrel.relativePath}';`);
      }
    });

    // Handle any remaining files not in barrel exports
    const nonBarrelExports = wildcardExports.filter(
      ({ file }) =>
        !barrelExports.some(barrel => file.startsWith(barrel.path + '/')),
    );

    if (nonBarrelExports.length > 0) {
      exportStatements.push('// Direct exports:');
      exportStatements.push(generateDirectExports(nonBarrelExports));
    }

    return exportStatements.join('\n');
  } else {
    // Fall back to direct exports approach
    return generateDirectExports(wildcardExports);
  }
}

function generateDirectExports(wildcardExports) {
  // Collect all exports across all files in the package
  const allRuntimeExports = [];
  const allTypeExports = [];
  const fileExports = new Map();

  wildcardExports.forEach(
    ({ file, types, components, allExports, exportPath }) => {
      const relativePath = file.replace(/\.(tsx?|js)$/, '');

      // Filter out internal types
      const filterInternalTypes = typeList => {
        return typeList.filter(type => {
          const isInternal =
            type.includes('Base') ||
            type.includes('Own') ||
            type.includes('Internal') ||
            type.includes('Private') ||
            type.includes('Helper') ||
            type.includes('Utility');
          return !isInternal;
        });
      };

      const filteredTypes = filterInternalTypes(types);
      const filteredComponents = filterInternalTypes(components);

      // Get runtime exports (everything that's NOT a type or interface)
      const runtimeExports = allExports
        .filter(exp => exp.kind !== 'type' && exp.kind !== 'interface')
        .map(exp => exp.name);

      // Get actual type exports (only types and interfaces)
      const typeExports = allExports
        .filter(exp => exp.kind === 'type' || exp.kind === 'interface')
        .map(exp => exp.name);

      // Add to package-level collections
      if (runtimeExports.length > 0) {
        allRuntimeExports.push(
          ...runtimeExports.map(name => ({ name, file: relativePath })),
        );
      }

      if (typeExports.length > 0) {
        allTypeExports.push(
          ...typeExports.map(name => ({ name, file: relativePath })),
        );
      }
    },
  );

  const exportStatements = [];

  // Group runtime exports by file
  const runtimeExportsByFile = new Map();
  allRuntimeExports.forEach(({ name, file }) => {
    if (!runtimeExportsByFile.has(file)) {
      runtimeExportsByFile.set(file, []);
    }
    runtimeExportsByFile.get(file).push(name);
  });

  // Add runtime exports grouped by file
  if (runtimeExportsByFile.size > 0) {
    runtimeExportsByFile.forEach((exports, file) => {
      exportStatements.push(
        `export { ${exports.join(', ')} } from './${file}';`,
      );
    });
  }

  // Add space between runtime and type exports if both exist
  if (runtimeExportsByFile.size > 0 && allTypeExports.length > 0) {
    exportStatements.push('');
  }

  // Group type exports by file
  const typeExportsByFile = new Map();
  allTypeExports.forEach(({ name, file }) => {
    if (!typeExportsByFile.has(file)) {
      typeExportsByFile.set(file, []);
    }
    typeExportsByFile.get(file).push(name);
  });

  // Add type exports grouped by file
  if (typeExportsByFile.size > 0) {
    typeExportsByFile.forEach((exports, file) => {
      exportStatements.push(
        `export type { ${exports.join(', ')} } from './${file}';`,
      );
    });
  }

  return exportStatements.join('\n');
}

function findBarrelExports(packagePath) {
  const barrelExports = [];
  const srcDir = path.join(packagePath, 'src');

  if (!fs.existsSync(srcDir)) return barrelExports;

  // Look for index files in subdirectories
  const subdirs = fs
    .readdirSync(srcDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  subdirs.forEach(subdir => {
    const indexFile = path.join(srcDir, subdir, 'index.ts');
    const indexTsxFile = path.join(srcDir, subdir, 'index.tsx');

    if (fs.existsSync(indexFile) || fs.existsSync(indexTsxFile)) {
      const actualIndexFile = fs.existsSync(indexFile)
        ? indexFile
        : indexTsxFile;
      barrelExports.push({
        path: subdir,
        indexFile: actualIndexFile,
        relativePath: `./${subdir}`,
      });
    }
  });

  return barrelExports;
}

function generateBarrelExportSuggestion(wildcardExports, barrelPath) {
  // Group exports by file within this barrel
  const allRuntimeExports = [];
  const allTypeExports = [];

  wildcardExports.forEach(({ file, types, components, allExports }) => {
    // Only process files that belong to this barrel
    if (file.startsWith(barrelPath + '/')) {
      const relativePath = file
        .replace(barrelPath + '/', '')
        .replace(/\.(tsx?|js)$/, '');

      // Filter out internal types
      const filterInternalTypes = typeList => {
        return typeList.filter(type => {
          const isInternal =
            type.includes('Base') ||
            type.includes('Own') ||
            type.includes('Internal') ||
            type.includes('Private') ||
            type.includes('Helper') ||
            type.includes('Utility');
          return !isInternal;
        });
      };

      const filteredTypes = filterInternalTypes(types);
      const filteredComponents = filterInternalTypes(components);

      // Get runtime exports (everything that's NOT a type or interface)
      const runtimeExports = allExports
        .filter(exp => exp.kind !== 'type' && exp.kind !== 'interface')
        .map(exp => exp.name);

      // Get actual type exports (only types and interfaces)
      const typeExports = allExports
        .filter(exp => exp.kind === 'type' || exp.kind === 'interface')
        .map(exp => exp.name);

      // Add to collections
      if (runtimeExports.length > 0) {
        allRuntimeExports.push(
          ...runtimeExports.map(name => ({ name, file: relativePath })),
        );
      }

      if (typeExports.length > 0) {
        allTypeExports.push(
          ...typeExports.map(name => ({ name, file: relativePath })),
        );
      }
    }
  });

  const exportStatements = [];

  // Group runtime exports by file
  const runtimeExportsByFile = new Map();
  allRuntimeExports.forEach(({ name, file }) => {
    if (!runtimeExportsByFile.has(file)) {
      runtimeExportsByFile.set(file, []);
    }
    runtimeExportsByFile.get(file).push(name);
  });

  // Add runtime exports grouped by file
  if (runtimeExportsByFile.size > 0) {
    runtimeExportsByFile.forEach((exports, file) => {
      exportStatements.push(
        `export { ${exports.join(', ')} } from './${file}';`,
      );
    });
  }

  // Add space between runtime and type exports if both exist
  if (runtimeExportsByFile.size > 0 && allTypeExports.length > 0) {
    exportStatements.push('');
  }

  // Group type exports by file
  const typeExportsByFile = new Map();
  allTypeExports.forEach(({ name, file }) => {
    if (!typeExportsByFile.has(file)) {
      typeExportsByFile.set(file, []);
    }
    typeExportsByFile.get(file).push(name);
  });

  // Add type exports grouped by file
  if (typeExportsByFile.size > 0) {
    typeExportsByFile.forEach((exports, file) => {
      exportStatements.push(
        `export type { ${exports.join(', ')} } from './${file}';`,
      );
    });
  }

  return exportStatements.join('\n');
}

function auditAllPackages() {
  console.log(
    '🔍 Auditing type exports across all design system packages...\n',
  );

  const packages = [];

  // Find all packages
  if (fs.existsSync(PACKAGES_DIR)) {
    const packageDirs = fs.readdirSync(PACKAGES_DIR);
    packageDirs.forEach(dir => {
      if (!EXCLUDED_PACKAGES.includes(dir)) {
        const packagePath = path.join(PACKAGES_DIR, dir);
        const packageJson = path.join(packagePath, 'package.json');

        if (fs.existsSync(packageJson)) {
          try {
            const pkg = JSON.parse(fs.readFileSync(packageJson, 'utf8'));
            packages.push({
              name: pkg.name,
              path: packagePath,
              displayName: dir,
            });
          } catch (error) {
            console.warn(`Warning: Could not parse package.json for ${dir}`);
          }
        }
      }
    });
  }

  console.log(`📦 Found ${packages.length} packages to audit\n`);

  const results = [];
  let totalMissingExports = 0;
  let totalWildcardExports = 0;

  // Audit each package
  packages.forEach(({ name, path, displayName }) => {
    console.log(`🔍 Auditing ${name}...`);
    const result = auditPackage(path, displayName);
    if (result) {
      results.push(result);
      totalMissingExports += result.missingExports.length;
      totalWildcardExports += result.wildcardExports.length;
    }
  });

  // Generate summary report
  console.log('\n' + '='.repeat(80));
  console.log('📊 COMPREHENSIVE TYPE EXPORT AUDIT REPORT');
  console.log('='.repeat(80) + '\n');

  console.log(`📦 Total packages audited: ${results.length}`);
  console.log(`⚠️  Total missing exports: ${totalMissingExports}`);
  console.log(`🔄 Total wildcard exports to migrate: ${totalWildcardExports}`);
  console.log(
    `📁 Total source files analyzed: ${results.reduce(
      (sum, r) => sum + r.typeFiles,
      0,
    )}\n`,
  );

  // Detailed results for each package
  results.forEach(result => {
    console.log(`📦 ${result.packageName}`);
    console.log(`   Index file: ${result.indexFile}`);
    console.log(`   Source files: ${result.typeFiles}`);
    console.log(`   Current exports: ${result.currentExports.length}`);

    if (
      result.missingExports.length === 0 &&
      result.wildcardExports.length === 0
    ) {
      console.log(
        `   ✅ Status: All types properly exported with named exports\n`,
      );
    } else {
      if (result.missingExports.length > 0) {
        console.log(
          `   ⚠️  Status: ${result.missingExports.length} missing exports\n`,
        );

        result.missingExports.forEach(
          ({ file, types, components, allExports, reason }) => {
            console.log(`      📄 ${file}`);
            if (types.length > 0)
              console.log(`         Types: ${types.join(', ')}`);
            if (components.length > 0)
              console.log(`         Components: ${components.join(', ')}`);
            if (allExports.length > 0) {
              const nonTypeExports = allExports.filter(
                exp => exp.kind !== 'type' && exp.kind !== 'interface',
              );
              if (nonTypeExports.length > 0) {
                console.log(
                  `         Other exports: ${nonTypeExports
                    .map(exp => `${exp.name} (${exp.kind})`)
                    .join(', ')}`,
                );
              }
            }
            console.log(`         Issue: ${reason}`);
            const migrationSuggestion = generateNamedExportSuggestion(
              file,
              types,
              components,
              allExports,
            );
            console.log(
              `         Fix: ${migrationSuggestion.replace(
                /\n/g,
                '\n         ',
              )}\n`,
            );
          },
        );
      }

      if (result.wildcardExports.length > 0) {
        console.log(
          `   🔄 Status: ${result.wildcardExports.length} wildcard exports to migrate\n`,
        );

        result.wildcardExports.forEach(
          ({ file, types, components, allExports, exportPath }) => {
            console.log(`      📄 ${file}`);
            if (types.length > 0) {
              console.log(`         Types: ${types.join(', ')}`);
              // Show which types are filtered out as internal
              const internalTypes = types.filter(
                type =>
                  type.includes('Base') ||
                  type.includes('Own') ||
                  type.includes('Internal') ||
                  type.includes('Private') ||
                  type.includes('Helper') ||
                  type.includes('Utility'),
              );
              if (internalTypes.length > 0) {
                console.log(
                  `         Internal (filtered): ${internalTypes.join(', ')}`,
                );
              }
            }
            if (components.length > 0) {
              console.log(`         Components: ${components.join(', ')}`);
              // Show which components are filtered out as internal
              const internalComponents = components.filter(
                comp =>
                  comp.includes('Base') ||
                  comp.includes('Own') ||
                  comp.includes('Internal') ||
                  comp.includes('Private') ||
                  comp.includes('Helper') ||
                  comp.includes('Utility'),
              );
              if (internalComponents.length > 0) {
                console.log(
                  `         Internal (filtered): ${internalComponents.join(
                    ', ',
                  )}`,
                );
              }
            }
            if (allExports.length > 0) {
              const nonTypeExports = allExports.filter(
                exp => exp.kind !== 'type' && exp.kind !== 'interface',
              );
              if (nonTypeExports.length > 0) {
                console.log(
                  `         Other exports: ${nonTypeExports
                    .map(exp => `${exp.name} (${exp.kind})`)
                    .join(', ')}`,
                );
              }
            }
            console.log(`         Current: export * from '${exportPath}'`);
            const migrationSuggestion = generatePackageLevelExportSuggestion(
              result.wildcardExports,
              result.packagePath,
            );
            console.log(
              `         Migrate to: ${migrationSuggestion.replace(
                /\n/g,
                '\n         ',
              )}`,
            );
          },
        );
      }
    }
  });

  // Migration recommendations
  console.log('💡 MIGRATION RECOMMENDATIONS:\n');

  if (totalMissingExports === 0 && totalWildcardExports === 0) {
    console.log(
      '🎉 All packages have properly exported types with named exports!',
    );
  } else {
    if (totalMissingExports > 0) {
      console.log(
        `1. Fix ${totalMissingExports} missing export statements across packages`,
      );
    }
    if (totalWildcardExports > 0) {
      console.log(
        `2. Migrate ${totalWildcardExports} wildcard exports to named exports`,
      );
      console.log(
        '   Benefits: Better tree-shaking, smaller bundles, explicit API contracts',
      );
    }
    console.log(
      '3. Review types marked with 🌟 - these are commonly public types',
    );
    console.log(
      '4. Consider creating barrel exports (index.ts) in subdirectories',
    );
    console.log('5. Test package builds to ensure types are available');
    console.log('6. Update documentation if needed');
  }

  console.log('\n7. Run this audit script regularly after build tool changes');
  console.log('8. Consider adding type export checks to CI/CD pipeline');
  console.log(
    '9. Use named exports for better tree-shaking and bundle optimization',
  );

  // Generate migration script
  if (totalWildcardExports > 0) {
    console.log('\n🔄 MIGRATION SCRIPT GENERATION:');
    console.log(
      'The script can generate a migration script to help automate the process.',
    );
    console.log('Run with --generate-migration to create it.');
  }

  return results;
}

// Generate migration script
function generateMigrationScript(results) {
  console.log('\n🔄 GENERATING MIGRATION SCRIPT...\n');

  let migrationScript = `#!/usr/bin/env node

/**
 * Auto-generated migration script for converting wildcard exports to named exports
 * Generated on: ${new Date().toISOString()}
 * 
 * WARNING: Review all changes before applying!
 */

const fs = require('fs');
const path = require('path');

function migratePackage(packagePath, changes) {
  console.log(\`\\n📦 Migrating \${packagePath}...\`);
  
  changes.forEach(change => {
    const indexFile = change.indexFile;
    const fullPath = path.join(packagePath, indexFile);
    
    if (!fs.existsSync(fullPath)) {
      console.log(\`   ⚠️  Index file not found: \${indexFile}\`);
      return;
    }
    
    try {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      change.migrations.forEach(migration => {
        const oldExports = migration.oldExports;
        const newExports = migration.newExports;
        
        // First, remove ALL export * statements from the file (except barrel exports)
        let contentChanged = false;
        
        // Find and remove all export * statements that aren't barrel exports
        // Use a simple approach to avoid regex escaping issues
        const lines = content.split('\\n');
        const newLines = [];
        
        lines.forEach(line => {
          const trimmedLine = line.trim();
          
          // Check if this is an export * statement
          if (trimmedLine.startsWith('export * from')) {
            // Extract the module path
            const match = trimmedLine.match(/export\\s*\\*\\s*from\\s*['"]([^'"]+)['"]/);
            if (match) {
              const modulePath = match[1];
              
              // Check if this is a barrel export (exporting from a directory with index file)
              // Barrel exports are like: export * from './DatePicker' (where DatePicker is a directory)
              // Individual file exports are like: export * from './Button' (where Button is a file)
              const fullModulePath = path.join(packagePath, 'src', modulePath);
              const isDirectory = fs.existsSync(fullModulePath) && fs.statSync(fullModulePath).isDirectory();
              const hasIndexFile = isDirectory && (
                fs.existsSync(path.join(fullModulePath, 'index.ts')) ||
                fs.existsSync(path.join(fullModulePath, 'index.tsx'))
              );
              
              if (isDirectory && hasIndexFile) {
                // This is a barrel export - preserve it
                newLines.push(line);
                console.log(\`   🔒 Preserved barrel export: \${trimmedLine} (from directory with index file)\`);
              } else {
                // This is an individual file export - remove it
                contentChanged = true;
                console.log(\`   ✅ Removed: \${trimmedLine} (individual file export)\`);
                // Don't add this line to newLines
              }
            } else {
              // Keep lines that don't match the pattern
              newLines.push(line);
            }
          } else {
            // Keep non-export lines
            newLines.push(line);
          }
        });
        
        // Reconstruct content without the removed export * statements
        if (contentChanged) {
          content = newLines.join('\\n');
        }
        
        // Clean up and add new exports if we made changes
        if (contentChanged) {
          // Clean up any leftover semicolons and empty lines
          content = content.replace(/;\\s*\\n/g, '\\n');
          content = content.replace(/\\n\\s*\\n\\s*\\n/g, '\\n\\n');
          content = content.replace(/^\\s*\\n/, '');
          content = content.replace(/\\n\\s*$/, '\\n');
          
          // Add the new grouped exports
          content += newExports;
          console.log(\`   ✅ Added: grouped named exports\`);
        } else {
          console.log(\`   ⚠️  No export * statements found to migrate\`);
        }
      });
      
      fs.writeFileSync(fullPath, content);
      console.log(\`   💾 Updated: \${indexFile}\`);
      
    } catch (error) {
      console.log(\`   ❌ Error updating \${indexFile}: \${error.message}\`);
    }
  });
}

// Migration changes for each package
const migrations = {
`;

  results.forEach(result => {
    if (result.wildcardExports.length > 0) {
      const packageKey = result.packageName.replace('@entur/', '');
      migrationScript += `  '${packageKey}': {\n`;
      migrationScript += `    packagePath: '${path.relative(
        ROOT_DIR,
        path.dirname(result.indexFile),
      )}',\n`;
      migrationScript += `    indexFile: '${path.basename(
        result.indexFile,
      )}',\n`;
      migrationScript += `    migrations: [\n`;

      // Instead, create a single migration for the entire package
      const oldExports = result.wildcardExports
        .map(({ exportPath }) => `export * from '${exportPath}'`)
        .join('\n');
      const newExports = generatePackageLevelExportSuggestion(
        result.wildcardExports,
        result.packagePath,
      );

      migrationScript += `      {\n`;
      migrationScript += `        description: 'Migrate all wildcard exports to grouped named exports',\n`;
      migrationScript += `        oldExports: ${JSON.stringify(oldExports)},\n`;
      migrationScript += `        newExports: ${JSON.stringify(newExports)}\n`;
      migrationScript += `      },\n`;

      migrationScript += `    ]\n`;
      migrationScript += `  },\n`;
    }
  });

  migrationScript += `};

// Execute migrations
console.log('🚀 Starting migration from wildcard to named exports...\\n');

Object.entries(migrations).forEach(([packageName, config]) => {
  const packagePath = path.join(__dirname, '..', config.packagePath);
  migratePackage(packagePath, [config]);
});

console.log('\\n✅ Migration complete! Review all changes before committing.');
`;

  const migrationFile = path.join(
    ROOT_DIR,
    'scripts',
    'migrate-to-named-exports.js',
  );
  fs.writeFileSync(migrationFile, migrationScript);
  console.log(
    `📝 Migration script generated: scripts/migrate-to-named-exports.js`,
  );
  console.log(`🚀 Run it with: node scripts/migrate-to-named-exports.js`);
}

// Check command line arguments
const args = process.argv.slice(2);
const shouldGenerateMigration = args.includes('--generate-migration');

// Run the audit
if (require.main === module) {
  const results = auditAllPackages();

  if (shouldGenerateMigration) {
    generateMigrationScript(results);
  }
}

module.exports = { auditAllPackages, generateMigrationScript };
