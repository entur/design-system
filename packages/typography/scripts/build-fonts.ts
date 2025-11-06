import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import sass from 'sass';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packageRoot = resolve(__dirname, '..');
const srcFontsScss = resolve(packageRoot, 'src/fonts.scss');
const distBetaStylesFontsDir = resolve(packageRoot, 'dist/beta/styles/fonts');
const distBetaStylesFontsCss = resolve(distBetaStylesFontsDir, 'index.css');
const fontsDir = resolve(packageRoot, 'fonts');
const fontsScss = resolve(fontsDir, 'index.scss');
const fontsCss = resolve(fontsDir, 'index.css');

// Ensure directories exist
mkdirSync(distBetaStylesFontsDir, { recursive: true });
mkdirSync(fontsDir, { recursive: true });

if (!existsSync(srcFontsScss)) {
  console.error(`Error: ${srcFontsScss} not found`);
  process.exit(1);
}

try {
  // Read the SCSS file
  let scssContent = readFileSync(srcFontsScss, 'utf-8');

  // 1. Copy SCSS to fonts folder (update paths to './' since fonts are in the same folder)
  let fontsScssForCopy = scssContent.replace(/url\('\.\.\/fonts\//g, "url('./");
  fontsScssForCopy = fontsScssForCopy.replace(
    /url\("\.\.\/fonts\//g,
    'url("./',
  );
  writeFileSync(fontsScss, fontsScssForCopy);
  console.log(`✓ Copied fonts.scss → fonts/index.scss (with updated paths)`);

  // 2. Compile SCSS to CSS for fonts folder (paths should be './' since fonts are in same folder)
  let fontsScssContent = scssContent.replace(/url\('\.\.\/fonts\//g, "url('./");
  fontsScssContent = fontsScssContent.replace(
    /url\("\.\.\/fonts\//g,
    'url("./',
  );

  const fontsResult = sass.compileString(fontsScssContent, {
    loadPaths: [
      resolve(packageRoot, '../../packages'),
      resolve(packageRoot, '../../node_modules'),
    ],
    style: 'expanded',
  });

  writeFileSync(fontsCss, fontsResult.css);
  console.log(`✓ Compiled fonts.scss → fonts/index.css`);

  // 3. Compile for dist/beta/styles/fonts (paths should be '../../../../fonts/')
  let betaScssContent = scssContent.replace(
    /url\('\.\.\/fonts\//g,
    "url('../../../../fonts/",
  );
  betaScssContent = betaScssContent.replace(
    /url\("\.\.\/fonts\//g,
    'url("../../../../fonts/',
  );

  const betaResult = sass.compileString(betaScssContent, {
    loadPaths: [
      resolve(packageRoot, '../../packages'),
      resolve(packageRoot, '../../node_modules'),
    ],
    style: 'expanded',
  });

  writeFileSync(distBetaStylesFontsCss, betaResult.css);
  console.log(`✓ Compiled fonts.scss → dist/beta/styles/fonts/index.css`);
} catch (error) {
  console.error('Error compiling fonts.scss:', error);
  process.exit(1);
}
