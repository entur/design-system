// Turns a ds-bundle into the file layout of a Design System artifact on claude.ai.
// Usage: node .design-sync/design-system.mjs <ds-bundle> [out]. See README.md.

import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import {
  basename,
  dirname,
  isAbsolute,
  join,
  relative,
  resolve,
} from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const SOURCES = join(HERE, 'design-system');
const TITLE = 'Entur Linje (beta)';
const NAMESPACE = 'EnturLinje';
const TOKEN_FILES = [
  'base.css',
  'data.css',
  'primitive.css',
  'semantic.css',
  'styles.css',
  'transport.css',
];
const LIGHT = new Set([
  ':root',
  "[data-color-mode='light'], :root",
  '[data-color-mode=light], :root',
]);
const DARK = new Set(["[data-color-mode='dark']", '[data-color-mode=dark]']);
// tokens/styles.css prefixes and the tokens.json family each goes to; null stays in bundle.css.
const STYLE_FAMILIES = [
  ['border-radiuses-', 'radius'],
  ['border-widths-', 'borderWidth'],
  ['breakpoints-', 'breakpoint'],
  ['colors-', 'color'],
  ['font-sizes-', 'fontSize'],
  ['font-weights-', 'fontWeight'],
  ['line-heights-', 'lineHeight'],
  ['outline-offsets-', 'outlineOffset'],
  ['outlines-', null],
  ['shadows-', 'shadow'],
  ['space-', 'spacing'],
  ['timings-', null],
  ['z-indexes-', 'zIndex'],
];
const OTHER_FAMILIES = [
  'size',
  'borderWidth',
  'breakpoint',
  'fontSize',
  'fontWeight',
  'lineHeight',
  'outlineOffset',
  'zIndex',
];
const TYPE_STYLES = [
  ['heading1', 'eds-h1', 'Heading1', 600],
  ['heading2', 'eds-h2', 'Heading2', 600],
  ['heading3', 'eds-h3', 'Heading3', 600],
  ['heading4', 'eds-h4', 'Heading4', 600],
  ['heading5', 'eds-h5', 'Heading5', 600],
  ['heading6', 'eds-h6', 'Heading6', 600],
  ['lead-paragraph', 'eds-lead-paragraph', 'LeadParagraph'],
  ['paragraph', 'eds-paragraph', 'Paragraph'],
  ['sub-paragraph', 'eds-sub-paragraph', 'SubParagraph'],
  ['small-text', 'eds-small-text', 'SmallText'],
  ['label', 'eds-label', 'Label'],
  ['sub-label', 'eds-sub-label', 'SubLabel'],
];
const FONT_FACES = [
  [300, 'Light'],
  [400, 'Regular'],
  [500, 'Medium'],
  [600, 'Demibold'],
];
const DESKTOP_MEDIA = '@media screen and (min-width: 50rem)';
// The README's paths are written for the ds-bundle layout.
const README_PATHS = [
  [
    '- Load `styles.css` once.',
    '- Load `tokens.css` and `components/bundle.css` once.',
  ],
  ['`illustrations/README.md`', '`assets/illustrations/README.md`'],
  [
    '- `components/<group>/<Name>/<Name>.d.ts` is the props contract; `<Name>.prompt.md` shows usage.',
    '- `components/<Name>/<Name>.d.ts` is the props contract; `components/<Name>/README.md` shows usage.\n- `tokens.json`: the same tokens as data, with light and dark themes; `tokens.css` is generated from it.',
  ],
  ['- `_ds_bundle.js` — ', '- `components/bundle.js` — '],
  [
    '- `styles.css` — the single stylesheet entry: it `@import`s the tokens, fonts, and component styles (`_ds_bundle.css`). Link this one file.',
    '- `tokens.css` and `components/bundle.css` — the stylesheets: `tokens.css` holds every token in `tokens.json` plus the `@font-face` rules, `components/bundle.css` the component styles. Link both.',
  ],
  [
    '- `components/<group>/<Name>/<Name>.prompt.md` (example JSX + variants), `<Name>.d.ts` (types), `<Name>.html` (variant grid).',
    '- `components/<Name>/README.md` (example JSX + variants), `<Name>.d.ts` (types), `preview.html` (variant grid).',
  ],
  [
    'read_file("components/<group>/<Name>/<Name>.prompt.md")',
    'read_file("components/<Name>/README.md")',
  ],
  [
    '<link rel="stylesheet" href="styles.css">',
    '<link rel="stylesheet" href="tokens.css"><link rel="stylesheet" href="components/bundle.css">',
  ],
  [
    '<script src="_ds_bundle.js"></script>',
    '<script src="components/bundle.js"></script>',
  ],
];

const read = p => readFileSync(p, 'utf8');
const write = (p, s) => {
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, s);
};
const copy = (from, to) => {
  mkdirSync(dirname(to), { recursive: true });
  copyFileSync(from, to);
};
// Skips dot-files (.DS_Store and the like): the artifact refuses them.
const names = (dir, dirs = false) =>
  readdirSync(dir, { withFileTypes: true })
    .filter(e => !e.name.startsWith('.') && (!dirs || e.isDirectory()))
    .map(e => e.name)
    .sort();
const fail = msg => {
  console.error(`design-system: ${msg}`);
  process.exit(1);
};
// Fails on a missing path or a ds-bundle path left behind, so stale paths never ship.
const rewrite = (p, pairs) => {
  let s = read(p);
  for (const [from, to] of pairs) {
    if (!s.includes(from)) fail(`${p}: not found: ${from}`);
    s = s.replaceAll(from, to);
  }
  const left = /_ds_bundle|\.prompt\.md/.exec(s);
  if (left) fail(`${p}: ${left[0]} left after rewrite`);
  return s;
};

// Comments are blanked, not removed, so offsets into the original text stay valid.
const blankComments = css =>
  css.replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, ' '));

function* rules(css) {
  const text = blankComments(css);
  const stack = [];
  let prev = 0;
  for (const m of text.matchAll(/[{}]/g)) {
    if (m[0] === '{') {
      const sel = text.slice(prev, m.index).split(';').pop().split('}').pop();
      stack.push([sel.trim().split(/\s+/).join(' '), m.index + 1]);
    } else {
      const [sel, start] = stack.pop();
      const body = text.slice(start, m.index);
      if (!body.includes('{'))
        yield {
          sel,
          parents: stack.map(s => s[0]),
          body,
          decls: [
            ...body.matchAll(/(--[A-Za-z0-9_-]+)\s*:\s*([^;]*?)\s*(?:;|$)/g),
          ].map(d => ({
            name: d[1].slice(2),
            value: d[2].trim(),
            start: start + d.index,
            end: start + d.index + d[0].length,
          })),
        };
    }
    prev = m.index + 1;
  }
}

function readTokens(dir) {
  const light = new Map();
  const dark = new Map();
  const fileOf = new Map();
  for (const f of TOKEN_FILES) {
    const p = join(dir, f);
    if (!existsSync(p)) fail(`missing ${p}`);
    for (const r of rules(read(p)))
      for (const d of r.decls) {
        if (DARK.has(r.sel)) dark.set(d.name, d.value);
        else {
          light.set(d.name, d.value);
          if (!fileOf.has(d.name)) fileOf.set(d.name, f);
        }
      }
  }
  return { light, dark, fileOf };
}

const MODES = new Set([
  'bicycle',
  'bus',
  'cableway',
  'ferry',
  'funicular',
  'helicopter',
  'metro',
  'mobility',
  'plane',
  'taxi',
  'train',
  'tram',
  'walk',
  'airportlinkbus',
  'airportlinkrail',
]);

function family(name, file) {
  if (file === 'styles.css') {
    const hit = STYLE_FAMILIES.find(([pre]) => name.startsWith(pre));
    if (!hit) fail(`no family for --${name}`);
    return hit[1];
  }
  if (file === 'primitive.css' && name.startsWith('size-')) return 'size';
  return 'color';
}

function usage(name, fam, file, value) {
  const p = name.split('-');
  if (file === 'base.css') {
    const kind = p[1];
    const role = p.slice(2).join(' ');
    if (kind === 'shape' && MODES.has(p.slice(2, -1).join('-')))
      return `Transport-mode shape colour for ${p.slice(2, -1).join('-')} (${
        p.at(-1) === 'contrast'
          ? 'on the contrast surface'
          : 'on standard surfaces'
      }); switches in dark mode. Use for transport icons and line markers.`;
    const what = {
      frame: [
        'Surface (frame) colour',
        'Use for page and panel backgrounds (README: Surfaces).',
      ],
      text: ['Text colour', 'Use for text (README: Text colour).'],
      stroke: [
        'Stroke and border colour',
        'Use for borders and dividers (README: Borders).',
      ],
      shape: ['Shape and icon colour', 'Use for icons and filled shapes.'],
    }[kind];
    return `${what[0]}, role “${role}”; switches between light and dark mode. ${what[1]}`;
  }
  if (file === 'data.css')
    return `Data-visualisation colour “${p.slice(1).join('-')}”, ${
      p[0] === 'contrast'
        ? 'contrast set (on the dark-blue contrast surface)'
        : 'standard set (on light surfaces)'
    }; switches in dark mode.`;
  if (file === 'primitive.css') {
    if (fam === 'size')
      return `Size step ${p[1]} of the primitive size scale (${value}).`;
    if (name.startsWith('white-alpha-'))
      return `White at ${p.at(
        -1,
      )}% opacity; primitive the semantic tokens point at.`;
    if (name.startsWith('transparent-'))
      return `Primitive ${p[1]} at ${p[2].replace(
        'alpha',
        '',
      )}% opacity; the semantic overlay, disabled and transparent tokens point at it.`;
    return `Primitive ${p.slice(0, -1).join('-')} scale, step ${p.at(
      -1,
    )}; the semantic tokens point at it rather than components using it directly.`;
  }
  if (file === 'semantic.css') {
    const what = {
      fill: 'Semantic fill colour',
      stroke: 'Semantic stroke colour',
      text: 'Semantic text colour',
      shape: 'Semantic shape and icon colour',
    }[p[0]];
    return `${what} “${p
      .slice(1)
      .join(
        ' ',
      )}”; the light/dark base colours (\`basecolors-…\`) point at these.`;
  }
  if (file === 'transport.css') {
    const rest = p.slice(1).join('-');
    const tinted = rest.endsWith('-transparent');
    const where = {
      standard: 'on light surfaces',
      contrast: 'on the dark-blue contrast surface',
      dark: 'in dark mode',
    }[p[0]];
    return `Transport colour for ${
      tinted ? rest.slice(0, -12) : rest
    } ${where}${tinted ? ', at 15% opacity for tinted backgrounds' : ''}.`;
  }
  if (fam === 'color') {
    const g = p[1];
    if (g === 'brand') return `Entur brand colour ${p[2]}.`;
    if (g === 'blues')
      return `Blue scale step ${p[2].replace(
        'blue',
        '',
      )} from the flat colour set in tokens/styles.css.`;
    if (g === 'greys')
      return `Grey scale step ${
        p[2].replace('grey', '') || 'base'
      } from the flat colour set in tokens/styles.css.`;
    if (g === 'validation')
      return `Validation colour ${p
        .slice(2)
        .join('-')} (information, error, success and warning states).`;
    if (g === 'misc')
      return p[2] === 'focus' ? 'Focus glow colour (translucent).' : 'Black.';
    if (g === 'transport')
      return `Transport-mode colour for ${p[3]}, ${
        p[2] === 'contrast'
          ? 'contrast set (on the dark-blue contrast surface)'
          : 'default set (on light surfaces)'
      } (README: Transport modes).`;
    if (g === 'data')
      return `Data-visualisation colour ${p[3]}, ${
        p[2] === 'contrast' ? 'contrast set' : 'default set'
      }.`;
  }
  const shadows = {
    'shadows-focus': 'Focus ring on light surfaces (README: Elevation).',
    'shadows-focus-contrast': 'Focus ring on the contrast surface.',
    'shadows-card-shadow': 'Card elevation at rest (README: Elevation).',
    'shadows-card-shadow-hover': 'Card elevation on hover.',
    'shadows-card-shadow-contrast': 'Card elevation on the contrast surface.',
    'shadows-card-shadow-hover-contrast':
      'Card elevation on hover, on the contrast surface.',
    'shadows-box-shadow': 'Elevation for floating boxes.',
    'shadows-box-shadow-contrast':
      'Elevation for floating boxes on the contrast surface.',
  };
  switch (fam) {
    case 'spacing':
      return `Spacing step “${name.slice(
        6,
      )}” (${value}); gaps and padding in layout glue (README: Spacing).`;
    case 'radius':
      return `Corner radius “${p.at(-1)}” (${value}) (README: Borders).`;
    case 'borderWidth':
      return `Border width “${p.at(-1)}” (${value}).`;
    case 'breakpoint':
      return `Layout breakpoint “${name.slice(
        12,
      )}” (${value}); the typography components switch to their larger sizes from \`breakpoints-large\`.`;
    case 'fontSize':
      return `Font size “${name.slice(
        11,
      )}” (${value}); sizes are normally set by the typography components.`;
    case 'fontWeight':
      return name === 'font-weights-body'
        ? 'Body text weight (README: Type).'
        : 'Heading weight (README: Type).';
    case 'lineHeight':
      return `Line height “${name.slice(13)}” (${value}).`;
    case 'outlineOffset':
      return 'Offset between an element and its focus outline.';
    case 'shadow':
      return shadows[name] ?? 'Elevation.';
    case 'zIndex':
      return `Stacking layer “${name.slice(10)}” (${value}).`;
  }
  fail(`no usage note for --${name}`);
}

const alias = v => {
  const m = /^var\(--([A-Za-z0-9_-]+)\)$/.exec(v.trim());
  if (m) return `{${m[1]}}`;
  return v.trim().startsWith('#') ? v.trim().toLowerCase() : v.trim();
};

function typeStyles(bundleCss) {
  const found = new Map();
  for (const r of rules(bundleCss)) {
    const cls = r.sel.startsWith('.') ? r.sel.slice(1) : null;
    if (!cls || !TYPE_STYLES.some(t => t[1] === cls)) continue;
    const key = r.parents.includes(DESKTOP_MEDIA)
      ? 'desktop'
      : r.parents.length
      ? null
      : 'mobile';
    if (!key) continue;
    const size = /font-size:\s*([^;]+)/.exec(r.body)?.[1].trim();
    const lh = /line-height:\s*([^;]+)/.exec(r.body)?.[1].trim();
    const cur = found.get(cls) ?? {};
    cur[key] = {
      ...cur[key],
      ...(size && !cur[key]?.size ? { size } : {}),
      ...(lh && !cur[key]?.lh ? { lh } : {}),
    };
    found.set(cls, cur);
  }
  const style = (name, s, weight, use) => {
    if (!s?.size || !s?.lh) fail(`no font-size/line-height for ${name}`);
    return {
      name,
      fontSize: s.size,
      lineHeight: s.lh,
      ...(weight ? { fontWeight: weight } : {}),
      usage: use,
    };
  };
  return [
    {
      name: 'Desktop',
      family: 'sans',
      styles: TYPE_STYLES.map(([name, cls, comp, w]) => {
        const f = found.get(cls) ?? {};
        return style(
          name,
          { ...f.mobile, ...f.desktop },
          w,
          `\`${comp}\` from 50rem (\`breakpoints-large\`) up; set by the component.`,
        );
      }),
    },
    {
      name: 'Mobile',
      family: 'sans',
      styles: TYPE_STYLES.map(([name, cls, comp, w]) =>
        style(
          `${name}-mobile`,
          found.get(cls)?.mobile,
          w,
          `\`${comp}\` below 50rem; set by the component.`,
        ),
      ),
    },
  ];
}

function buildTokens(bundle, bundleCss) {
  const { light, dark, fileOf } = readTokens(join(bundle, 'tokens'));
  const fams = {};
  const kept = [];
  for (const [name, raw] of light) {
    const file = fileOf.get(name);
    const fam = family(name, file);
    if (!fam) {
      kept.push(name);
      continue;
    }
    let value;
    if (fam === 'color') {
      const l = alias(raw);
      value = dark.has(name) ? { light: l, dark: alias(dark.get(name)) } : l;
    } else if (fam === 'shadow')
      value = raw.replace(/#[0-9A-Fa-f]{3,8}/g, h => h.toLowerCase());
    else value = raw;
    (fams[fam] ??= []).push({
      name,
      value,
      usage: usage(name, fam, file, raw),
    });
  }
  const names = new Set(fams.color.map(t => t.name));
  for (const t of fams.color)
    for (const v of typeof t.value === 'string'
      ? [t.value]
      : Object.values(t.value))
      if (v.startsWith('{') && !names.has(v.slice(1, -1)))
        fail(`--${t.name} points at missing --${v.slice(1, -1)}`);
  const fonts = FONT_FACES.flatMap(([weight, face]) =>
    ['normal', 'italic'].map(style => ({
      family: 'Nationale',
      file: `fonts/Entur-Nationale-${
        style === 'normal'
          ? face
          : face === 'Regular'
          ? 'Italic'
          : face + 'Italic'
      }.woff2`,
      weight: String(weight),
      style,
    })),
  );
  for (const f of fonts)
    if (!existsSync(join(bundle, f.file))) fail(`missing ${f.file}`);
  const tokens = {
    name: TITLE,
    version: 1,
    color: {
      themes: [
        { id: 'light', name: 'Light' },
        { id: 'dark', name: 'Dark' },
      ],
      tokens: fams.color,
    },
    type: {
      fonts,
      families: { sans: 'Nationale, Arial, sans-serif' },
      groups: typeStyles(bundleCss),
    },
    spacing: { tokens: fams.spacing },
    radius: { tokens: fams.radius },
    shadow: { tokens: fams.shadow },
  };
  for (const f of OTHER_FAMILIES) tokens[f] = { tokens: fams[f] };
  return { tokens, kept };
}

function tokensCss(t) {
  const v = s => s.replace(/\{([^}]+)\}/g, 'var(--$1)');
  const root = [`/* ${TITLE} — generated from tokens.json */`];
  const darkLines = [];
  root.push(':root, [data-color-mode="light"] {');
  for (const tok of t.color.tokens) {
    const l = typeof tok.value === 'string' ? tok.value : tok.value.light;
    root.push(`  --${tok.name}: ${v(l)};`);
    if (typeof tok.value !== 'string' && tok.value.dark !== l)
      darkLines.push(`  --${tok.name}: ${v(tok.value.dark)};`);
    else if (l.startsWith('{')) darkLines.push(`  --${tok.name}: ${v(l)};`);
  }
  for (const tok of t.shadow.tokens)
    root.push(`  --${tok.name}: ${tok.value};`);
  root.push('}', '[data-color-mode="dark"] {', ...darkLines, '}', ':root {');
  for (const f of ['spacing', 'radius', ...OTHER_FAMILIES])
    for (const tok of t[f].tokens) root.push(`  --${tok.name}: ${tok.value};`);
  for (const [k, s] of Object.entries(t.type.families))
    root.push(`  --font-${k}: ${s};`);
  root.push('}');
  for (const g of t.type.groups)
    for (const s of g.styles)
      root.push(
        `.${s.name} { font-family: var(--font-${g.family}); font-size: ${
          s.fontSize
        }; line-height: ${s.lineHeight};${
          s.fontWeight ? ` font-weight: ${s.fontWeight};` : ''
        } }`,
      );
  for (const f of t.type.fonts)
    root.push(
      `@font-face { font-family: "${f.family}"; src: url("${f.file}") format("woff2"); font-weight: ${f.weight}; font-style: ${f.style}; font-display: swap; }`,
    );
  return root.join('\n') + '\n';
}

// Light token declarations are cut so a page edit wins; dark ones stay, as the page regenerates tokens.css without data-color-mode.
function bundleCss(css, lifted) {
  const cuts = [];
  for (const r of rules(css))
    if (LIGHT.has(r.sel))
      for (const d of r.decls) if (lifted.has(d.name)) cuts.push(d);
  cuts.sort((a, b) => a.start - b.start);
  let out = '';
  let last = 0;
  for (const c of cuts) {
    out += css.slice(last, c.start);
    last = c.end;
  }
  out += css.slice(last);
  out = out
    .replace(
      /^(?:\[data-color-mode='?(?:light|dark)'?\],?\s*)?(?::root)?\s*\{\s*\}\n?/gm,
      '',
    )
    .replace(/url\("illustrations\//g, 'url("../assets/illustrations/');
  if (/<\/style/i.test(out)) fail('bundle.css contains </style');
  return out;
}

function components(bundle, out) {
  const dir = join(bundle, 'components');
  const list = [];
  for (const group of names(dir, true))
    for (const name of names(join(dir, group), true)) list.push([group, name]);
  const dts = [
    `// ${TITLE}: the props of every component, gathered from components/<Comp>/<Comp>.d.ts.`,
    "import * as React from 'react';",
    '',
  ];
  for (const [group, name] of list) {
    const base = join(dir, group, name, name);
    write(
      join(out, 'components', name, 'README.md'),
      rewrite(`${base}.prompt.md`, [
        ['`_ds_bundle.js`', '`components/bundle.js`'],
      ]),
    );
    const types = read(`${base}.d.ts`);
    write(join(out, 'components', name, `${name}.d.ts`), types);
    dts.push(
      `// ---- ${name} ----`,
      types.replace(/^import \* as React from 'react';\n/, '').trim(),
      '',
    );
    write(
      join(out, 'components/src', group, name, `${name}.jsx`),
      rewrite(`${base}.jsx`, [['_ds_bundle.js', 'components/bundle.js']]),
    );
    write(
      join(out, 'components', name, 'preview.html'),
      preview(read(`${base}.html`), join(bundle, '_preview', `${name}.js`)),
    );
  }
  write(join(out, 'components/index.d.ts'), dts.join('\n'));
  return list;
}

// The card's _preview script is inlined; tokens.css, bundle.css, React and the bundle are preloaded by the page.
function preview(card, script) {
  const first = card.split('\n', 1)[0];
  const m = /^<!-- @dsCard group="([^"]+)"( viewport="(\d+)x(\d+)")? -->$/.exec(
    first,
  );
  if (!m) fail(`unexpected card marker: ${first}`);
  const marker = m[2]
    ? `${first.slice(0, -4)} width=${m[3]} height=${m[4]} -->`
    : first;
  const css = /<style>([\s\S]*?)<\/style>/.exec(card)?.[1];
  if (!css?.includes('background:#fff}'))
    fail(`no background:#fff in card style for ${script}`);
  const style = css.replace(
    'background:#fff}',
    'background:var(--basecolors-frame-default,#fff)}',
  );
  const mount =
    /<script>\n( {4}var h=React\.createElement[\s\S]*?)\n {2}<\/script>/.exec(
      card,
    )?.[1];
  if (!mount) fail(`no mount script in card for ${script}`);
  const js = read(script);
  if (/<\/script|<!--/i.test(js)) fail(`${script} cannot be inlined`);
  return `${marker}
<!doctype html>
<html><head><meta charset="utf-8">
  <style>${style}</style>
</head><body>
  <div class="ds-grid" id="g"></div>
  <script>
${js.trimEnd()}
    window.__dsPreview=__dsPreview;
${mount}
  </script>
</body></html>
`;
}

function copyTree(from, to) {
  for (const e of readdirSync(from, { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue;
    const src = join(from, e.name);
    if (e.isDirectory()) copyTree(src, join(to, e.name));
    else copy(src, join(to, e.name));
  }
}

function main() {
  const [bundleArg, outArg] = process.argv.slice(2);
  if (!bundleArg)
    fail('usage: node .design-sync/design-system.mjs <ds-bundle> [out]');
  const bundle = resolve(bundleArg);
  const out = resolve(
    outArg ?? join(HERE, '.cache', 'design-system', 'project'),
  );
  if (!existsSync(join(bundle, 'illustrations')))
    fail(
      `no illustrations in ${bundle}; run node .design-sync/illustrations.mjs publish ${bundleArg} first`,
    );
  // out is wiped below, so keep it inside .design-sync/.cache, symlinks resolved.
  const real = p =>
    existsSync(p) ? realpathSync(p) : join(real(dirname(p)), basename(p));
  const fromCache = relative(real(join(HERE, '.cache')), real(out));
  if (!fromCache || fromCache.startsWith('..') || isAbsolute(fromCache))
    fail(`out must be a folder inside ${join(HERE, '.cache')}`);
  rmSync(out, { recursive: true, force: true });

  const css = read(join(bundle, '_ds_bundle.css'));
  const { tokens, kept } = buildTokens(bundle, css);
  write(join(out, 'tokens.json'), JSON.stringify(tokens, null, 1));
  write(join(out, 'tokens.css'), tokensCss(tokens));
  const lifted = new Set(
    ['color', 'spacing', 'radius', 'shadow', ...OTHER_FAMILIES].flatMap(f =>
      tokens[f].tokens.map(t => t.name),
    ),
  );
  write(join(out, 'components/bundle.css'), bundleCss(css, lifted));

  const list = components(bundle, out);
  const js = read(join(bundle, '_ds_bundle.js'));
  const nl = js.indexOf('\n');
  write(
    join(out, 'components/bundle.js'),
    js
      .slice(0, nl)
      .replace(
        /"sourcePath":"components\/([A-Za-z0-9]+)\/([A-Za-z0-9]+)\/\2\.jsx"/g,
        '"sourcePath":"components/src/$1/$2/$2.jsx"',
      ) + js.slice(nl),
  );
  for (const f of ['react.js', 'react-dom.js'])
    copy(join(bundle, '_vendor', f), join(out, 'components/lib', f));
  copy(join(SOURCES, 'cover.html'), join(out, 'components/Cover/preview.html'));

  for (const f of names(join(bundle, 'fonts')))
    copy(join(bundle, 'fonts', f), join(out, 'fonts', f));
  copyTree(join(bundle, 'illustrations'), join(out, 'assets/illustrations'));
  // The README names tokens/*.css as the upstream source of the tokens.
  for (const f of TOKEN_FILES)
    copy(join(bundle, 'tokens', f), join(out, 'tokens', f));

  write(
    join(out, 'README.md'),
    rewrite(join(bundle, 'README.md'), README_PATHS),
  );

  write(
    join(out, 'design-system.json'),
    JSON.stringify(
      {
        v: 3,
        layout: 'files',
        createdOnFiles: { v: 1, at: new Date().toISOString() },
        title: TITLE,
        namespace: NAMESPACE,
        libraries: [
          {
            name: 'react',
            version: '18.3.1',
            global: 'React',
            file: 'components/lib/react.js',
          },
          {
            name: 'react-dom',
            version: '18.3.1',
            global: 'ReactDOM',
            file: 'components/lib/react-dom.js',
          },
        ],
        sections: {},
        groups: ['illustrations'],
        assetGroups: {
          illustrations: {
            name: 'illustrations',
            tile: 'm',
            order: [],
            files: {},
          },
        },
        blobs: {},
        docs: { readme: 'project/README.md', sections: [] },
      },
      null,
      2,
    ),
  );

  console.error(
    `  design-system: ${list.length} components, ${
      tokens.color.tokens.length
    } colours, ${
      lifted.size
    } tokens lifted out of bundle.css (kept: ${kept.join(', ')}) -> ${out}`,
  );
}

main();
