// Plans the publish of .cache/design-system/project/ to each team's Design System artifact,
// from a fingerprint of what was last published there. See README.md (Updating the design system).
//
//   node .design-sync/publish.mjs status
//   node .design-sync/publish.mjs plan <artifact-url> [--new --by <name>] [--remote <paths.txt>]
//   node .design-sync/publish.mjs record <artifact-url> --team <name>
//
// `plan` writes the Artifact publish calls to .cache/publish/<id>/call-<n>.json, in order.
// `record` saves the fingerprint to published/<id>.json once every call has gone through;
// commit it, so the next sync from any machine starts from it.

import { createHash } from 'node:crypto';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '.cache', 'design-system');
const PROJECT = join(ROOT, 'project');
const PUBLISHED = join(HERE, 'published');
const CALLS = join(HERE, '.cache', 'publish');
const INDEX = 'project/design-system.json';
// One publish call takes at most 255 paths and 16 MiB; stay under both.
const MAX_PATHS = 250;
const MAX_BYTES = 14 * 1024 * 1024;
// The artifact refuses these extensions unless the call names a served type.
const CONTENT_TYPES = { '.d.ts': 'text/plain', '.jsx': 'text/javascript' };
// Files placed on the original artifact by hand, not built from the repo: never removed (NOTES.md, 2026-10-15).
const KEEP = ['project/assets/notes/'];
// A publish names one file by path (with no content type); this one is small and always there.
const FALLBACK_FILE = 'project/README.md';

const fail = msg => {
  console.error(`publish: ${msg}`);
  process.exit(1);
};

const artifactId = url => {
  const m =
    /^https:\/\/claude\.ai\/(?:code\/)?artifact\/([A-Za-z0-9-]+)\/?$/.exec(
      url ?? '',
    );
  if (!m) fail(`not an artifact link: ${url ?? '(none)'}`);
  return m[1];
};

const contentType = path =>
  Object.entries(CONTENT_TYPES).find(([ext]) => path.endsWith(ext))?.[1];

const sha256 = path =>
  createHash('sha256').update(readFileSync(path)).digest('hex');

// Every file under project/ by its artifact path, dot-files skipped like design-system.mjs does
function fingerprint() {
  if (!existsSync(PROJECT))
    fail(`no ${relative(process.cwd(), PROJECT)}; run the build first`);
  const files = {};
  const walk = dir => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (e.name.startsWith('.')) continue;
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else files[relative(ROOT, p)] = sha256(p);
    }
  };
  walk(PROJECT);
  return Object.fromEntries(
    Object.entries(files).sort(([a], [b]) => a.localeCompare(b)),
  );
}

const manifestPath = id => join(PUBLISHED, `${id}.json`);

const readManifest = id =>
  existsSync(manifestPath(id))
    ? JSON.parse(readFileSync(manifestPath(id), 'utf8'))
    : null;

function diff(current, previous, remote) {
  const changed = Object.keys(current).filter(
    p => p !== INDEX && current[p] !== previous?.[p],
  );
  // Without a fingerprint, removals are only known from a listing of the artifact's files.
  const known = previous ? Object.keys(previous) : remote ?? [];
  const removed = known.filter(
    p => p !== INDEX && !(p in current) && !KEEP.some(k => p.startsWith(k)),
  );
  return { changed, removed };
}

function option(args, name) {
  const i = args.indexOf(name);
  if (i < 0) return undefined;
  if (!args[i + 1] || args[i + 1].startsWith('--'))
    fail(`${name} needs a value`);
  return args[i + 1];
}

function plan(args) {
  const url = args[0];
  const id = artifactId(url);
  const isNew = args.includes('--new');
  const by = option(args, '--by');
  const remoteFile = option(args, '--remote');
  if (isNew && !by) fail('--new needs --by <name> for the index lastChange');

  const current = fingerprint();
  const manifest = readManifest(id);
  if (isNew && manifest)
    fail(`${id} already has a fingerprint; --new is for an empty artifact`);
  const remote = remoteFile
    ? readFileSync(remoteFile, 'utf8')
        .split('\n')
        .map(l => l.trim())
        .filter(l => l.startsWith('project/'))
    : undefined;
  const { changed, removed } = diff(current, manifest?.files, remote);

  if (isNew) {
    // design-system.mjs writes no lastChange, and its createdOnFiles is the build's time;
    // the type wants both at the time the system is started.
    const index = JSON.parse(readFileSync(join(ROOT, INDEX), 'utf8'));
    const now = new Date().toISOString();
    index.createdOnFiles = { v: 1, at: now };
    index.lastChange = {
      by,
      at: now,
      via: 'Claude Code /design-sync (entur/design-system)',
      note: 'First publish of Entur Linje to this team from the repo build.',
    };
    writeFileSync(join(ROOT, INDEX), JSON.stringify(index, null, 2));
  }

  // Biggest files first would pack tighter, but path order keeps a failed run easy to resume.
  const entries = [
    ...changed.map(p => ({
      path: p,
      size: statSync(join(ROOT, p)).size,
      value: contentType(p) ? { from: p, contentType: contentType(p) } : p,
    })),
    ...removed.map(p => ({ path: p, size: 0, value: null })),
  ];
  const calls = [];
  let call = [];
  let bytes = 0;
  for (const e of entries) {
    if (e.size > MAX_BYTES) fail(`${e.path} is over ${MAX_BYTES} bytes`);
    if (call.length >= MAX_PATHS || bytes + e.size > MAX_BYTES) {
      calls.push(call);
      call = [];
      bytes = 0;
    }
    call.push(e);
    bytes += e.size;
  }
  if (call.length) calls.push(call);
  // A new artifact gets its index in a call of its own, after everything it names.
  if (isNew) calls.push([{ path: INDEX, size: 0, value: INDEX, index: true }]);

  const dir = join(CALLS, id);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  calls.forEach((c, i) => {
    const lead = c.find(e => e.index) ??
      c.find(e => typeof e.value === 'string') ?? {
        // Only removals or typed files: resend an unchanged file to carry the call.
        path: FALLBACK_FILE,
        value: FALLBACK_FILE,
      };
    const files = Object.fromEntries(
      c.filter(e => e !== lead).map(e => [e.path, e.value]),
    );
    const params = {
      url,
      root: ROOT,
      file_path: join(ROOT, lead.path),
      files,
    };
    writeFileSync(
      join(dir, `call-${i + 1}.json`),
      JSON.stringify(params, null, 1),
    );
  });

  const mib = entries.reduce((s, e) => s + e.size, 0) / 1048576;
  console.log(
    `${manifest ? `${manifest.team} (${id})` : id}: ${
      changed.length
    } changed, ${removed.length} removed, ${mib.toFixed(2)} MiB in ${
      calls.length
    } call(s)` +
      (manifest ? '' : ' — no fingerprint, so every file is sent') +
      (manifest || remote || isNew
        ? ''
        : '; pass --remote with the artifact’s file listing to remove stale files'),
  );
  if (calls.length) console.log(`  calls: ${relative(process.cwd(), dir)}/`);
  const total = Object.keys(current).length;
  if (total > 1008)
    console.log(`  ! ${total} files: over the 1,008-file limit of an artifact`);
}

function record(args) {
  const url = args[0];
  const id = artifactId(url);
  const team = option(args, '--team') ?? readManifest(id)?.team;
  if (!team) fail('--team <name> is needed the first time');
  mkdirSync(PUBLISHED, { recursive: true });
  const files = fingerprint();
  writeFileSync(
    manifestPath(id),
    JSON.stringify(
      { team, url, publishedAt: new Date().toISOString(), files },
      null,
      2,
    ) + '\n',
  );
  console.log(
    `${team} (${id}): recorded ${Object.keys(files).length} files -> ${relative(
      process.cwd(),
      manifestPath(id),
    )}`,
  );
}

function status() {
  const current = existsSync(PROJECT) ? fingerprint() : null;
  const manifests = existsSync(PUBLISHED)
    ? readdirSync(PUBLISHED).filter(f => f.endsWith('.json'))
    : [];
  if (!manifests.length) console.log('no artifacts recorded yet');
  for (const f of manifests) {
    const m = JSON.parse(readFileSync(join(PUBLISHED, f), 'utf8'));
    const pending = current
      ? (({ changed, removed }) =>
          changed.length + removed.length
            ? `${changed.length} changed, ${removed.length} removed since then`
            : 'up to date with the build')(diff(current, m.files))
      : 'no build to compare';
    console.log(
      `${m.team}: ${m.url}, published ${m.publishedAt.slice(
        0,
        10,
      )}, ${pending}`,
    );
  }
}

const [command, ...args] = process.argv.slice(2);
if (command === 'plan') plan(args);
else if (command === 'record') record(args);
else if (command === 'status') status();
else
  fail(
    'usage: publish.mjs status | plan <artifact-url> [--new --by <name>] [--remote <paths.txt>] | record <artifact-url> --team <name>',
  );
