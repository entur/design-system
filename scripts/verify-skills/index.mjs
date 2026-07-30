#!/usr/bin/env node
/**
 * Verifies that the consumer-facing skills in skills/ describe APIs that actually exist.
 *
 * Two passes:
 *   1. Typecheck every tsx/jsx code fence against @entur/* source types (catches unknown
 *      props, missing required props, wrong hook signatures).
 *   2. Textual checks on prose (export names, CSS custom properties, package names,
 *      reference-file pointers, llms.txt coverage).
 *
 * Usage: yarn verify:skills [--quiet]
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const REPO = path.resolve(fileURLToPath(import.meta.url), '../../..');
const SKILLS_DIR = path.join(REPO, 'skills');
const PACKAGES_DIR = path.join(REPO, 'packages');
const ALLOWLIST = JSON.parse(
  fs.readFileSync(
    path.join(REPO, 'scripts/verify-skills/allowlist.json'),
    'utf8',
  ),
);

const problems = [];
const warnings = [];
const fail = (file, line, msg) => problems.push({ file, line, msg });
const warn = (file, line, msg) => warnings.push({ file, line, msg });

/* ------------------------------------------------------------------ helpers */

function walk(dir, predicate) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full, predicate));
    else if (predicate(full)) out.push(full);
  }
  return out;
}

const rel = f => path.relative(REPO, f);

/* -------------------------------------------------- @entur/* export registry */

/** Resolves `@entur/x` to the file TypeScript should read for its types. */
function packageEntry(pkg) {
  for (const candidate of [
    `packages/${pkg}/src/index.tsx`,
    `packages/${pkg}/src/index.ts`,
    `packages/${pkg}/dist/index.d.ts`,
  ]) {
    const full = path.join(REPO, candidate);
    if (fs.existsSync(full)) return full;
  }
  return null;
}

const publishedPackages = fs
  .readdirSync(PACKAGES_DIR, { withFileTypes: true })
  .filter(
    e =>
      e.isDirectory() &&
      fs.existsSync(path.join(PACKAGES_DIR, e.name, 'package.json')),
  )
  .map(e => e.name)
  .sort();

const compilerOptions = {
  target: ts.ScriptTarget.ESNext,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  lib: ['lib.dom.d.ts', 'lib.esnext.d.ts'],
  jsx: ts.JsxEmit.React,
  strict: true,
  // Doc examples elide types on callback params and mock data; that is not what we check for.
  noImplicitAny: false,
  noEmit: true,
  skipLibCheck: true,
  esModuleInterop: true,
  allowSyntheticDefaultImports: true,
  resolveJsonModule: true,
  noUnusedLocals: false,
  noUnusedParameters: false,
  baseUrl: REPO,
  paths: Object.fromEntries(
    publishedPackages
      .map(p => [`@entur/${p}`, [path.relative(REPO, packageEntry(p) ?? '')]])
      .filter(([, v]) => v[0]),
  ),
};

/** exportName -> { pkg, deprecated } for every export of every @entur/* package. */
function buildExportRegistry() {
  const roots = publishedPackages.map(packageEntry).filter(Boolean);
  const program = ts.createProgram(roots, compilerOptions);
  const checker = program.getTypeChecker();
  const registry = new Map();

  for (const pkg of publishedPackages) {
    const entry = packageEntry(pkg);
    if (!entry) continue;
    const source = program.getSourceFile(entry);
    if (!source) continue;
    const moduleSymbol = checker.getSymbolAtLocation(source);
    if (!moduleSymbol) continue;

    for (const exp of checker.getExportsOfModule(moduleSymbol)) {
      const deprecated = exp
        .getJsDocTags(checker)
        .some(tag => tag.name === 'deprecated');
      // First package to export a name owns it; alphabetical order keeps this stable.
      if (!registry.has(exp.getName())) {
        registry.set(exp.getName(), { pkg, deprecated });
      }
    }
  }
  return registry;
}

/* ------------------------------------------------------- fence extraction */

const SKIP_MARKER = /<!--\s*verify-skills:\s*skip\s*-->/;
/** Comment that introduces a deliberately-wrong example; nothing after it is checked. */
const NEGATIVE_MARKER =
  /^\s*(\/\/|\{\/\*)\s*(❌\s*)?(Avoid|Never|Don't|Do not|Wrong|Bad|Feil|Unngå|Breaks|Deprecated)\b/i;
/** Comment introducing the corrected version; only what follows is checked. */
const POSITIVE_MARKER =
  /^\s*(\/\/|\{\/\*)\s*(✅\s*)?(After|Fix|Correct|Replacement|Riktig)\b/i;
const NEGATIVE_EMOJI = /^\s*(\/\/|\{\/\*)\s*❌/;
const POSITIVE_EMOJI = /^\s*(\/\/|\{\/\*)\s*✅/;
/** React hooks doc examples call bare; import them so type arguments resolve. */
const REACT_HOOKS =
  'useState, useEffect, useRef, useMemo, useCallback, useReducer, useContext';
/**
 * lib.dom declares these as globals (`declare const name: void`), so a doc example
 * using one as a local variable name silently picks up the DOM type. Shadow them.
 */
const SHADOWED_DOM_GLOBALS = [
  'name',
  'status',
  'length',
  'top',
  'origin',
  'event',
  'close',
  'open',
  'focus',
  'parent',
  'history',
  'screen',
  'external',
  'frames',
  'self',
  'closed',
];
/**
 * Parse-level diagnostics caused by fence *fragments* rather than by wrong API use.
 * Docs put several sibling examples in one fence, which is not a valid single
 * expression — TypeScript still reports the semantic prop errors we care about.
 */
const IGNORED_CODES = new Set([
  2657, // JSX expressions must have one parent element
  18046, // 'x' is of type 'unknown' (from stubbed mock data)
]);
/**
 * Docs shorten JSX (`<Modal open title="...">` with no closing tag) and repeat an
 * identifier across a before/after pair. Such a fence cannot be parsed whole, so
 * every diagnostic in it is unreliable — report it as partially checked instead of
 * failing the build on an artefact of the abbreviation.
 */
const isStructuralCode = code =>
  code < 2000 || code === 17008 || code === 2300 || code === 2451;

/**
 * Pulls checkable tsx/jsx fences out of a markdown file.
 *
 * Docs deliberately contain wrong code (migration "Before" blocks, "Avoid" examples),
 * so a fence is narrowed to the part that represents correct usage:
 *   - `// After` present  -> only the text after the last `// After`
 *   - `// Avoid` present  -> only the text before the first `// Avoid`
 *   - `// Before` with no `// After` -> whole fence skipped
 */
function extractFences(file) {
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  const fences = [];
  let i = 0;

  while (i < lines.length) {
    const open = /^```(tsx|jsx)\s*$/.exec(lines[i]);
    if (!open) {
      i++;
      continue;
    }
    // lines[i] is the ``` opener, so the body's first line is 1-based i + 2.
    const startLine = i + 2;
    let j = i + 1;
    while (j < lines.length && !/^```\s*$/.test(lines[j])) j++;
    const body = lines.slice(i + 1, j);
    i = j + 1;

    const precedingSkip = lines
      .slice(Math.max(0, startLine - 4), startLine - 1)
      .some(l => SKIP_MARKER.test(l));
    if (precedingSkip) continue;

    let from = 0;
    let to = body.length;
    const afterIdx = body.findLastIndex(
      l => POSITIVE_MARKER.test(l) || POSITIVE_EMOJI.test(l),
    );
    const beforeIdx = body.findIndex(l =>
      /^\s*(\/\/|\{\/\*)\s*Before\b/.test(l),
    );
    const avoidIdx = body.findIndex(
      l => NEGATIVE_MARKER.test(l) || NEGATIVE_EMOJI.test(l),
    );

    if (afterIdx !== -1) from = afterIdx + 1;
    else if (beforeIdx !== -1) continue; // Before with no After: intentionally wrong
    if (avoidIdx > from) to = avoidIdx;

    const slice = body.slice(from, to);
    // A sliced fence loses its imports; auto-resolution puts them back.
    const keepImports = from === 0;
    const code = slice.join('\n').trim();
    if (!code) continue;

    fences.push({ file, startLine: startLine + from, code, keepImports });
  }
  return fences;
}

/* --------------------------------------------------------- fence typecheck */

// Scratch must live inside the repo so `react` and its types resolve from node_modules.
const SCRATCH = fs.mkdtempSync(
  path.join(REPO, 'node_modules', '.verify-skills-'),
);

/** Injected header line count per fence, so diagnostics map back to markdown lines. */
const headerOffsets = [];

function writeFenceModule(fence, index, extraHeader = '') {
  const code = fence.keepImports
    ? fence.code
    : fence.code
        .split('\n')
        .filter(l => !/^\s*import\s/.test(l))
        .join('\n');

  const target = path.join(SCRATCH, `fence-${index}.tsx`);
  const header = [
    `import * as React from 'react';`,
    `import { ${REACT_HOOKS} } from 'react';`,
    SHADOWED_DOM_GLOBALS.map(g => `declare const ${g}: any;`).join('\n'),
    extraHeader,
  ]
    .filter(Boolean)
    .join('\n');
  headerOffsets[index] = header.split('\n').length;
  fs.writeFileSync(target, `${header}\n${code}\n`);
  return target;
}

function typecheckFences(fences, registry) {
  if (!fences.length) return;

  // Names a doc example references without defining (handlers, state, mock data).
  const declared = fences.map(() => new Set());
  const imported = fences.map(() => new Map());

  const buildHeader = idx => {
    const byPkg = new Map();
    for (const [name, pkg] of imported[idx]) {
      if (!byPkg.has(pkg)) byPkg.set(pkg, []);
      byPkg.get(pkg).push(name);
    }
    const imports = [...byPkg]
      .map(([pkg, names]) => `import { ${names.join(', ')} } from '${pkg}';`)
      .join('\n');
    const decls = [...declared[idx]]
      .map(n => `declare const ${n}: any;`)
      .join('\n');
    return [imports, decls].filter(Boolean).join('\n');
  };

  // Resolve unknown identifiers iteratively: real @entur/* exports become imports,
  // everything else becomes `declare const x: any` so genuine type errors surface.
  let remaining = [];
  for (let pass = 0; pass < 4; pass++) {
    const files = fences.map((f, idx) =>
      writeFenceModule(f, idx, buildHeader(idx)),
    );
    const program = ts.createProgram(files, compilerOptions);
    const diagnostics = [
      ...program.getSemanticDiagnostics(),
      ...program.getSyntacticDiagnostics(),
    ];

    let progressed = false;
    remaining = [];

    for (const d of diagnostics) {
      if (!d.file) continue;
      const idx = Number(/fence-(\d+)\.tsx$/.exec(d.file.fileName)?.[1]);
      if (Number.isNaN(idx)) continue;

      if (IGNORED_CODES.has(d.code)) continue;
      const message = ts.flattenDiagnosticMessageText(d.messageText, ' ');
      const missing =
        d.code === 2304
          ? /Cannot find name '([^']+)'/.exec(message)?.[1]
          : null;

      if (missing) {
        const hit = registry.get(missing);
        if (hit && !imported[idx].has(missing)) {
          imported[idx].set(missing, `@entur/${hit.pkg}`);
          progressed = true;
        } else if (!hit && !declared[idx].has(missing)) {
          declared[idx].add(missing);
          progressed = true;
        }
        continue;
      }
      remaining.push({
        idx,
        code: d.code,
        message,
        start: d.start,
        file: d.file,
      });
    }

    if (!progressed) break;
  }

  // A fence TypeScript could not parse whole yields unreliable diagnostics, so
  // decide per fence: report it as partially checked, or fail on its type errors.
  const truncated = new Set(
    remaining.filter(d => isStructuralCode(d.code)).map(d => d.idx),
  );

  for (const idx of truncated) {
    const fence = fences[idx];
    warn(
      fence.file,
      fence.startLine,
      'fence is abbreviated (unclosed JSX or a repeated identifier) — only partially checked',
    );
  }

  for (const d of remaining) {
    if (truncated.has(d.idx)) continue;
    const fence = fences[d.idx];
    const { line } = d.file.getLineAndCharacterOfPosition(d.start ?? 0);
    // `line` is 0-based within the generated module; strip the injected header.
    const inFence = Math.max(0, line - headerOffsets[d.idx]);
    fail(fence.file, fence.startLine + inFence, `TS${d.code}: ${d.message}`);
  }
}

/* ------------------------------------------------------- textual checks */

function checkProse(files, registry) {
  const tokenNames = collectTokenNames();
  const allow = new Set(ALLOWLIST.identifiers);

  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    const lines = text.split('\n');
    // Migration docs name removed and deprecated APIs on purpose, so the
    // "must be a real export" rule does not apply to them.
    const isMigrationGuide =
      /migration|breaking-changes|behavioral-changes/.test(file) ||
      /\/migrate-[^/]+\//.test(file);

    lines.forEach((lineText, i) => {
      const lineNo = i + 1;

      // 3. Package names must exist.
      for (const m of lineText.matchAll(/@entur\/([a-z0-9-]+)/g)) {
        if (
          !publishedPackages.includes(m[1]) &&
          !ALLOWLIST.packagePaths.includes(m[1])
        ) {
          fail(file, lineNo, `unknown package @entur/${m[1]}`);
        }
      }

      // 1. Backticked identifiers that look like exports must be real exports.
      for (const m of lineText.matchAll(
        /`([A-Z][A-Za-z0-9]+|use[A-Z][A-Za-z0-9]+)`/g,
      )) {
        const name = m[1];
        if (allow.has(name) || /Icon$/.test(name)) continue;
        if (!registry.has(name)) {
          if (!isMigrationGuide) {
            fail(
              file,
              lineNo,
              `\`${name}\` is not exported by any @entur/* package`,
            );
          }
        } else if (
          registry.get(name).deprecated &&
          !isMigrationGuide &&
          !/deprecated/i.test(lineText) // already labelled as such
        ) {
          warn(
            file,
            lineNo,
            `\`${name}\` is deprecated — recommend the replacement instead`,
          );
        }
      }

      // 2. CSS custom properties must exist in @entur/tokens.
      for (const m of lineText.matchAll(/var\(\s*(--[a-z0-9-]+)/g)) {
        if (m[1].endsWith('-')) continue; // wildcard in prose, e.g. var(--space-*)
        if (!tokenNames.has(m[1]) && !ALLOWLIST.cssProperties.includes(m[1])) {
          fail(file, lineNo, `unknown design token ${m[1]}`);
        }
      }
    });

    // 4. Reference pointers must resolve within their own skill.
    if (path.basename(file) === 'SKILL.md') {
      for (const m of text.matchAll(/`(references\/[A-Za-z0-9._-]+)`/g)) {
        if (fs.existsSync(path.join(path.dirname(file), m[1]))) continue;

        const elsewhere = walk(SKILLS_DIR, f =>
          f.endsWith(path.basename(m[1])),
        );
        const lineNo = lines.findIndex(l => l.includes(m[1])) + 1;
        if (elsewhere.length) {
          // An agent reading this skill alone cannot resolve a sibling skill's file.
          warn(
            file,
            lineNo,
            `${m[1]} lives in ${path.relative(
              SKILLS_DIR,
              path.dirname(elsewhere[0]),
            )}, not this skill — name the owning skill`,
          );
        } else {
          fail(file, lineNo, `reference pointer ${m[1]} does not resolve`);
        }
      }
    }
  }
}

function collectTokenNames() {
  const names = new Set();
  const distDir = path.join(PACKAGES_DIR, 'tokens', 'dist');
  if (!fs.existsSync(distDir)) return names;
  for (const file of walk(distDir, f => f.endsWith('.css'))) {
    const css = fs.readFileSync(file, 'utf8');
    for (const m of css.matchAll(/(--[a-z0-9-]+)\s*:/g)) names.add(m[1]);
  }
  return names;
}

/* --------------------------------- llms.txt coverage (Part 5 regression guard) */

function checkLlmsCoverage(skillFiles) {
  const gatsbyNode = path.join(REPO, 'apps/documentation/gatsby-node.js');
  if (!fs.existsSync(gatsbyNode)) return;
  const source = fs.readFileSync(gatsbyNode, 'utf8');

  // A directory walk covers everything by construction; only a hardcoded list can drift.
  if (!/SKILLS_FILES\s*=\s*\[/.test(source)) {
    if (!/collectSkillFiles/.test(source)) {
      warn(
        'apps/documentation/gatsby-node.js',
        0,
        'no skill-file collection found — llms-full.txt may omit skill content',
      );
    }
    return;
  }

  for (const file of skillFiles) {
    // README.md is install instructions for humans, not skill content.
    if (path.basename(file) === 'README.md') continue;
    const relToSkills = path.relative(SKILLS_DIR, file);
    if (!source.includes(relToSkills)) {
      fail(
        'apps/documentation/gatsby-node.js',
        0,
        `SKILLS_FILES omits ${relToSkills} — it will be missing from llms-full.txt`,
      );
    }
  }
}

/* --------------------------------------------------------------------- main */

const quiet = process.argv.includes('--quiet');
const skillFiles = walk(SKILLS_DIR, f => f.endsWith('.md'));
const registry = buildExportRegistry();

if (!quiet) {
  console.log(
    `verify-skills: ${skillFiles.length} markdown files, ` +
      `${registry.size} exports across ${publishedPackages.length} packages`,
  );
}

const fences = skillFiles.flatMap(extractFences);
typecheckFences(fences, registry);
checkProse(skillFiles, registry);
checkLlmsCoverage(skillFiles);

fs.rmSync(SCRATCH, { recursive: true, force: true });

const report = (items, label) => {
  if (!items.length) return;
  console.log(`\n${label}:`);
  for (const { file, line, msg } of items) {
    const where =
      typeof file === 'string' && !path.isAbsolute(file) ? file : rel(file);
    console.log(`  ${where}${line ? `:${line}` : ''} — ${msg}`);
  }
};

report(warnings, `${warnings.length} warning(s)`);
report(problems, `${problems.length} problem(s)`);

if (problems.length) {
  console.log(`\nverify-skills: FAILED with ${problems.length} problem(s)`);
  process.exit(1);
}
if (!quiet)
  console.log(
    `\nverify-skills: ${fences.length} code fences checked, no problems`,
  );
