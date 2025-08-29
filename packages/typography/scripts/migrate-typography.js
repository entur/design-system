#!/usr/bin/env node

/**
 * Typography Migration Script
 *
 * This script helps you migrate from old typography components to new beta typography.
 *
 * MIGRATION MODES:
 *
 * 🚀 Complete Mode (default):
 *   - Updates import paths AND component usage
 *   - Replaces old components with beta components
 *   - CONSEQUENCES:
 *     * <Heading1> becomes <Heading as="h1" variant="title-1">
 *     * <Paragraph> becomes <Text variant="paragraph">
 *     * <Link> becomes <LinkBeta>
 *     * Props may need updates (e.g., different prop names)
 *     * Styling classes may change
 *     * Test thoroughly after migration!
 *
 * 📝 Import-Only Mode (--import-only):
 *   - Only updates import paths from '@entur/typography' to '@entur/typography'
 *   - Keeps your existing component usage unchanged
 *   - Minimal risk, allows gradual migration
 *   - You can manually update components later
 *
 * Usage:
 * 1. Run this script in your project root
 * 2. Choose your migration mode (complete or import-only)
 * 3. Update your styles as needed
 * 4. Test your application thoroughly
 *
 * Options:
 *   --dry-run        Show what would be changed without modifying files
 *   --import-only    Import-only migration: update import paths only
 *
 * Environment Variables:
 *   TYPOGRAPHY_MIGRATION_DIRS  Comma-separated list of directories to scan
 *                              Example: "src/**,app/**"
 *
 * Security Features:
 *   - Only scans allowed directories (src/**, app/**, etc.)
 *   - Never scans node_modules, dist, build, .git, etc.
 *   - Dry-run mode for safe testing
 *   - Path validation prevents directory traversal attacks
 *
 */

const fs = require('fs');
const path = require('path');

// Check if glob is available
let glob;
try {
  glob = require('glob');
} catch (error) {
  console.error(
    '❌ Error: The "glob" package is required to run this migration script.',
  );
  console.error('');
  console.error('Please install it:');
  console.error('  npm install glob');
  console.error('  yarn add glob');
  console.error('');
  console.error('Or use npx which will handle dependencies automatically:');
  console.error('  npx @entur/typography@latest migrate');
  console.error('');
  process.exit(1);
}

// Configuration
const OLD_IMPORT = '@entur/typography';
const BETA_IMPORT = '@entur/typography';

// =============================================================================
// 🎯 MIGRATION FOLDERS CONFIGURATION
// =============================================================================
//
// EDIT THIS SECTION TO CONTROL WHICH FOLDERS ARE SCANNED
//
// ADD FOLDERS:    Add new patterns to scan additional directories
// REMOVE FOLDERS: Delete patterns you don't want to scan
// CLEAR ALL:      Remove all patterns to scan only what you add
//
// Examples:
//   'src/**'              - Scan src folder and all subdirectories
//   'app/**'              - Scan app folder and all subdirectories
//   'packages/my-app/**'  - Scan specific package
//   'frontend/**'         - Scan frontend directory
//   'shared/**'           - Scan shared components
//   'components/**'       - Scan components folder
//
// =============================================================================

const MIGRATION_FOLDERS = [
  // 👇 ADD YOUR FOLDERS HERE 👇
  'src/**',
  'app/**',
  'apps/**',
  'components/**',
  'pages/**',
  'lib/**',
  'utils/**',
  'styles/**',
  'css/**',
  'scss/**',
  // 👆 ADD YOUR FOLDERS ABOVE 👆
];

// =============================================================================

// Validate and sanitize directory input for security
function validateDirectoryPath(dir) {
  return !path.isAbsolute(dir) && !dir.includes('..') && !dir.includes('~');
}

let ALLOWED_DIRECTORIES = process.env.TYPOGRAPHY_MIGRATION_DIRS
  ? process.env.TYPOGRAPHY_MIGRATION_DIRS.split(',')
  : MIGRATION_FOLDERS;

// Filter out potentially dangerous paths
ALLOWED_DIRECTORIES = ALLOWED_DIRECTORIES.filter(validateDirectoryPath);

if (ALLOWED_DIRECTORIES.length === 0) {
  console.error(
    '❌ Error: No valid migration directories found after security validation.',
  );
  console.error(
    'All directory paths must be relative and not contain ".." or "~".',
  );
  console.error('');
  console.error('Valid examples:');
  console.error('  src/**');
  console.error('  app/**');
  console.error('  components/**');
  console.error('');
  console.error('Invalid examples:');
  console.error('  /absolute/path');
  console.error('  ../parent/directory');
  console.error('  ~/home/directory');
  process.exit(1);
}

// Security: Block-list of directories to never scan
const BLOCKED_DIRECTORIES = [
  '**/node_modules/**',
  '**/dist/**',
  '**/build/**',
  '**/.git/**',
  '**/coverage/**',
  '**/.next/**',
  '**/.nuxt/**',
  '**/public/**',
  '**/static/**',
  '**/assets/**',
  '**/images/**',
  '**/fonts/**',
  '**/vendor/**',
  '**/temp/**',
  '**/tmp/**',
];

// Component mapping for complete migration
const COMPONENT_MAPPING = {
  Heading1: { component: 'Heading', as: 'h1', variant: 'title-1' },
  Heading2: { component: 'Heading', as: 'h2', variant: 'title-2' },
  Heading3: { component: 'Heading', as: 'h3', variant: 'subtitle-1' },
  Heading4: { component: 'Heading', as: 'h4', variant: 'subtitle-2' },
  Heading5: { component: 'Heading', as: 'h5', variant: 'section-1' },
  Heading6: { component: 'Heading', as: 'h6', variant: 'section-2' },
  Paragraph: { component: 'Text', variant: 'paragraph' },
  LeadParagraph: { component: 'Text', variant: 'leading' },
  SmallText: { component: 'Text', variant: 'subparagraph', size: 's' },
  StrongText: { component: 'Text', variant: 'emphasized', weight: 'semibold' },
  SubLabel: { component: 'Text', variant: 'sublabel', size: 'xs' },
  SubParagraph: { component: 'Text', variant: 'subparagraph' },
  Label: { component: 'Text', variant: 'label' },
  EmphasizedText: { component: 'Text', variant: 'emphasized' },
  CodeText: { component: 'Text', variant: 'code-text' },
  Link: { component: 'LinkBeta' },
  Blockquote: { component: 'BlockquoteBeta' },
};

// Props mapping for migration
const PROPS_MAPPING = {
  margin: 'spacing',
};

// Spacing value mapping from old margin to new spacing
const SPACING_MAPPING = {
  none: 'none',
  top: 'md-top',
  bottom: 'md-bottom',
  left: 'md-left',
  right: 'md-right',
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
};

// Import patterns to handle
const IMPORT_PATTERNS = [
  /from\s+['"`]@entur\/typography['"`]/g,
  /from\s+['"`]@entur\/typography\/dist['"`]/g,
  /from\s+['"`]@entur\/typography\/dist\/index['"`]/g,
  /from\s+['"`]@entur\/typography\/dist\/styles\.css['"`]/g,
];

// Parse JSX props more robustly
function parseJSXProps(propsString) {
  if (!propsString || !propsString.trim()) {
    return { props: {}, warnings: [] };
  }

  const props = {};
  const warnings = [];
  const MAX_ITERATIONS = 100; // Prevent infinite loops
  let iterationCount = 0;

  try {
    // Parse props manually to handle complex cases
    let remaining = propsString.trim();
    let lastRemainingLength = remaining.length;

    while (remaining.length > 0 && iterationCount < MAX_ITERATIONS) {
      iterationCount++;

      // Safety check: if we're not making progress, break
      if (remaining.length >= lastRemainingLength) {
        warnings.push(`Parser stuck at iteration ${iterationCount}, breaking`);
        break;
      }
      lastRemainingLength = remaining.length;

      // Match prop name - more efficient regex
      const nameMatch = remaining.match(/^(\w+)=/);
      if (!nameMatch) break;

      const propName = nameMatch[1];
      const matchLength = nameMatch[0].length;
      remaining = remaining.substring(matchLength);

      // Match prop value
      if (remaining.startsWith('"') || remaining.startsWith("'")) {
        // String value - use indexOf for better performance
        const quote = remaining[0];
        const endQuoteIndex = remaining.indexOf(quote, 1);
        if (endQuoteIndex === -1) {
          warnings.push(`Unterminated string in prop ${propName}`);
          break;
        }

        const propValue = remaining.substring(1, endQuoteIndex);
        props[propName] = propValue;
        remaining = remaining.substring(endQuoteIndex + 1);
      } else if (remaining.startsWith('{')) {
        // Object value - find matching closing brace with bounds checking
        let braceCount = 0;
        let endIndex = -1;
        const maxSearchLength = Math.min(remaining.length, 1000); // Limit search length

        for (let i = 0; i < maxSearchLength; i++) {
          if (remaining[i] === '{') braceCount++;
          if (remaining[i] === '}') {
            braceCount--;
            if (braceCount === 0) {
              endIndex = i;
              break;
            }
          }
        }

        if (endIndex === -1) {
          warnings.push(`Unterminated object in prop ${propName}`);
          break;
        }

        const propValue = remaining.substring(1, endIndex);
        props[propName] = propValue;
        remaining = remaining.substring(endIndex + 1);
      } else {
        // Boolean prop (e.g., disabled) or invalid syntax
        props[propName] = true;
        break;
      }

      // Skip whitespace more efficiently
      remaining = remaining.replace(/^\s+/, '');
    }

    if (iterationCount >= MAX_ITERATIONS) {
      warnings.push(`Maximum parsing iterations (${MAX_ITERATIONS}) reached`);
    }
  } catch (error) {
    warnings.push(`Failed to parse props: ${error.message}`);
  }

  return { props, warnings };
}

// Migrate props from old to new format
function migrateProps(props, oldComponent) {
  const migratedProps = { ...props };
  const warnings = [];

  // Handle margin prop migration
  if (props.margin) {
    const newSpacing = SPACING_MAPPING[props.margin];
    if (newSpacing) {
      migratedProps.spacing = newSpacing;
      delete migratedProps.margin;
      warnings.push(
        `Migrated 'margin="${props.margin}"' to 'spacing="${newSpacing}"'`,
      );
    } else {
      // Unknown margin value - keep as is but warn
      migratedProps.spacing = props.margin;
      delete migratedProps.margin;
      warnings.push(
        `Migrated 'margin="${props.margin}"' to 'spacing="${props.margin}"' (unknown value - may need manual review)`,
      );
    }
  }

  // Handle Heading components with existing 'as' prop
  if (oldComponent.startsWith('Heading') && props.as) {
    const headingNumber = oldComponent.replace('Heading', '');
    const expectedAs = `h${headingNumber}`;

    if (props.as !== expectedAs) {
      warnings.push(
        `Heading component has 'as="${props.as}"' but expected 'as="${expectedAs}"' - review semantic HTML structure`,
      );
    }
  }

  // Handle style prop conflicts
  if (props.style && props.margin) {
    warnings.push(
      `Component has both 'style' and 'margin' props - check for conflicts`,
    );
  }

  return { props: migratedProps, warnings };
}

// Convert props object back to JSX string
function propsToString(props) {
  if (!props || Object.keys(props).length === 0) {
    return '';
  }

  return (
    ' ' +
    Object.entries(props)
      .map(([key, value]) => {
        // Handle different value types
        if (typeof value === 'string' && !value.includes('{')) {
          return `${key}="${value}"`;
        } else if (
          typeof value === 'string' &&
          value.startsWith('{') &&
          value.endsWith('}')
        ) {
          // Already a JSX object, don't add extra braces
          return `${key}={${value}}`;
        } else {
          return `${key}={${value}}`;
        }
      })
      .join(' ')
  );
}

// Update imports in content
function updateImports(content) {
  let updatedContent = content;
  let changes = 0;

  IMPORT_PATTERNS.forEach(pattern => {
    const matches = content.match(pattern) || [];
    changes += matches.length;
    updatedContent = updatedContent.replace(pattern, `from '${BETA_IMPORT}'`);
  });

  return { content: updatedContent, changes };
}

// Update component usage with better prop handling
function updateComponents(content) {
  let updatedContent = content;
  let changes = 0;
  let warnings = [];

  Object.entries(COMPONENT_MAPPING).forEach(([oldComponent, mapping]) => {
    // More robust regex to handle complex JSX
    const componentRegex = new RegExp(`<${oldComponent}(\\s+[^>]*?)?>`, 'g');

    updatedContent = updatedContent.replace(
      componentRegex,
      (match, propsString) => {
        changes++;

        // Parse existing props
        const { props: existingProps, warnings: parseWarnings } =
          parseJSXProps(propsString);
        warnings.push(...parseWarnings);

        // Migrate props
        const { props: migratedProps, warnings: migrateWarnings } =
          migrateProps(existingProps, oldComponent);
        warnings.push(...migrateWarnings);

        // Build new props from mapping
        const newProps = { ...migratedProps };

        // Add mapping props (but don't override existing ones)
        Object.entries(mapping).forEach(([key, value]) => {
          if (key !== 'component' && !newProps[key]) {
            newProps[key] = value;
          }
        });

        // Handle Heading components
        if (mapping.component === 'Heading') {
          const asValue = newProps.as || mapping.as;
          const variantValue = newProps.variant || mapping.variant;

          // Remove as and variant from props since we'll add them separately
          delete newProps.as;
          delete newProps.variant;

          // Ensure mapping props come first
          const orderedProps = {};
          if (newProps.spacing) {
            orderedProps.spacing = newProps.spacing;
            delete newProps.spacing;
          }
          Object.assign(orderedProps, newProps);

          const propsString = propsToString(orderedProps);
          return `<Heading as="${asValue}" variant="${variantValue}"${propsString}>`;
        }

        // Handle other components
        const componentName = mapping.component;

        // Remove mapping props from newProps since they're already set
        Object.keys(mapping).forEach(key => {
          if (key !== 'component') {
            delete newProps[key];
          }
        });

        // Add mapping props in the correct order
        const finalProps = {};
        Object.entries(mapping).forEach(([key, value]) => {
          if (key !== 'component') {
            finalProps[key] = value;
          }
        });
        Object.assign(finalProps, newProps);

        const otherPropsString = propsToString(finalProps);
        return `<${componentName}${otherPropsString}>`;
      },
    );

    // Update closing tags
    const closingTagRegex = new RegExp(`</${oldComponent}>`, 'g');
    const componentName = mapping.component;
    updatedContent = updatedContent.replace(
      closingTagRegex,
      `</${componentName}>`,
    );
  });

  return { content: updatedContent, changes, warnings };
}

/**
 * Find files matching the given pattern in allowed directories
 *
 * This function uses efficient glob patterns and data structures:
 * - Single glob call with brace expansion instead of multiple calls
 * - Set-based extension filtering for O(1) lookups
 * - No array concatenation in loops
 *
 * @param {string} pattern - Glob pattern to match (e.g., '*.{ts,tsx,js,jsx}')
 * @returns {string[]} Array of matching file paths
 */
function findFiles(pattern) {
  // Create a single glob pattern that covers all allowed directories
  // Uses brace expansion: {src,app,components}/**/*.{ts,tsx,js,jsx}
  const combinedPattern = `{${ALLOWED_DIRECTORIES.join(',')}}/${pattern}`;

  // Use a single glob call instead of multiple calls
  const allFiles = glob.sync(combinedPattern, {
    ignore: BLOCKED_DIRECTORIES,
    nodir: true,
    absolute: false,
  });

  // Use Set for efficient deduplication and filtering
  const fileExtensions = new Set([
    '.ts',
    '.tsx',
    '.js',
    '.jsx',
    '.scss',
    '.css',
  ]);

  const uniqueFiles = allFiles.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return fileExtensions.has(ext);
  });

  return uniqueFiles;
}

function updateImportsAndComponents(content, strategy) {
  let updatedContent = content;
  let changes = 0;
  let warnings = [];

  if (strategy === 'import-only') {
    // Only update imports
    const { content: newContent, changes: importChanges } =
      updateImports(content);
    updatedContent = newContent;
    changes = importChanges;
  } else if (strategy === 'complete') {
    // Update both imports and components
    const { content: newContent, changes: importChanges } =
      updateImports(content);
    const {
      content: finalContent,
      changes: componentChanges,
      warnings: componentWarnings,
    } = updateComponents(newContent);
    updatedContent = finalContent;
    changes = importChanges + componentChanges;
    warnings = componentWarnings;
  }

  return { content: updatedContent, changes, warnings };
}

function generateMigrationReport(files, strategy, isDryRun = false) {
  const report = {
    strategy,
    totalFiles: files.length,
    migratedFiles: 0,
    totalChanges: 0,
    totalWarnings: 0,
    files: [],
    warnings: [],
    isDryRun,
  };

  files.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const {
        content: updatedContent,
        changes,
        warnings,
      } = updateImportsAndComponents(content, strategy);

      if (changes > 0) {
        if (!isDryRun) {
          fs.writeFileSync(file, updatedContent, 'utf8');
        }
        report.migratedFiles++;
        report.totalChanges += changes;
        report.totalWarnings += warnings.length;
        report.files.push({ file, changes, warnings });
        report.warnings.push(...warnings.map(warning => `${file}: ${warning}`));
      }
    } catch (error) {
      report.warnings.push(`${file}: Error processing file - ${error.message}`);
    }
  });

  return report;
}

function printReport(report) {
  console.log('\n🎉 Migration Report');
  console.log('==================');
  console.log(`Strategy: ${report.strategy}`);
  console.log(`Total files scanned: ${report.totalFiles}`);
  console.log(`Files migrated: ${report.migratedFiles}`);
  console.log(`Total changes: ${report.totalChanges}`);
  console.log(`Total warnings: ${report.totalWarnings}`);

  if (report.files.length > 0) {
    console.log('\nMigrated files:');
    report.files.forEach(({ file, changes, warnings }) => {
      console.log(
        `  ✅ ${file} (${changes} changes${
          warnings.length > 0 ? `, ${warnings.length} warnings` : ''
        })`,
      );
    });
  }

  if (report.warnings.length > 0) {
    console.log('\n⚠️  Warnings:');

    // Group warnings by type
    const marginWarnings = report.warnings.filter(w => w.includes('Migrated'));
    const semanticWarnings = report.warnings.filter(w =>
      w.includes('expected'),
    );
    const conflictWarnings = report.warnings.filter(w =>
      w.includes('check for conflicts'),
    );

    if (marginWarnings.length > 0) {
      console.log(
        `\n  🔄 Margin → Spacing Migrations (${marginWarnings.length}):`,
      );
      marginWarnings.forEach(warning => console.log(`    ${warning}`));
    }

    if (semanticWarnings.length > 0) {
      console.log(`\n  🎯 Semantic HTML Issues (${semanticWarnings.length}):`);
      semanticWarnings.forEach(warning => console.log(`    ${warning}`));
    }

    if (conflictWarnings.length > 0) {
      console.log(`\n  🚨 Style Conflicts (${conflictWarnings.length}):`);
      conflictWarnings.forEach(warning => console.log(`    ${warning}`));
      console.log(`    → Review these components for styling conflicts`);
    }

    console.log('\n📋 Summary:');
    if (marginWarnings.length > 0)
      console.log(
        `  • ${marginWarnings.length} margin props migrated to spacing`,
      );
    if (semanticWarnings.length > 0)
      console.log(
        `  • ${semanticWarnings.length} semantic HTML issues need review`,
      );
    if (conflictWarnings.length > 0)
      console.log(
        `  • ${conflictWarnings.length} style conflicts need manual review`,
      );
  }
}

function showNextSteps(strategy) {
  console.log('\n📝 Next Steps');
  console.log('=============');

  if (strategy === 'import-only') {
    console.log('1. ✅ Import statements updated');
    console.log('2. 🔄 Update component usage manually when ready:');
    Object.entries(COMPONENT_MAPPING).forEach(([old, new_]) => {
      console.log(`   ${old} → ${new_}`);
    });
    console.log('3. 🧪 Test your application');
    console.log('4. 📚 Read the migration guide on our website');
  } else if (strategy === 'complete') {
    console.log('1. 🧪 Test your application thoroughly');
    console.log('2. 🔄 Review and adjust any component props if needed');
    console.log('3. 📚 Read the migration guide on our website');
  }

  console.log('\n⚠️  Important Notes:');
  console.log('- Check warnings above for potential issues');
  console.log('- Review migrated components for prop conflicts');
  console.log('- Test thoroughly, especially components with custom styling');
}

function main() {
  // Show help if requested
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log('🎨 Typography Migration Script');
    console.log('==============================');
    console.log('');
    console.log('Usage:');
    console.log('  # From npm package (recommended)');
    console.log('  npx @entur/typography@latest migrate [options]');
    console.log('  yarn dlx @entur/typography@latest migrate [options]');
    console.log('');
    console.log('  # Direct execution (requires glob package)');
    console.log('  node scripts/migrate-typography.js [options]');
    console.log('');
    console.log('  # Local development');
    console.log('  npm run migrate');
    console.log('');
    console.log('Options:');
    console.log(
      '  --dry-run        Show what would be changed without modifying files',
    );
    console.log(
      '  --import-only    Import-only migration: update import paths only',
    );

    console.log('  --help, -h       Show this help message');
    console.log('');
    console.log('Migration Modes:');
    console.log('  🚀 Complete Mode (default): Updates everything');
    console.log('     - Replaces old components with beta components');
    console.log('     - May require prop/styling updates');
    console.log('     - Test thoroughly after migration');
    console.log('');
    console.log(
      '  📝 Import-Only Mode (--import-only): Only updates import paths',
    );
    console.log('     - Keeps your existing component usage unchanged');
    console.log('     - Minimal risk, gradual migration');
    console.log('');
    console.log('Examples:');
    console.log('  # See what would be changed');
    console.log('  npx @entur/typography@latest migrate --dry-run');
    console.log('');
    console.log('  # Complete migration: update everything (default)');
    console.log('  npx @entur/typography@latest migrate');
    console.log('');
    console.log('  # Import-only migration: update import paths only');
    console.log('  npx @entur/typography@latest migrate --import-only');
    console.log('');

    console.log('');

    console.log('Environment Variables:');
    console.log(
      '  TYPOGRAPHY_MIGRATION_DIRS  Comma-separated list of directories to scan',
    );
    console.log('                            Example: "src/**,app/**"');
    console.log('');
    console.log('🎯 Customizing Scan Directories:');
    console.log('  Option 1: Edit MIGRATION_FOLDERS in the script (EASIEST)');
    console.log(
      '    Open the script and find the "MIGRATION FOLDERS CONFIGURATION" section',
    );
    console.log('    Add/remove folder patterns between the 👇 and 👆 markers');
    console.log('    Examples: "src/**", "app/**", "packages/my-app/**"');
    console.log('');
    console.log('  Option 2: Set environment variable (for CI/CD)');
    console.log(
      '    export TYPOGRAPHY_MIGRATION_DIRS="src/**,app/**,components/**"',
    );
    console.log('    node scripts/migrate-typography.js');
    console.log('');
    console.log('Security Features:');
    console.log('  - Only scans allowed directories (src/**, app/**, etc.)');
    console.log('  - Never scans node_modules, dist, build, .git, etc.)');
    console.log('  - Dry-run mode for safe testing');
    console.log('');
    process.exit(0);
  }

  console.log('🎨 Typography Migration Script');
  console.log('==============================');
  console.log('');
  console.log(
    'This script helps you migrate from old typography to new beta typography.',
  );
  console.log('');

  // Find files to migrate - use a single efficient pattern
  const allFiles = findFiles('*.{ts,tsx,js,jsx,scss,css}');

  console.log(`Found ${allFiles.length} files to scan for typography imports.`);
  console.log('');

  // Security check
  console.log('🔒 Security: Only scanning allowed directories:');
  ALLOWED_DIRECTORIES.forEach(dir => {
    console.log(`  ✅ ${dir}`);
  });
  console.log('');

  // Safety check
  if (allFiles.length === 0) {
    console.log('⚠️  No files found to scan. This might mean:');
    console.log("   - You're not in the right directory");
    console.log("   - Your project structure doesn't match the allow-list");
    console.log('   - You need to run this from your project root');
    console.log('');
    console.log('Allowed directory patterns:');
    ALLOWED_DIRECTORIES.forEach(dir => console.log(`   ${dir}`));
    process.exit(1);
  }

  console.log('📁 Files will be scanned in these locations:');
  const scannedDirs = [
    ...new Set(allFiles.map(file => path.dirname(file))),
  ].slice(0, 10);

  // Show relative paths safely
  scannedDirs.forEach(dir => {
    // Ensure we don't show absolute paths
    const safeDir = path.isAbsolute(dir)
      ? path.relative(process.cwd(), dir)
      : dir;
    console.log(`  📂 ${safeDir}`);
  });

  if (allFiles.length > 10) {
    console.log(`  ... and ${allFiles.length - 10} more files`);
  }
  console.log('');

  // Parse command line options
  const isDryRun = process.argv.includes('--dry-run');
  const isImportOnly = process.argv.includes('--import-only');

  if (isDryRun) {
    console.log('🔍 DRY RUN MODE: No files will be modified');
    console.log('');
  }

  if (isImportOnly) {
    console.log('📝 IMPORT-ONLY MIGRATION: Updating import paths only');
    console.log('   - Your component usage will remain unchanged');
    console.log('   - You can update components manually later');
  } else {
    console.log('🚀 COMPLETE MIGRATION: Updating imports + component usage');
    console.log('⚠️  WARNING: This will modify your component usage!');
    console.log('   - Old components will be replaced with beta components');
    console.log('   - You may need to update props and styling');
    console.log('   - Test thoroughly after migration');
    console.log('   (Use --import-only for import-only migration)');
  }

  console.log('');

  // Perform migration
  const report = generateMigrationReport(
    allFiles,
    isImportOnly ? 'import-only' : 'complete',
    isDryRun,
  );
  printReport(report);
  showNextSteps(isImportOnly ? 'import-only' : 'complete');

  console.log('\n🎯 Migration complete!');
}

if (require.main === module) {
  main();
}

module.exports = {
  updateImportsAndComponents,
  generateMigrationReport,
  COMPONENT_MAPPING,
  PROPS_MAPPING,
};
