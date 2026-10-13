// `import [folder]` optimises the docs app's illustration SVGs into .cache/illustrations/;
// `publish <ds-bundle>` copies them into the upload. See README.md.

import { createHash } from 'node:crypto';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, '..');
const LIB = join(HERE, '.cache', 'illustrations');
const DEFAULT_SRC = join(
  REPO,
  'apps/documentation/src/downloads/illustrations',
);
const MANIFEST = join(LIB, 'manifest.json');
const THEMES = ['default', 'darkmode', 'contrast'];
// Above MAX_CHANGED of pixels differing by more than PIXEL_DELTA, the original is kept.
const PIXEL_DELTA = 24;
const MAX_CHANGED = 0.001;

// CamelCase is split so `MooseSpring` and `Moose_Spring` give the same name.
const slugify = s =>
  s
    .normalize('NFC')
    .replace(/([a-zæøå0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/\.svg$/, '')
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-z0-9æøå-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

// Theme words appear anywhere in file names (`Dog-contrast-1`, `…_Dark mode`), so they are stripped.
function parseName(file) {
  const words = slugify(file)
    .replace(/-in-circle/, '-circle')
    .split('-');
  let theme = 'default';
  const rest = [];
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    if (w === 'contrast') {
      theme = 'contrast';
      continue;
    }
    if (w === 'darkmode') {
      theme = 'darkmode';
      continue;
    }
    if (w === 'dark') {
      theme = 'darkmode';
      if (words[i + 1] === 'mode') i++;
      continue;
    }
    if (w === 'default') continue;
    rest.push(w);
  }
  return { base: rest.join('-'), theme };
}

const walk = dir =>
  readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    const p = join(dir, e.name);
    return e.isDirectory() ? walk(p) : /\.svg$/i.test(e.name) ? [p] : [];
  });

function aspectOf(svg) {
  const vb =
    /viewBox\s*=\s*["']\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(
      svg,
    );
  if (vb) return [Number(vb[1]), Number(vb[2])];
  const w = /\swidth\s*=\s*["']([\d.]+)/i.exec(svg);
  const h = /\sheight\s*=\s*["']([\d.]+)/i.exec(svg);
  return w && h ? [Number(w[1]), Number(h[1])] : null;
}

async function importLibrary(src) {
  const req = createRequire(join(REPO, '.ds-sync', 'package.json'));
  const { optimize } = req('svgo');
  const { chromium } = req('playwright');
  const files = walk(src);
  const sets = new Map();
  for (const file of files) {
    const category = slugify(relative(src, file).split('/')[0]);
    const { base, theme } = parseName(file.split('/').pop());
    const key = `${category}/${base}`;
    const set = sets.get(key) ?? { slug: base, category, themes: {} };
    if (set.themes[theme])
      throw new Error(
        `${key}: two ${theme} files (${set.themes[theme].source}, ${relative(
          src,
          file,
        )})`,
      );
    set.themes[theme] = { source: relative(src, file) };
    sets.set(key, set);
  }
  const bySlug = new Map();
  for (const s of sets.values()) {
    if (bySlug.has(s.slug))
      throw new Error(
        `slug ${s.slug} in both ${bySlug.get(s.slug)} and ${s.category}`,
      );
    bySlug.set(s.slug, s.category);
  }

  const sha = text => createHash('sha1').update(text).digest('hex');
  const previous = new Map();
  for (const s of readManifest())
    for (const t of Object.values(s.themes)) previous.set(t.file, t);
  const written = new Set();
  let reused = 0;
  mkdirSync(LIB, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage();
  let optimisedCount = 0;
  const kept = [];
  for (const set of [...sets.values()].sort((a, b) =>
    `${a.category}/${a.slug}`.localeCompare(`${b.category}/${b.slug}`),
  )) {
    for (const theme of THEMES) {
      const t = set.themes[theme];
      if (!t) continue;
      const original = readFileSync(join(src, t.source), 'utf8');
      const file = `${set.category}/${set.slug}${
        theme === 'default' ? '' : `-${theme}`
      }.svg`;
      const sourceSha = sha(original);
      const prev = previous.get(file);
      written.add(file);
      if (prev?.sourceSha === sourceSha && existsSync(join(LIB, file))) {
        Object.assign(t, {
          file,
          sourceSha,
          width: prev.width,
          height: prev.height,
          optimised: prev.optimised,
        });
        if (prev.optimised) optimisedCount++;
        reused++;
        continue;
      }
      const optimised = optimize(original, {
        multipass: true,
        path: t.source,
      }).data;
      const aspect = aspectOf(original);
      if (!aspect) throw new Error(`${t.source}: no viewBox or width/height`);
      const changed = await page.evaluate(
        async ({ a, b, w, h }) => {
          const load = s =>
            new Promise((res, rej) => {
              const img = new Image();
              img.onload = () => res(img);
              img.onerror = rej;
              img.src =
                'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
            });
          const W = 600,
            H = Math.max(1, Math.round((600 * h) / w));
          const draw = async s => {
            const c = new OffscreenCanvas(W, H);
            const ctx = c.getContext('2d');
            ctx.drawImage(await load(s), 0, 0, W, H);
            return ctx.getImageData(0, 0, W, H).data;
          };
          const [pa, pb] = [await draw(a), await draw(b)];
          let n = 0;
          for (let i = 0; i < pa.length; i += 4) {
            if (
              Math.abs(pa[i] - pb[i]) > 24 ||
              Math.abs(pa[i + 1] - pb[i + 1]) > 24 ||
              Math.abs(pa[i + 2] - pb[i + 2]) > 24 ||
              Math.abs(pa[i + 3] - pb[i + 3]) > 24
            )
              n++;
          }
          return n / (W * H);
        },
        { a: original, b: optimised, w: aspect[0], h: aspect[1] },
      );
      const useOptimised =
        changed <= MAX_CHANGED && optimised.length < original.length;
      if (!useOptimised)
        kept.push(
          `${t.source} (${(changed * 100).toFixed(3)}% pixels changed)`,
        );
      else optimisedCount++;
      mkdirSync(join(LIB, set.category), { recursive: true });
      writeFileSync(join(LIB, file), useOptimised ? optimised : original);
      Object.assign(t, {
        file,
        sourceSha,
        width: aspect[0],
        height: aspect[1],
        optimised: useOptimised,
      });
    }
  }
  await browser.close();
  for (const f of walk(LIB)) {
    const rel = relative(LIB, f);
    if (!written.has(rel)) rmSync(f);
  }
  const list = [...sets.values()].sort((a, b) =>
    `${a.category}/${a.slug}`.localeCompare(`${b.category}/${b.slug}`),
  );
  writeFileSync(
    MANIFEST,
    JSON.stringify(
      { source: relative(REPO, src), illustrations: list },
      null,
      2,
    ) + '\n',
  );
  const bytes = walk(LIB).reduce((n, f) => n + statSync(f).size, 0);
  console.error(
    `  illustrations: ${files.length} svg -> ${
      list.length
    } sets, ${reused} reused, ${optimisedCount} optimised, ${
      kept.length
    } kept original, ${(bytes / 1048576).toFixed(1)} MB`,
  );
  for (const k of kept) console.error(`    kept original: ${k}`);
}

const readManifest = () =>
  existsSync(MANIFEST)
    ? JSON.parse(readFileSync(MANIFEST, 'utf8')).illustrations
    : [];

// data-color-mode="dark" and the Contrast component (`.eds-contrast`) swap in the theme variants.
export function illustrationsCss() {
  const sets = readManifest();
  if (!sets.length) return '';
  const url = t => `url("illustrations/${t.file}")`;
  const out = [
    '/* Entur illustration library - .design-sync/illustrations.mjs */',
    '.linje-illustration{display:block;width:100%;max-width:100%;background:center/contain no-repeat}',
  ];
  for (const s of sets) {
    const c = `.linje-illustration--${s.slug}`;
    const any = s.themes.default ?? s.themes.darkmode ?? s.themes.contrast;
    out.push(
      `${c}{aspect-ratio:${any.width}/${any.height}${
        s.themes.default ? `;background-image:${url(s.themes.default)}` : ''
      }}`,
    );
    if (s.themes.darkmode)
      out.push(
        `[data-color-mode=dark] ${c},[data-color-mode=dark]${c}{background-image:${url(
          s.themes.darkmode,
        )}}`,
      );
    if (s.themes.contrast)
      out.push(
        `.eds-contrast ${c}{background-image:${url(s.themes.contrast)}}`,
      );
  }
  return out.join('\n') + '\n';
}

function publish(outDir) {
  const sets = readManifest();
  const dest = join(outDir, 'illustrations');
  rmSync(dest, { recursive: true, force: true });
  if (!sets.length) return;
  for (const s of sets)
    for (const t of Object.values(s.themes)) {
      mkdirSync(dirname(join(dest, t.file)), { recursive: true });
      copyFileSync(join(LIB, t.file), join(dest, t.file));
    }
  const byCat = new Map();
  for (const s of sets)
    (byCat.get(s.category) ?? byCat.set(s.category, []).get(s.category)).push(
      s,
    );
  const lines = [
    '# Entur illustrations',
    '',
    'Render one with `<div className="linje-illustration linje-illustration--<name>" role="img" aria-label="…" />` and give the element a width;',
    'height follows the aspect ratio. Dark mode (`data-color-mode="dark"`) and `Contrast` swap in the matching variant automatically.',
    'Names marked (dark mode only) / (contrast only) render nothing in the other themes.',
    '',
  ];
  for (const [cat, list] of byCat) {
    lines.push(`## ${cat}`, '');
    for (const s of list) {
      const has = THEMES.filter(t => s.themes[t]);
      const note = !s.themes.default
        ? ` (${has
            .map(t => (t === 'darkmode' ? 'dark mode' : t))
            .join(' + ')} only)`
        : '';
      lines.push(`- \`${s.slug}\`${note}`);
    }
    lines.push('');
  }
  writeFileSync(join(dest, 'README.md'), lines.join('\n'));
  const n = sets.reduce((k, s) => k + Object.keys(s.themes).length, 0);
  console.error(
    `  illustrations: published ${n} files (${sets.length} sets) -> ${dest}`,
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [cmd, arg] = process.argv.slice(2);
  if (cmd === 'import') await importLibrary(resolve(arg ?? DEFAULT_SRC));
  else if (cmd === 'publish' && arg) publish(resolve(arg));
  else {
    console.error(
      'usage: node .design-sync/illustrations.mjs import [library-folder] | publish <ds-bundle>',
    );
    process.exit(2);
  }
}
