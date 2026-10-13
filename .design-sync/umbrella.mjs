// Writes .cache/linje/, one package combining the built @entur/* packages, because the
// design-sync converter bundles a single package. Run after `yarn build:packages`.

import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { illustrationsCss } from './illustrations.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, '..');
const PKGS = join(REPO, 'packages');
const OUT = join(HERE, '.cache', 'linje');
const { Project, Node } = createRequire(join(REPO, '.ds-sync', 'package.json'))(
  'ts-morph',
);

const cfg = JSON.parse(readFileSync(join(HERE, 'config.json'), 'utf8'));
const SKIP = new Set(['icons']);
// Beta entries to merge (package dir names); stable exports win name clashes
// except for the names in PREFER_BETA (user decision 2026-09-30).
const BETA = ['layout', 'typography', 'menu'];
const PREFER_BETA = { menu: ['SideNavigation'] };
// Stable exports left out of the bundle entirely: deprecated components (2026-10-13),
// and the stable SideNavigation parts, which don't compose with the beta one (2026-09-30).
const EXCLUDE = {
  button: ['TertiaryButton', 'TertiarySquareButton'],
  layout: ['StatusBadge'],
  menu: [
    'SideNavigationItem',
    'SideNavigationGroup',
    'CollapsibleSideNavigation',
    'useSideNavigationContext',
  ],
};

const pkgs = readdirSync(PKGS)
  .filter(d => existsSync(join(PKGS, d, 'package.json')) && !SKIP.has(d))
  .sort();

rmSync(OUT, { recursive: true, force: true });
mkdirSync(join(OUT, 'types'), { recursive: true });

const valueExports = dts => {
  const project = new Project({ compilerOptions: { skipLibCheck: true } });
  const sf = project.addSourceFileAtPath(dts);
  project.resolveSourceFileDependencies();
  return [...sf.getExportedDeclarations()]
    .filter(([, ds]) =>
      ds.some(
        d =>
          Node.isVariableDeclaration(d) ||
          Node.isFunctionDeclaration(d) ||
          Node.isClassDeclaration(d) ||
          Node.isEnumDeclaration(d),
      ),
    )
    .map(([n]) => n);
};

const js = [];
const dts = [];
const css = [];
const stable = new Set();
const deps = {};
// The converter groups a component under `general` when its folder has its own name,
// so each export gets a docs file whose `category` is its package.
const ARCHIVE = join(REPO, 'apps/documentation/mdxArchive');
const archive = new Map(
  readdirSync(ARCHIVE).map(f => [
    f
      .replace(/\.mdx$/, '')
      .replace(/[^a-z0-9]/gi, '')
      .toLowerCase(),
    join(ARCHIVE, f),
  ]),
);
mkdirSync(join(OUT, 'docs'), { recursive: true });
const writeDoc = (name, category, override) => {
  if (!/^[A-Z]/.test(name)) return;
  const src = archive.get(name.toLowerCase());
  const body = override ?? (src ? readFileSync(src, 'utf8') : '---\n---\n');
  writeFileSync(
    join(OUT, 'docs', `${name}.mdx`),
    body.replace(/^---\n/, `---\ncategory: ${category}\n`),
  );
};

const layers = readFileSync(join(PKGS, 'utils/dist/layers.scss'), 'utf8')
  .split('\n')
  .filter(l => /^@layer [^{]+;$/.test(l.trim()))
  .join('\n');
css.push(
  `/* cascade layer order from @entur/utils/styles/layers */\n${layers}\n`,
);
// Package stylesheets only inline the tokens they use, so every token file is added; the
// bare-specifier @import in semantic.css cannot resolve here and is dropped.
for (const f of [
  'primitive',
  'semantic',
  'base',
  'transport',
  'data',
  'styles',
]) {
  const body = readFileSync(
    join(PKGS, 'tokens/dist', `${f}.css`),
    'utf8',
  ).replace(/^@import [^;]+;\s*$/gm, '');
  css.push(`/* @entur/tokens/dist/${f}.css */\n${body}`);
}

// types/<pkg>/dist mirrors packages/<pkg>/dist: the built .d.ts files import
// siblings by relative monorepo path (`../../utils`), which must still resolve.
const copyTypes = d => {
  cpSync(join(PKGS, d, 'dist'), join(OUT, 'types', d, 'dist'), {
    recursive: true,
    filter: p => !/\.[a-z0-9]+$/i.test(p) || p.endsWith('.d.ts'),
  });
  writeFileSync(
    join(OUT, 'types', d, 'index.d.ts'),
    "export * from './dist/index';\n",
  );
};
copyTypes('icons');

for (const d of pkgs) {
  const pj = JSON.parse(readFileSync(join(PKGS, d, 'package.json'), 'utf8'));
  deps[pj.name] = pj.version;
  const types = join(PKGS, d, 'dist/index.d.ts');
  if (!existsSync(types))
    throw new Error(
      `${pj.name}: dist/index.d.ts missing - run yarn build:packages`,
    );
  copyTypes(d);
  const values = valueExports(types);
  for (const n of values) stable.add(n);
  // `export *` can't drop names, and an explicit beta export next to a stable one
  // of the same name is a duplicate-export error, so such packages list theirs.
  const dropped = new Set([...(EXCLUDE[d] ?? []), ...(PREFER_BETA[d] ?? [])]);
  const kept = values.filter(n => !dropped.has(n));
  if (dropped.size) {
    console.error(`  ${pj.name}: not re-exported: ${[...dropped].join(', ')}`);
    js.push(`export { ${kept.join(', ')} } from '${pj.name}';`);
    dts.push(`export { ${kept.join(', ')} } from './${d}/dist/index';`);
  } else {
    js.push(`export * from '${pj.name}';`);
    dts.push(`export * from './${d}/dist/index';`);
  }
  for (const n of kept) writeDoc(n, d);
}

for (const d of BETA) {
  const types = join(PKGS, d, 'dist/beta/types/index.d.ts');
  if (!existsSync(types)) continue;
  const preferred = PREFER_BETA[d] ?? [];
  const names = valueExports(types).filter(
    n => !stable.has(n) || preferred.includes(n),
  );
  const shadowed = valueExports(types).filter(
    n => stable.has(n) && !preferred.includes(n),
  );
  if (shadowed.length)
    console.error(
      `  @entur/${d}/beta: stable export wins for ${shadowed.join(', ')}`,
    );
  if (preferred.length)
    console.error(
      `  @entur/${d}/beta: beta export wins for ${preferred.join(', ')}`,
    );
  if (!names.length) continue;
  for (const n of names) {
    // A preferred beta component replaces a stable one whose archived docs describe the old API;
    // its README (up to the internal Architecture notes) is the usage doc instead.
    const readme = join(PKGS, d, 'src/beta', n, 'README.md');
    const doc =
      preferred.includes(n) && existsSync(readme)
        ? `---\n---\n${
            readFileSync(readme, 'utf8').split(/^## Architecture/m)[0]
          }`
        : undefined;
    writeDoc(n, preferred.includes(n) ? d : 'beta', doc);
  }
  js.push(`export { ${names.join(', ')} } from '@entur/${d}/beta';`);
  dts.push(
    `export { ${names.join(', ')} } from './${d}/dist/beta/types/index';`,
  );
}

// apps/code-playground/src/index.scss orders stylesheets dependencies first, so e.g.
// button's loading-dots colour overrides loader's at equal specificity.
const PLAYGROUND = join(REPO, 'apps/code-playground/src/index.scss');
const order = [
  ...readFileSync(PLAYGROUND, 'utf8').matchAll(
    /^@import '@entur\/([a-z0-9-]+)\/(dist\/styles\.css|beta\/styles)';/gm,
  ),
]
  .filter(([, d]) => d !== 'tokens')
  .map(([, d, sub]) => [
    d,
    sub === 'beta/styles' ? 'dist/beta/styles/index.css' : 'dist/styles.css',
  ]);
for (const d of ['icons', ...pkgs.filter(p => p !== 'tokens')]) {
  if (
    existsSync(join(PKGS, d, 'dist/styles.css')) &&
    !order.some(([o, f]) => o === d && f === 'dist/styles.css')
  ) {
    console.error(
      `  ! @entur/${d}/styles is not imported by ${PLAYGROUND} - appended last`,
    );
    order.push([d, 'dist/styles.css']);
  }
}
for (const [d, f] of order)
  css.push(`/* @entur/${d}/${f} */\n${readFileSync(join(PKGS, d, f), 'utf8')}`);
// Illustration classes point at illustrations/ beside _ds_bundle.css; `illustrations.mjs publish` puts the files there.
css.push(illustrationsCss());

cpSync(join(PKGS, 'typography/dist/fonts'), join(OUT, 'fonts'), {
  recursive: true,
});
deps['@entur/icons'] = JSON.parse(
  readFileSync(join(PKGS, 'icons/package.json'), 'utf8'),
).version;

writeFileSync(join(OUT, 'index.mjs'), js.join('\n') + '\n');
writeFileSync(join(OUT, 'types/index.d.ts'), dts.join('\n') + '\n');
writeFileSync(join(OUT, 'styles.css'), css.join('\n'));
writeFileSync(
  join(OUT, 'package.json'),
  JSON.stringify(
    {
      name: cfg.pkg ?? '@entur/linje',
      version: deps['@entur/button'],
      private: true,
      type: 'module',
      module: 'index.mjs',
      types: 'types/index.d.ts',
      dependencies: deps,
    },
    null,
    2,
  ) + '\n',
);
console.error(`  umbrella: ${pkgs.length} packages -> ${OUT}`);
