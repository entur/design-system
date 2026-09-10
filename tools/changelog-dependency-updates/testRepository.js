'use strict';

/**
 * Throwaway repositories for the tests: a workspace layout Lerna would
 * recognise, changelog entries shaped the way Lerna writes them, and release
 * tags where a real release would have left them.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const REPOSITORY = 'https://github.com/entur/design-system';

const CHANGELOG_HEADER = [
  '# Changelog',
  '',
  'All notable changes to this project will be documented in this file.',
  'See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.',
  '',
].join('\n');

const created = [];

const git = (cwd, args) =>
  execFileSync('git', ['-C', cwd, ...args], { encoding: 'utf8' });

const commit = (root, message) =>
  git(root, [
    '-c',
    'user.email=test@example.com',
    '-c',
    'user.name=Test',
    'commit',
    '--quiet',
    '--no-verify',
    '-m',
    message,
  ]);

/** The entry Lerna writes for a release, fallback note included. */
function releaseEntry(name, version, { date = '2026-01-02', body } = {}) {
  return [
    `## [${version}](${REPOSITORY}/compare/${name}@0.0.0...${name}@${version}) (${date})`,
    '',
    body || `**Note:** Version bump only for package ${name}`,
    '',
    // The bump-only filter trails its note with blank lines.
    ...(body ? [] : ['', '', '']),
  ].join('\n');
}

const manifestPath = (root, dir) =>
  path.join(root, 'packages', dir, 'package.json');

const changelogPath = (root, dir) =>
  path.join(root, 'packages', dir, 'CHANGELOG.md');

const readChangelog = (root, dir) =>
  fs.readFileSync(changelogPath(root, dir), 'utf8');

function writePackage(root, pkg) {
  const location = path.join(root, 'packages', pkg.dir);

  fs.mkdirSync(location, { recursive: true });
  fs.writeFileSync(
    manifestPath(root, pkg.dir),
    `${JSON.stringify(
      {
        name: pkg.name,
        version: pkg.version,
        repository: {
          type: 'git',
          url: `${REPOSITORY}.git`,
          directory: `packages/${pkg.dir}`,
        },
        ...(pkg.dependencies ? { dependencies: pkg.dependencies } : {}),
        ...(pkg.peerDependencies
          ? { peerDependencies: pkg.peerDependencies }
          : {}),
      },
      null,
      2,
    )}\n`,
  );

  fs.writeFileSync(
    changelogPath(root, pkg.dir),
    `${CHANGELOG_HEADER}\n${releaseEntry(pkg.name, pkg.version, {
      date: pkg.date || '2026-01-01',
    })}`,
  );
}

function prependEntry(root, dir, entry) {
  const existing = readChangelog(root, dir);
  const [header, ...rest] = existing.split('\n## ');

  fs.writeFileSync(
    changelogPath(root, dir),
    `${header}\n${entry}\n${rest.map(part => `## ${part}`).join('\n')}`,
  );
}

/** A repository whose HEAD is the previous release, tags and all. */
function createRepository(packages) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'changelog-deps-'));

  created.push(root);

  fs.writeFileSync(
    path.join(root, 'lerna.json'),
    `${JSON.stringify(
      { version: 'independent', packages: ['packages/*'] },
      null,
      2,
    )}\n`,
  );
  fs.writeFileSync(
    path.join(root, 'package.json'),
    `${JSON.stringify({ name: 'fixture', private: true }, null, 2)}\n`,
  );

  packages.forEach(pkg => writePackage(root, pkg));

  git(root, ['init', '--quiet', '--initial-branch=main']);
  git(root, ['add', '.']);
  commit(root, 'chore(release): publish');

  packages.forEach(pkg => git(root, ['tag', `${pkg.name}@${pkg.version}`]));

  return root;
}

/** What Lerna leaves behind before it stages, commits and tags. */
function stageRelease(root, releases) {
  for (const release of releases) {
    const manifest = JSON.parse(
      fs.readFileSync(manifestPath(root, release.dir), 'utf8'),
    );

    manifest.version = release.version;

    if (release.dependencies) manifest.dependencies = release.dependencies;
    if (release.peerDependencies) {
      manifest.peerDependencies = release.peerDependencies;
    }

    fs.writeFileSync(
      manifestPath(root, release.dir),
      `${JSON.stringify(manifest, null, 2)}\n`,
    );

    prependEntry(
      root,
      release.dir,
      releaseEntry(manifest.name, release.version, {
        body: release.body,
        date: release.date,
      }),
    );
  }
}

function cleanup() {
  created.forEach(root => fs.rmSync(root, { recursive: true, force: true }));
  created.length = 0;
}

module.exports = {
  REPOSITORY,
  cleanup,
  createRepository,
  readChangelog,
  stageRelease,
  writePackage,
};
