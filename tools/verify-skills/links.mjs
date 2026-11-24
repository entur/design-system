#!/usr/bin/env node
// The plugin in entur/ai is pinned to a commit. Skills must only read files from that
// commit: no links to a branch on GitHub or to content built from it, and every
// relative link must resolve inside the plugin. No dependencies, so CI runs it unbuilt.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(fileURLToPath(import.meta.url), '../../..');
const SKILLS_DIR = path.join(REPO, 'skills');

// Files on GitHub at a ref: only a full commit sha is pinned.
const CONTENT_PATH = /^\/[^/]+\/[^/]+\/(?:blob|tree)\/([^/]+)/;
const COMMIT_SHA = /^[0-9a-f]{40}$/;

/** Why a URL leaves the pinned plugin, or null. */
function bannedUrl(href) {
  let url;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  if (url.hostname === 'raw.githubusercontent.com') return 'raw GitHub URL';
  const ref =
    url.hostname === 'github.com' && CONTENT_PATH.exec(url.pathname)?.[1];
  if (ref && !COMMIT_SHA.test(ref)) {
    return 'link to a branch on GitHub, not a commit';
  }
  return null;
}

const walk = dir =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.name.endsWith('.md') ? [full] : [];
  });

const problems = [];

for (const file of walk(SKILLS_DIR)) {
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  let inFence = false;

  lines.forEach((line, i) => {
    const where = `${path.relative(REPO, file)}:${i + 1}`;

    for (const [href] of line.matchAll(/https?:\/\/[^\s)<>\]"'`]+/g)) {
      const reason = bannedUrl(href);
      if (reason) problems.push(`${where}  ${reason}`);
    }
    if (line.includes('llms-full')) {
      problems.push(`${where}  llms-full.txt is not part of the pinned plugin`);
    }

    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    if (inFence) return;

    const prose = line.replace(/`[^`]*`/g, '');
    for (const [, target] of prose.matchAll(/\]\(([^)\s]+)\)/g)) {
      if (/^([a-z]+:|#)/i.test(target)) continue;
      const resolved = path.resolve(path.dirname(file), target.split('#')[0]);
      if (!resolved.startsWith(SKILLS_DIR + path.sep)) {
        problems.push(`${where}  ${target} points outside skills/`);
      } else if (!fs.existsSync(resolved)) {
        problems.push(`${where}  ${target} does not exist`);
      }
    }
  });
}

if (problems.length) {
  console.error(`verify-skills links: ${problems.length} problem(s)\n`);
  for (const problem of problems) console.error(`  ${problem}`);
  process.exit(1);
}
console.log('verify-skills links: ok');
