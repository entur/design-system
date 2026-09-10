#!/usr/bin/env node
'use strict';

/**
 * Rewrites the "Version bump only for package X" entries of the release being
 * prepared into entries that name the internal dependencies that moved.
 *
 * Run by Lerna as the root `version` lifecycle script, which happens after the
 * changelogs are written and before anything is staged, committed or tagged
 * (lerna/dist/commands/version/index.js, updatePackageVersions). Nothing here
 * touches git history: it only rewrites files Lerna has already changed and is
 * about to stage.
 *
 * It throws rather than carrying on. Lerna runs this before the commit, the
 * tags and the push, so a failure leaves nothing behind but a dirty working
 * tree: `git checkout .` and the release never happened.
 *
 * Usage:
 *   node tools/changelog-dependency-updates/cli.js [--dry-run] [--root <dir>]
 */

const fs = require('fs');
const path = require('path');

const {
  applyDependencySections,
  diffInternalDependencies,
  findReleaseSections,
  hasBumpOnlyNote,
  normalizeTitle,
  renderDependencySections,
} = require('./index.js');

const {
  assertRepository,
  createChangelogUrl,
  dependencyVersionsAt,
  findWorkspaces,
  manifestAt,
} = require('./repo.js');

function parseArgs(argv) {
  const args = { dryRun: false, root: process.cwd() };

  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === '--dry-run') args.dryRun = true;
    if (argv[index] === '--root') args.root = path.resolve(argv[index + 1]);
  }

  return args;
}

/**
 * The file's contents, or null when it is not there. Read rather than asked
 * about first: a check and the write that follows are two operations on a path
 * that need not still mean the same file, and the contents are the answer
 * either way.
 */
function readIfPresent(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

function main() {
  const { dryRun, root } = parseArgs(process.argv.slice(2));

  // Every comparison here is a read of history. A root that is not a readable
  // repository would answer every one of them with "nothing moved".
  assertRepository(root);

  const workspaces = findWorkspaces(root);
  const changelogUrl = createChangelogUrl(workspaces);

  const currentVersions = new Map(
    workspaces.map(workspace => [workspace.name, workspace.manifest.version]),
  );

  // Packages whose entry stays the note Lerna wrote, reported together.
  const kept = [];

  for (const workspace of workspaces) {
    const onDisk = readIfPresent(workspace.changelogPath);

    // No changelog means Lerna wrote no entry: the package is not released.
    if (onDisk === null) continue;

    const { version } = workspace.manifest;
    const changelog = normalizeTitle(onDisk);
    const [latest] = findReleaseSections(changelog);

    // Only the entry this run wrote is up for rewriting.
    if (!latest || latest.version !== version) continue;

    // A changelog Lerna has just created carries its title, not ours. Written
    // here rather than left for later: this file is in the release either way,
    // so the fix rides along in the release commit.
    if (changelog !== onDisk && !dryRun) {
      fs.writeFileSync(workspace.changelogPath, changelog);
    }

    // Only an entry that is still Lerna's note can be said to keep it: an
    // authored entry never had one.
    const keepsNote = hasBumpOnlyNote(changelog, latest, workspace.name);

    const previousManifest = manifestAt(root, 'HEAD', workspace.relativeDir);

    // A package released for the first time has nothing to compare against.
    if (!previousManifest?.version) {
      if (keepsNote) kept.push(workspace.name);
      continue;
    }

    // The top entry is this package's previous release: it is not in this
    // release, and its entry must not be rewritten with today's versions.
    if (previousManifest.version === version) continue;

    // The package's own previous release, rather than whatever HEAD holds. A
    // tag that is not there reads as a missing manifest, and HEAD stands in.
    const tag = `${workspace.name}@${previousManifest.version}`;
    const atTag = manifestAt(root, tag, workspace.relativeDir);
    const previousRef = atTag ? tag : 'HEAD';
    const previous = atTag || previousManifest;

    const changes = diffInternalDependencies({
      previousManifest: previous,
      currentManifest: workspace.manifest,
      // Only the dependencies named by either side are looked up: reading every
      // workspace per package is a call for each pair of them.
      previousVersions: dependencyVersionsAt(root, workspaces, previousRef, [
        previous,
        workspace.manifest,
      ]),
      currentVersions,
    });

    const sections = renderDependencySections(changes, { changelogUrl });

    if (!sections) {
      if (keepsNote) kept.push(workspace.name);
      continue;
    }

    const content = applyDependencySections(changelog, latest, {
      packageName: workspace.name,
      sections,
    });

    // Authored entries, and entries an earlier run already filled in.
    if (content === null) continue;

    if (!dryRun) fs.writeFileSync(workspace.changelogPath, content);

    const count = changes.dependencies.length + changes.peerDependencies.length;

    console.log(
      `changelog: ${workspace.name} — ${count} dependency change(s)${
        dryRun ? ' (dry run)' : ''
      }`,
    );
  }

  if (kept.length) {
    console.log(`changelog: kept the maintenance note for ${kept.join(', ')}`);
  }
}

main();
