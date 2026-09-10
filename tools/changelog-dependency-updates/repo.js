'use strict';

/**
 * Reading the repository for cli.js: workspaces from disk, manifests from git.
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const { INTERNAL_FIELDS, anchorForVersion } = require('./index.js');

// The branch a changelog link should point at. A blob URL on a branch keeps
// working as the file grows, and the version anchors in it are permanent.
const CHANGELOG_BRANCH = 'main';
const DEFAULT_REPOSITORY = 'https://github.com/entur/design-system';

/** Fails the run when the root is not a repository git can read. */
function assertRepository(root) {
  try {
    execFileSync('git', ['-C', root, 'rev-parse', '--git-dir'], {
      stdio: ['ignore', 'ignore', 'pipe'],
    });
  } catch (error) {
    throw new Error(`not a git repository: ${root}`, { cause: error });
  }
}

/**
 * The blob a revision names, or null when it names none. `--batch-check`
 * answers "missing" on its own output and keeps a non-zero exit for the
 * failures that are not an answer — a corrupt object store, an unreadable
 * repository — so those reach the caller as a throw.
 */
function blobAt(root, revision) {
  const answer = execFileSync(
    'git',
    ['-C', root, 'cat-file', '--batch-check'],
    {
      input: `${revision}\n`,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    },
  );

  // "<sha> blob <size>" when it is there, "<revision> missing" when it is not.
  const [id, type] = answer.trim().split(' ');

  return type === 'blob' ? id : null;
}

/**
 * The manifest at a ref, or null when the ref or the file is not there — the
 * one answer a missing tag or a package that did not exist yet can give. A
 * manifest that is not JSON, or a git that fails on an object it just said was
 * there, ends the run rather than reading as absent.
 */
function manifestAt(root, ref, relativeDir) {
  const blob = blobAt(root, `${ref}:${relativeDir}/package.json`);

  if (!blob) return null;

  return JSON.parse(
    execFileSync('git', ['-C', root, 'cat-file', 'blob', blob], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }),
  );
}

/** Every workspace Lerna versions, from the globs in lerna.json. */
function findWorkspaces(root) {
  const config = JSON.parse(
    fs.readFileSync(path.join(root, 'lerna.json'), 'utf8'),
  );

  const workspaces = [];

  for (const glob of config.packages) {
    // Every glob in this repo is a single directory level, e.g. "packages/*".
    const parent = path.join(root, path.dirname(glob));

    if (!fs.existsSync(parent)) continue;

    for (const entry of fs.readdirSync(parent).sort()) {
      const location = path.join(parent, entry);
      const manifestPath = path.join(location, 'package.json');

      if (!fs.existsSync(manifestPath)) continue;

      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

      workspaces.push({
        manifest,
        name: manifest.name,
        relativeDir: path.relative(root, location),
        changelogPath: path.join(location, 'CHANGELOG.md'),
      });
    }
  }

  return workspaces;
}

function repositoryUrl(manifest) {
  const url = manifest?.repository?.url || DEFAULT_REPOSITORY;

  return url.replace(/^git\+/, '').replace(/\.git$/, '');
}

/**
 * A link to the entry a dependency bullet refers to. The changelog on disk
 * holds every release of that package, so historical versions resolve too.
 */
function createChangelogUrl(workspaces) {
  const byName = new Map(
    workspaces.map(workspace => [workspace.name, workspace]),
  );

  return (name, version, previousRange) => {
    const dependency = byName.get(name);

    if (!dependency || !fs.existsSync(dependency.changelogPath)) return null;

    const anchor = anchorForVersion(
      fs.readFileSync(dependency.changelogPath, 'utf8'),
      version,
      previousRange,
    );

    const base = `${repositoryUrl(
      dependency.manifest,
    )}/blob/${CHANGELOG_BRANCH}/${dependency.relativeDir}/CHANGELOG.md`;

    return anchor ? `${base}#${anchor}` : base;
  };
}

/**
 * The version of every package the manifests name as an internal dependency,
 * as it was at a ref. Only the dependencies of the package being described are
 * looked up: reading all twenty-odd workspaces is a `git cat-file` pair per
 * workspace, per release entry.
 */
function dependencyVersionsAt(root, workspaces, ref, manifests) {
  const wanted = new Set();

  for (const manifest of manifests) {
    for (const field of INTERNAL_FIELDS) {
      Object.keys(manifest[field] || {}).forEach(name => wanted.add(name));
    }
  }

  const versions = new Map();

  for (const workspace of workspaces) {
    if (!wanted.has(workspace.name)) continue;

    const atRef = manifestAt(root, ref, workspace.relativeDir);

    if (atRef?.version) versions.set(workspace.name, atRef.version);
  }

  return versions;
}

module.exports = {
  assertRepository,
  createChangelogUrl,
  dependencyVersionsAt,
  findWorkspaces,
  manifestAt,
};
