/**
 * Checks that the illustration files follow the naming convention, which the illustration
 * page relies on to find the colour mode, background and format of each file:
 *
 *   Category/Item name/{PDF,PNG,SVG}/Item name[ qualifier][-background][-darkmode|-contrast].ext
 *
 * Utviklingsprinsipper also uses -bw, -bw-bubble and -color-bubble, and scenarios put the
 * place first: City-, Train-station- or Mountain-<person>. The convention itself lives in the
 * Figma file Illustration Library, section «Navnekonvensjon – illustrasjoner».
 *
 * Usage: node tools/check-illustration-names/index.mjs [folder]
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const fromRepo = path =>
  fileURLToPath(new URL(`../../${path}`, import.meta.url));
const ROOT =
  process.argv[2] ?? fromRepo('apps/documentation/src/downloads/illustrations');
const CATEGORIES_FILE = fromRepo(
  'apps/documentation/src/components/Media/illustrationCategories.ts',
);
const FORMAT_FOLDERS = { PNG: 'png', SVG: 'svg', PDF: 'pdf' };
const SCENE_PLACES = ['City', 'Train-station', 'Mountain'];

// Kept as they are until someone decides what to do with them, see the README section
const KNOWN_EXCEPTIONS = new Set([
  'Scenario/Other/Bench.png',
  'Scenario/Other/Citybike.png',
  'Scenario/Other/Train.png',
  'Scenario/Other/Winter.png',
]);
// Folders whose files are named after their content, not after the folder
const FREE_NAMES_IN = new Set([
  'Devices/Mobile with content',
  'Concepts/Transport Concepts',
]);

const categories = [
  ...readFileSync(CATEGORIES_FILE, 'utf8').matchAll(/folder:\s*'([^']+)'/g),
].map(match => match[1]);

const SUFFIX =
  /(-background)?(-darkmode|-contrast)?(-bw-bubble|-color-bubble|-bw)?$/;

const files = [];
const walk = dir => {
  for (const name of readdirSync(dir)) {
    if (name.startsWith('.')) continue;
    const path = join(dir, name);
    statSync(path).isDirectory()
      ? walk(path)
      : files.push(relative(ROOT, path).split(sep).join('/'));
  }
};
walk(ROOT);

const problems = new Map();
for (const path of files) {
  if (KNOWN_EXCEPTIONS.has(path)) continue;
  const report = message =>
    problems.set(path, [...(problems.get(path) ?? []), message]);
  const parts = path.normalize('NFC').split('/');

  if (parts.length !== 4) {
    report('Expected Category/Item name/{PDF,PNG,SVG}/file.');
    continue;
  }
  const [category, item, formatFolder, fileName] = parts;
  const dot = fileName.lastIndexOf('.');
  const stem = fileName.slice(0, dot);
  const extension = fileName.slice(dot + 1);

  if (!categories.includes(category)) {
    report(
      `Unknown category «${category}». Add it to illustrationCategories.ts or use an existing one.`,
    );
  }
  if (!(formatFolder in FORMAT_FOLDERS)) {
    report(`Format folder «${formatFolder}» must be PNG, SVG or PDF.`);
  } else if (extension !== FORMAT_FOLDERS[formatFolder]) {
    report(
      `A .${extension} file does not belong in ${formatFolder}/. Use a lowercase .${FORMAT_FOLDERS[formatFolder]}.`,
    );
  }

  if (/_/.test(stem))
    report('Use «-» before suffixes and spaces inside names, never «_».');
  if (/ {2}|^ | $| -|- /.test(stem))
    report('No double, leading or trailing spaces, and no space next to «-».');
  // Whatever is left after the valid suffixes are removed is a misspelled or misplaced one
  const leftover = stem.replace(SUFFIX, '');
  if (
    /[-_](background|darkmode|dark ?mode|dark|contrast|contarst|default|circle)\b/i.test(
      leftover,
    ) ||
    / (darkmode|dark mode|contrast|contarst|default|circle)$/i.test(leftover)
  ) {
    report(
      'Suffixes are lowercase -background, -darkmode and -contrast. The default version has no suffix.',
    );
  }

  const base = leftover;
  const scene = item.startsWith('Scene-') ? item.slice('Scene-'.length) : null;
  const expected = scene
    ? SCENE_PLACES.map(place => `${place}-${scene}`)
    : [item, ...(category === 'Scenario' ? [`Scene-${item}`] : [])];
  const startsRight = expected.some(
    name => base === name || base.startsWith(`${name} `),
  );
  if (!startsRight && !FREE_NAMES_IN.has(`${category}/${item}`)) {
    report(
      `The name should start with «${expected.join(
        '» or «',
      )}», then an optional qualifier and the suffixes.`,
    );
  }
}

if (problems.size > 0) {
  console.error(
    `${problems.size} illustration file(s) do not follow the naming convention:\n`,
  );
  for (const [path, messages] of problems) {
    console.error(`  ${path}`);
    for (const message of messages) console.error(`    - ${message}`);
  }
  console.error(
    '\nRename the files in Figma and Google Drive as well, see «Illustrations» in README.md.',
  );
  process.exit(1);
}

console.log(
  `All ${files.length} illustration files follow the naming convention.`,
);
