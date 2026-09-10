'use strict';

/**
 * Guards the generated entries in the repository, not the generator: a release
 * cannot name a dependency version that did not exist yet. An aborted release
 * leaves a manifest naming a version npm never received, and reading that
 * manifest is what once put `@entur/layout@4.0.0` in entries from May.
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '../..');

const BULLET =
  /^- \*\*(@entur\/[^:]+):\*\* (?:`([^`]+)` → `([^`]+)`|added at `([^`]+)`)/;
const DATE = /\((\d{4}-\d{2}-\d{2})\)/;

const versionIn = range => /\d[\w.-]*/.exec(range || '')?.[0] ?? null;

const tagDate = new Map(
  execFileSync(
    'git',
    [
      '-C',
      ROOT,
      'for-each-ref',
      '--format=%(refname:strip=2)\t%(creatordate:short)',
      'refs/tags',
    ],
    { encoding: 'utf8' },
  )
    .split('\n')
    .filter(Boolean)
    .map(line => line.split('\t')),
);

const changelogs = fs
  .readdirSync(path.join(ROOT, 'packages'))
  .map(entry => path.join(ROOT, 'packages', entry, 'CHANGELOG.md'))
  .filter(file => fs.existsSync(file));

const { findReleaseSections } = require('./index.js');

describe('the generated entries in this repository', () => {
  it('name no dependency version that was tagged after the release', () => {
    const later = [];

    for (const file of changelogs) {
      const text = fs.readFileSync(file, 'utf8');
      const lines = text.split('\n');

      for (const release of findReleaseSections(text)) {
        const date = DATE.exec(release.heading)?.[1];

        if (!date) continue;

        for (const line of lines.slice(release.start, release.end)) {
          const bullet = BULLET.exec(line);

          if (!bullet) continue;

          const [, name, from, to, addedAt] = bullet;

          for (const range of [from, to, addedAt]) {
            const tagged = tagDate.get(`${name}@${versionIn(range)}`);

            if (tagged && tagged > date) {
              later.push(
                `${path.relative(ROOT, file)} ${
                  release.version
                } (${date}): ${name}@${versionIn(range)} tagged ${tagged}`,
              );
            }
          }
        }
      }
    }

    expect(later).toEqual([]);
  });

  it('head every release with a version of its own', () => {
    const duplicates = [];

    for (const file of changelogs) {
      const versions = findReleaseSections(fs.readFileSync(file, 'utf8')).map(
        release => release.version,
      );
      const seen = new Set();

      for (const version of versions) {
        if (seen.has(version)) {
          duplicates.push(`${path.relative(ROOT, file)}: ${version}`);
        }
        seen.add(version);
      }
    }

    expect(duplicates).toEqual([]);
  });
});
