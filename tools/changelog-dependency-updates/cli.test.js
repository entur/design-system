'use strict';

/**
 * Drives the generator the way Lerna does: a repository whose last commit is
 * the previous release, a working tree carrying the version bumps and the
 * changelog entries Lerna just wrote, and nothing staged yet.
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const {
  REPOSITORY,
  cleanup,
  createRepository,
  readChangelog,
  stageRelease,
  writePackage,
} = require('./testRepository.js');

const CLI = path.join(__dirname, 'cli.js');

const run = root =>
  execFileSync(process.execPath, [CLI, '--root', root], { encoding: 'utf8' });

/** tokens is a dependency of chip; both are released. */
function dependencyOnlyRelease() {
  return createRepository([
    { dir: 'tokens', name: '@entur/tokens', version: '1.0.0' },
    { dir: 'icons', name: '@entur/icons', version: '3.0.0' },
    {
      dir: 'chip',
      name: '@entur/chip',
      version: '2.0.0',
      dependencies: {
        '@entur/tokens': 'workspace:^',
        classnames: '^2.5.1',
      },
    },
  ]);
}

afterEach(cleanup);

describe('a dependency-only release', () => {
  it('replaces the fallback note with the dependency that moved', () => {
    const root = dependencyOnlyRelease();

    stageRelease(root, [
      { dir: 'tokens', version: '1.0.1' },
      { dir: 'chip', version: '2.0.1' },
    ]);

    run(root);

    const changelog = readChangelog(root, 'chip');

    expect(changelog).toContain('### Entur Dependency Updates');
    expect(changelog).toContain(
      '- **@entur/tokens:** `^1.0.0` → `^1.0.1` ' +
        `([changelog](${REPOSITORY}/blob/main/packages/tokens/CHANGELOG.md#101-2026-01-02))`,
    );
    // Only the new entry lost its note; the one below it kept its own.
    expect(changelog.split('\n## ')[1]).not.toContain('Version bump only');
    expect(changelog.match(/Version bump only/g)).toHaveLength(1);
    // The blank lines Lerna trails its note with are not left behind.
    expect(`## ${changelog.split('\n## ')[1]}`).not.toMatch(/\n\n\n/);
  });

  it('leaves the released dependency and the history alone', () => {
    const root = dependencyOnlyRelease();
    const before = readChangelog(root, 'chip');

    stageRelease(root, [
      { dir: 'tokens', version: '1.0.1' },
      { dir: 'chip', version: '2.0.1' },
    ]);

    run(root);

    // The 1.0.1 entry of tokens is itself a fallback with nothing behind it.
    expect(readChangelog(root, 'tokens')).toContain(
      '**Note:** Version bump only for package @entur/tokens',
    );
    // Everything below the new entry is byte-for-byte what it was.
    expect(readChangelog(root, 'chip')).toContain(before.split('\n## ')[1]);
  });

  it('does not add claims about visual or API impact', () => {
    const root = dependencyOnlyRelease();

    stageRelease(root, [
      { dir: 'tokens', version: '1.0.1' },
      { dir: 'chip', version: '2.0.1' },
    ]);

    run(root);

    expect(readChangelog(root, 'chip')).not.toMatch(
      /No visual changes|No API changes|No action/i,
    );
  });
});

describe('several dependencies in one release', () => {
  it('lists them alphabetically, one bullet each', () => {
    const root = createRepository([
      { dir: 'tokens', name: '@entur/tokens', version: '1.0.0' },
      { dir: 'icons', name: '@entur/icons', version: '3.0.0' },
      {
        dir: 'chip',
        name: '@entur/chip',
        version: '2.0.0',
        dependencies: {
          '@entur/tokens': 'workspace:^',
          '@entur/icons': 'workspace:^',
        },
      },
    ]);

    stageRelease(root, [
      { dir: 'tokens', version: '1.1.0' },
      { dir: 'icons', version: '3.0.1' },
      { dir: 'chip', version: '2.0.1' },
    ]);

    run(root);

    const entry = readChangelog(root, 'chip').split('\n## ')[1];

    expect(entry).toContain('- **@entur/icons:** `^3.0.0` → `^3.0.1`');
    expect(entry).toContain('- **@entur/tokens:** `^1.0.0` → `^1.1.0`');
    expect(entry.indexOf('@entur/icons')).toBeLessThan(
      entry.indexOf('@entur/tokens'),
    );
  });

  it('gives peer requirements their own section', () => {
    const root = createRepository([
      { dir: 'tokens', name: '@entur/tokens', version: '1.0.0' },
      {
        dir: 'chip',
        name: '@entur/chip',
        version: '2.0.0',
        dependencies: { '@entur/tokens': 'workspace:^' },
        peerDependencies: { '@entur/icons': '>=3.0.0' },
      },
      { dir: 'icons', name: '@entur/icons', version: '3.0.0' },
    ]);

    stageRelease(root, [
      { dir: 'tokens', version: '1.0.1' },
      {
        dir: 'chip',
        version: '2.0.1',
        peerDependencies: { '@entur/icons': '>=3.1.0' },
      },
    ]);

    run(root);

    const changelog = readChangelog(root, 'chip');

    expect(changelog).toContain('### Entur Dependency Updates');
    expect(changelog).toContain('### Entur Peer Requirements');
    expect(changelog).toContain('- **@entur/icons:** `>=3.0.0` → `>=3.1.0`');
    // The peer bullet must not sit among the ordinary updates.
    expect(changelog.indexOf('### Entur Peer Requirements')).toBeLessThan(
      changelog.indexOf('- **@entur/icons:**'),
    );
  });
});

describe('a release with authored notes', () => {
  it('leaves the entry untouched', () => {
    const root = dependencyOnlyRelease();

    stageRelease(root, [
      { dir: 'tokens', version: '1.0.1' },
      {
        dir: 'chip',
        version: '2.0.1',
        body: [
          '### Bug Fixes',
          '',
          '- **chip:** keep the label from wrapping ([abc1234](https://example.com))',
          '',
          '  The label now truncates instead.',
        ].join('\n'),
      },
    ]);

    const before = readChangelog(root, 'chip');

    const output = run(root);

    expect(readChangelog(root, 'chip')).toBe(before);
    // There is no note in an authored entry, so chip is not among the
    // packages reported as keeping one. tokens legitimately is.
    expect(output).toContain('kept the maintenance note for @entur/tokens');
    expect(output).not.toContain('@entur/chip');
  });
});

describe('a fallback with nothing behind it', () => {
  it('keeps the maintenance note when no dependency moved', () => {
    const root = dependencyOnlyRelease();

    // chip alone, with its dependency left where it was.
    stageRelease(root, [{ dir: 'chip', version: '2.0.1' }]);

    expect(run(root)).toContain('kept the maintenance note for @entur/chip');

    const changelog = readChangelog(root, 'chip');

    expect(changelog).toContain(
      '**Note:** Version bump only for package @entur/chip',
    );
    expect(changelog).not.toContain('### Entur Dependency Updates');
  });

  it('keeps it for a package with no previous release', () => {
    const root = createRepository([
      { dir: 'tokens', name: '@entur/tokens', version: '1.0.0' },
    ]);

    writePackage(root, {
      dir: 'sheet',
      name: '@entur/sheet',
      version: '0.1.0',
      dependencies: { '@entur/tokens': 'workspace:^' },
    });

    run(root);

    expect(readChangelog(root, 'sheet')).toContain(
      '**Note:** Version bump only for package @entur/sheet',
    );
    expect(readChangelog(root, 'sheet')).not.toContain(
      '### Entur Dependency Updates',
    );
  });
});

describe('the changelog title', () => {
  it('renames the one Lerna writes for a new changelog', () => {
    const root = dependencyOnlyRelease();

    stageRelease(root, [
      { dir: 'tokens', version: '1.0.1' },
      { dir: 'chip', version: '2.0.1' },
    ]);

    // What a package released for the first time is left with.
    const changelogPath = path.join(root, 'packages', 'chip', 'CHANGELOG.md');
    fs.writeFileSync(
      changelogPath,
      fs
        .readFileSync(changelogPath, 'utf8')
        .replace('# Changelog', '# Change Log'),
    );

    run(root);

    expect(readChangelog(root, 'chip').split('\n')[0]).toBe('# Changelog');
  });

  it('leaves a changelog that already has it untouched', () => {
    const root = dependencyOnlyRelease();

    // tokens is not part of this release, so nothing may be written to it.
    const before = readChangelog(root, 'tokens');

    stageRelease(root, [{ dir: 'chip', version: '2.0.1' }]);

    run(root);

    expect(readChangelog(root, 'tokens')).toBe(before);
    expect(readChangelog(root, 'chip').split('\n')[0]).toBe('# Changelog');
  });
});

describe('rerunning the generator', () => {
  it('changes nothing the second time', () => {
    const root = dependencyOnlyRelease();

    stageRelease(root, [
      { dir: 'tokens', version: '1.0.1' },
      { dir: 'chip', version: '2.0.1' },
    ]);

    run(root);
    const first = readChangelog(root, 'chip');

    run(root);
    const second = readChangelog(root, 'chip');

    expect(second).toBe(first);
    expect(second.match(/### Entur Dependency Updates/g)).toHaveLength(1);
    expect(second.match(/- \*\*@entur\/tokens:\*\*/g)).toHaveLength(1);
  });
});
