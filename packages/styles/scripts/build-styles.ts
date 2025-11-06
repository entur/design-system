import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  copyFileSync,
  existsSync,
  watch,
  unlinkSync,
  rmSync,
} from 'fs';
import { resolve, dirname } from 'path';
import sass from 'sass';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packageRoot = resolve(__dirname, '..');
const srcDir = resolve(packageRoot, 'src');
const distDir = resolve(packageRoot, 'dist');
const distScssDir = resolve(distDir, 'scss');
const distCssDir = resolve(distDir, 'css');

const isWatchMode = process.argv.includes('--watch');

// Files to process
const scssFiles = ['normalize.scss']; // Only compile normalize, not index
const scssFilesToCopy = ['component-imports.scss']; // SCSS files to copy (not compile, to preserve imports)

function build() {
  // Remove dist directory if it exists (clean build)
  if (existsSync(distDir)) {
    rmSync(distDir, { recursive: true, force: true });
  }

  // Ensure directories exist
  mkdirSync(distScssDir, { recursive: true });
  mkdirSync(distCssDir, { recursive: true });

  console.log('Building styles package...\n');

  // Copy SCSS files to dist/scss
  console.log('Copying SCSS files to dist/scss/...');
  for (const file of scssFiles) {
    const srcPath = resolve(srcDir, file);
    const destPath = resolve(distScssDir, file);

    if (!existsSync(srcPath)) {
      console.warn(`Warning: ${file} not found, skipping`);
      continue;
    }

    // For normalize.scss, inline modern-normalize before copying
    if (file === 'normalize.scss') {
      // Read modern-normalize CSS
      const modernNormalizePath = resolve(
        packageRoot,
        '../../node_modules/modern-normalize/modern-normalize.css',
      );
      let scssContent = readFileSync(srcPath, 'utf-8');

      if (existsSync(modernNormalizePath)) {
        const modernNormalizeCss = readFileSync(modernNormalizePath, 'utf-8');
        // Replace the meta.load-css line with the actual CSS content (as SCSS comment + CSS)
        const modernNormalizeInlined = `  /* Inlined modern-normalize */\n${modernNormalizeCss
          .split('\n')
          .map(line => `  ${line}`)
          .join('\n')}`;
        scssContent = scssContent.replace(
          /@include meta\.load-css\('modern-normalize\/modern-normalize\.css'\);/,
          modernNormalizeInlined,
        );
        // Also remove the sass:meta import if it's only used for this
        scssContent = scssContent.replace(/@use 'sass:meta';\n\n/, '');
      } else {
        console.warn(
          'Warning: modern-normalize not found, copying original file',
        );
      }

      writeFileSync(destPath, scssContent);
      console.log(`  ✓ ${file} (with inlined modern-normalize)`);
    } else {
      copyFileSync(srcPath, destPath);
      console.log(`  ✓ ${file}`);
    }
  }

  // Also copy index.scss and component-imports.scss (but don't compile them)
  const indexScss = resolve(srcDir, 'index.scss');
  if (existsSync(indexScss)) {
    // Copy as-is (source already uses @use)
    copyFileSync(indexScss, resolve(distScssDir, 'index.scss'));
    console.log(`  ✓ index.scss`);
  }

  // Copy SCSS files that should be preserved as-is (not compiled)
  for (const file of scssFilesToCopy) {
    const srcPath = resolve(srcDir, file);
    const destScssPath = resolve(distScssDir, file);
    // Copy as .css to dist/css to preserve @import statements
    const destCssPath = resolve(distCssDir, file.replace('.scss', '.css'));

    if (!existsSync(srcPath)) {
      console.warn(`Warning: ${file} not found, skipping`);
      continue;
    }

    copyFileSync(srcPath, destScssPath);
    copyFileSync(srcPath, destCssPath);
    console.log(`  ✓ ${file} (copied to scss/ and css/)`);
  }

  // Compile SCSS to CSS
  console.log('\nCompiling SCSS to CSS...');
  for (const file of scssFiles) {
    const srcPath = resolve(srcDir, file);
    const cssFileName = file.replace('.scss', '.css');
    const destPath = resolve(distCssDir, cssFileName);

    if (!existsSync(srcPath)) {
      continue;
    }

    try {
      // For normalize.scss, we need to inline modern-normalize
      if (file === 'normalize.scss') {
        // Read modern-normalize CSS
        const modernNormalizePath = resolve(
          packageRoot,
          '../../node_modules/modern-normalize/modern-normalize.css',
        );
        let modernNormalizeCss = '';

        if (existsSync(modernNormalizePath)) {
          modernNormalizeCss = readFileSync(modernNormalizePath, 'utf-8');
        } else {
          console.warn('Warning: modern-normalize not found, skipping inline');
        }

        // Read the SCSS source
        let scssContent = readFileSync(srcPath, 'utf-8');

        // Replace the meta.load-css line with the actual CSS content
        const modernNormalizeInlined = modernNormalizeCss
          ? `  /* Inlined modern-normalize */\n${modernNormalizeCss
              .split('\n')
              .map(line => `  ${line}`)
              .join('\n')}`
          : '';

        scssContent = scssContent.replace(
          /@include meta\.load-css\('modern-normalize\/modern-normalize\.css'\);/,
          modernNormalizeInlined,
        );

        // Write temporary SCSS file
        const tempScssPath = resolve(packageRoot, 'temp-normalize.scss');
        writeFileSync(tempScssPath, scssContent);

        try {
          const result = sass.compile(tempScssPath, {
            loadPaths: [
              resolve(packageRoot, '../../packages'),
              resolve(packageRoot, '../../node_modules'),
            ],
            style: 'expanded',
            silenceDeprecations: ['import'],
          });

          writeFileSync(destPath, result.css);
          console.log(
            `  ✓ ${file} → ${cssFileName} (with inlined modern-normalize)`,
          );
        } finally {
          // Clean up temp file
          if (existsSync(tempScssPath)) {
            unlinkSync(tempScssPath);
          }
        }
      } else {
        // Regular compilation for other files
        const result = sass.compile(srcPath, {
          loadPaths: [
            resolve(packageRoot, '../../packages'),
            resolve(packageRoot, '../../node_modules'),
          ],
          style: 'expanded',
          silenceDeprecations: ['import'],
        });

        writeFileSync(destPath, result.css);
        console.log(`  ✓ ${file} → ${cssFileName}`);
      }
    } catch (error) {
      console.error(`  ✗ Error compiling ${file}:`, error);
      if (!isWatchMode) {
        process.exit(1);
      }
    }
  }

  // Create index.css as entry file that preserves all imports
  // This matches the structure of index.scss but preserves @import statements
  const indexCss = [
    '/* Linje Setup - One-stop import for all Entur Design System styles */',
    '/* This file preserves @import statements for browser-based loading */',
    '',
    '/* 1. CSS layers definition (must come first) */',
    "@import '@entur/utils/dist/layers.css';",
    '',
    '/* 2. Design tokens (CSS variables) - must come before normalize uses them */',
    "@import '@entur/tokens/dist/base.css';",
    '',
    '/* 3. Normalize (includes modern-normalize reset + global defaults) */',
    "@import './normalize.css';",
    '',
    '/* 4. Fonts (Nationale - shared by stable and beta typography) */',
    '/* Fonts should not be in a layer. */',
    "@import '@entur/typography/dist/fonts.css';",
    '',
    '/* 5. Component stylesheets (stable components only) */',
    "@import './component-imports.css';",
    '',
  ].join('\n');
  writeFileSync(resolve(distCssDir, 'index.css'), indexCss);
  console.log('  ✓ index.css (preserved @import)');

  // Create root-level index.scss for Sass resolution (@use '@entur/styles')
  // This allows users to import the package directly without specifying the full path
  const rootIndexScss = "@forward './scss/index.scss';\n";
  writeFileSync(resolve(distDir, 'index.scss'), rootIndexScss);
  console.log('  ✓ index.scss (root-level entry for @use)');

  // Create root-level index.css with actual content (not just an import)
  // This is the primary entry point for CSS imports (@import '@entur/styles')
  // Fix relative paths to point to css/ subdirectory
  let rootIndexCssContent = readFileSync(
    resolve(distCssDir, 'index.css'),
    'utf-8',
  );
  rootIndexCssContent = rootIndexCssContent.replace(
    /@import '\.\/(normalize|component-imports)\.css';/g,
    "@import './css/$1.css';",
  );
  writeFileSync(resolve(distDir, 'index.css'), rootIndexCssContent);
  console.log('  ✓ index.css (root-level entry for @import)');

  console.log('\n✓ Build complete!');
  console.log(`  SCSS files: ${distScssDir}`);
  console.log(`  CSS files: ${distCssDir}\n`);
}

// Run build
build();

// Watch mode
if (isWatchMode) {
  console.log('Watching for changes...\n');

  const filesToWatch = [
    ...scssFiles.map(f => resolve(srcDir, f)),
    ...scssFilesToCopy.map(f => resolve(srcDir, f)),
    resolve(srcDir, 'index.scss'),
  ].filter(f => existsSync(f));

  watch(srcDir, { recursive: false }, (eventType, filename) => {
    if (filename && filesToWatch.some(f => f.endsWith(filename))) {
      console.log(`\n📝 File changed: ${filename}`);
      build();
    }
  });
}
