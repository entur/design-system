#!/usr/bin/env node

/**
 * Typography Migration Script
 *
 * This script helps you migrate from old typography components to new beta typography.
 *
 * Usage:
 * 1. Run this script in your project root
 * 2. Follow the prompts to migrate your typography imports
 * 3. Update your styles as needed
 *
 * Options:
 *   --dry-run     Show what would be changed without modifying files
 *   --direct      Skip migration helpers and go directly to beta components
 *
 * Environment Variables:
 *   TYPOGRAPHY_MIGRATION_DIRS  Comma-separated list of directories to scan
 *                              Example: "src/**,app/**"
 *
 * Security Features:
 *   - Only scans allowed directories (src/**, app/**, etc.)
 *   - Never scans node_modules, dist, build, .git, etc.
 *   - Dry-run mode for safe testing
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const OLD_IMPORT = '@entur/typography';
const NEW_IMPORT = '@entur/typography/migration';
const BETA_IMPORT = '@entur/typography';

// Security: Allow-list of directories to scan
// Users can override this by setting TYPOGRAPHY_MIGRATION_DIRS environment variable
// Example: TYPOGRAPHY_MIGRATION_DIRS="src/**,app/**" node scripts/migrate-typography.js
const DEFAULT_ALLOWED_DIRECTORIES = [
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
];

const ALLOWED_DIRECTORIES = process.env.TYPOGRAPHY_MIGRATION_DIRS
  ? process.env.TYPOGRAPHY_MIGRATION_DIRS.split(',')
  : DEFAULT_ALLOWED_DIRECTORIES;

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

// Component mapping for direct migration
const COMPONENT_MAPPING = {
  Heading1: 'Heading as="h1" variant="title-1"',
  Heading2: 'Heading as="h2" variant="title-2"',
  Heading3: 'Heading as="h3" variant="subtitle-1"',
  Heading4: 'Heading as="h4" variant="subtitle-2"',
  Heading5: 'Heading as="h5" variant="section-1"',
  Heading6: 'Heading as="h6" variant="section-2"',
  Paragraph: 'Text variant="paragraph"',
  LeadParagraph: 'Text variant="leading"',
  SmallText: 'Text variant="subparagraph" size="s"',
  StrongText: 'Text variant="emphasized" weight="semibold"',
  SubLabel: 'Text variant="sublabel" size="xs"',
  SubParagraph: 'Text variant="subparagraph"',
  Label: 'Text variant="label"',
  EmphasizedText: 'Text variant="emphasized"',
  CodeText: 'Text variant="code-text"',
  Link: 'LinkBeta',
  Blockquote: 'BlockquoteBeta',
};

function findFiles(pattern) {
  // Use allow-list to only scan specific directories
  const allowedPatterns = ALLOWED_DIRECTORIES.map(dir => `${dir}/${pattern}`);

  let allFiles = [];
  allowedPatterns.forEach(allowedPattern => {
    const files = glob.sync(allowedPattern, {
      ignore: BLOCKED_DIRECTORIES,
      nodir: true, // Don't include directories
      absolute: false, // Use relative paths
    });
    allFiles = allFiles.concat(files);
  });

  // Remove duplicates and filter out non-source files
  const uniqueFiles = [...new Set(allFiles)].filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.ts', '.tsx', '.js', '.jsx', '.scss', '.css'].includes(ext);
  });

  return uniqueFiles;
}

function updateImports(content, strategy) {
  let updatedContent = content;
  let changes = 0;

  if (strategy === 'migration') {
    // Replace old imports with migration helpers
    const oldImportRegex = /from\s+['"`]@entur\/typography['"`]/g;
    updatedContent = content.replace(oldImportRegex, `from '${NEW_IMPORT}'`);
    changes += (content.match(oldImportRegex) || []).length;
  } else if (strategy === 'direct') {
    // Replace old imports with beta imports
    const oldImportRegex = /from\s+['"`]@entur\/typography['"`]/g;
    updatedContent = content.replace(oldImportRegex, `from '${BETA_IMPORT}'`);
    changes += (content.match(oldImportRegex) || []).length;
  }

  return { content: updatedContent, changes };
}

function generateMigrationReport(files, strategy, isDryRun = false) {
  const report = {
    strategy,
    totalFiles: files.length,
    migratedFiles: 0,
    totalChanges: 0,
    files: [],
    isDryRun,
  };

  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const { content: updatedContent, changes } = updateImports(
      content,
      strategy,
    );

    if (changes > 0) {
      if (!isDryRun) {
        fs.writeFileSync(file, updatedContent, 'utf8');
      }
      report.migratedFiles++;
      report.totalChanges += changes;
      report.files.push({ file, changes });
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

  if (report.files.length > 0) {
    console.log('\nMigrated files:');
    report.files.forEach(({ file, changes }) => {
      console.log(`  ✅ ${file} (${changes} changes)`);
    });
  }
}

function showNextSteps(strategy) {
  console.log('\n📝 Next Steps');
  console.log('=============');

  if (strategy === 'migration') {
    console.log('1. ✅ Import statements updated to use migration helpers');
    console.log('2. 🔄 Update your styles:');
    console.log('   Replace: @import "~@entur/typography/dist/styles.css"');
    console.log(
      '   With:    @import "~@entur/typography/src/beta/styles.scss"',
    );
    console.log('3. 🧪 Test your application');
    console.log(
      '4. 📚 Read the migration guide: packages/typography/MIGRATION.md',
    );
    console.log('5. 🚀 Later, migrate to direct beta components when ready');
  } else {
    console.log('1. ✅ Import statements updated to use beta components');
    console.log('2. 🔄 Update component usage according to mapping:');
    Object.entries(COMPONENT_MAPPING).forEach(([old, new_]) => {
      console.log(`   ${old} → ${new_}`);
    });
    console.log('3. 🔄 Update your styles:');
    console.log('   Replace: @import "~@entur/typography/dist/styles.css"');
    console.log(
      '   With:    @import "~@entur/typography/src/beta/styles.scss"',
    );
    console.log('4. 🧪 Test your application');
    console.log(
      '5. 📚 Read the migration guide: packages/typography/MIGRATION.md',
    );
  }
}

function main() {
  // Show help if requested
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log('🎨 Typography Migration Script');
    console.log('==============================');
    console.log('');
    console.log('Usage: node scripts/migrate-typography.js [options]');
    console.log('');
    console.log('Options:');
    console.log(
      '  --dry-run     Show what would be changed without modifying files',
    );
    console.log(
      '  --direct      Skip migration helpers and go directly to beta components',
    );
    console.log('  --help, -h    Show this help message');
    console.log('');
    console.log('Environment Variables:');
    console.log(
      '  TYPOGRAPHY_MIGRATION_DIRS  Comma-separated list of directories to scan',
    );
    console.log('                            Example: "src/**,app/**"');
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

  // Find files to migrate using allow-list approach
  const patterns = ['*.{ts,tsx,js,jsx}', '*.{scss,css}'];

  let allFiles = [];
  patterns.forEach(pattern => {
    const files = findFiles(pattern);
    allFiles = allFiles.concat(files);
  });

  console.log(`Found ${allFiles.length} files to scan for typography imports.`);
  console.log('');

  // Security check: Show which directories are being scanned
  console.log('🔒 Security: Only scanning allowed directories:');
  ALLOWED_DIRECTORIES.forEach(dir => {
    console.log(`  ✅ ${dir}`);
  });
  console.log('');

  // Safety check: Confirm before proceeding
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
  scannedDirs.forEach(dir => console.log(`  📂 ${dir}`));
  if (allFiles.length > 10) {
    console.log(`  ... and ${allFiles.length - 10} more files`);
  }
  console.log('');

  // Ask for migration strategy
  console.log('Choose your migration strategy:');
  console.log(
    '1. Migration helpers (recommended) - Gradual migration with backward compatibility',
  );
  console.log('2. Direct migration - Skip to beta components directly');
  console.log('');

  // Parse command line options
  const isDryRun = process.argv.includes('--dry-run');
  const strategy = process.argv.includes('--direct') ? 'direct' : 'migration';

  if (isDryRun) {
    console.log('🔍 DRY RUN MODE: No files will be modified');
    console.log('');
  }

  console.log(
    `Using strategy: ${
      strategy === 'direct' ? 'Direct migration' : 'Migration helpers'
    }`,
  );
  console.log('');

  // Perform migration
  const report = generateMigrationReport(allFiles, strategy, isDryRun);
  printReport(report);
  showNextSteps(strategy);

  console.log('\n🎯 Migration complete!');
  console.log('For detailed guidance, see: packages/typography/MIGRATION.md');
}

if (require.main === module) {
  main();
}

module.exports = {
  updateImports,
  generateMigrationReport,
  COMPONENT_MAPPING,
};
