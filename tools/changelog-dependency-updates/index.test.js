'use strict';

const {
  anchorForVersion,
  applyDependencySections,
  diffInternalDependencies,
  findReleaseSections,
  hasBumpOnlyNote,
  normalizeTitle,
  renderDependencySections,
  resolveSpec,
} = require('./index.js');

const changelog = version =>
  [
    '# Changelog',
    '',
    'All notable changes to this project will be documented in this file.',
    '',
    `## [${version}](https://github.com/entur/design-system/compare/@entur/chip@2.0.0...@entur/chip@${version}) (2026-01-02)`,
    '',
    '**Note:** Version bump only for package @entur/chip',
    '',
    '## [2.0.0](https://github.com/entur/design-system/compare/@entur/chip@1.9.0...@entur/chip@2.0.0) (2026-01-01)',
    '',
    '**Note:** Version bump only for package @entur/chip',
    '',
  ].join('\n');

describe('resolveSpec', () => {
  it('resolves the workspace protocol the way the registry sees it', () => {
    expect(resolveSpec('workspace:^', '1.2.3')).toBe('^1.2.3');
    expect(resolveSpec('workspace:~', '1.2.3')).toBe('~1.2.3');
    expect(resolveSpec('workspace:*', '1.2.3')).toBe('1.2.3');
    expect(resolveSpec('workspace:^2.0.0', '1.2.3')).toBe('^2.0.0');
  });

  it('leaves plain ranges alone and refuses what it cannot resolve', () => {
    expect(resolveSpec('^1.2.3', undefined)).toBe('^1.2.3');
    expect(resolveSpec('workspace:^', undefined)).toBeNull();
    expect(resolveSpec('link:../tokens', '1.2.3')).toBeNull();
    expect(resolveSpec(undefined, '1.2.3')).toBeNull();
  });
});

describe('normalizeTitle', () => {
  it('renames the title Lerna gives a new changelog', () => {
    expect(normalizeTitle('# Change Log\n\nAll notable changes\n')).toBe(
      '# Changelog\n\nAll notable changes\n',
    );
  });

  it('leaves every other first line alone', () => {
    expect(normalizeTitle(changelog('2.0.1'))).toBe(changelog('2.0.1'));
    // Not the title: a release entry that happens to say it further down.
    expect(normalizeTitle('# Changelog\n\n# Change Log\n')).toBe(
      '# Changelog\n\n# Change Log\n',
    );
  });
});

describe('findReleaseSections', () => {
  it('reads the version out of both heading levels', () => {
    const versions = text => findReleaseSections(text).map(s => s.version);

    expect(versions(changelog('2.0.1'))).toEqual(['2.0.1', '2.0.0']);
    expect(
      versions('# Changelog\n\n# [3.0.0](https://x) (2026-01-02)\n'),
    ).toEqual(['3.0.0']);
    expect(versions('# Changelog\n\n## 1.0.0 (2026-01-02)\n')).toEqual([
      '1.0.0',
    ]);
  });
});

describe('anchorForVersion', () => {
  it('builds the anchor GitHub gives that release heading', () => {
    expect(anchorForVersion(changelog('2.0.1'), '2.0.1')).toBe(
      '201-2026-01-02',
    );
    expect(anchorForVersion(changelog('2.0.1'), '9.9.9')).toBeNull();
  });

  // @entur/layout released 4.0.0 twice, from 3.6.1 and from 3.7.5.
  const released = (from, version, date) =>
    `# [${version}](https://github.com/entur/design-system/compare/@entur/layout@${from}...@entur/layout@${version}) (${date})`;

  const twice = [
    '# Changelog',
    '',
    released('3.7.5', '4.0.0', '2026-07-30'),
    '',
    released('3.6.1', '4.0.0', '2026-05-13'),
    '',
  ].join('\n');

  it('picks between two entries of one version by the range it came from', () => {
    expect(anchorForVersion(twice, '4.0.0', '^3.6.1')).toBe('400-2026-05-13');
    expect(anchorForVersion(twice, '4.0.0', '^3.7.5')).toBe('400-2026-07-30');
  });

  it('gives no anchor when the entry stays ambiguous', () => {
    // The file itself is still linked: a wrong entry is worse than none.
    expect(anchorForVersion(twice, '4.0.0')).toBeNull();
    expect(anchorForVersion(twice, '4.0.0', '^1.0.0')).toBeNull();
  });
});

describe('diffInternalDependencies', () => {
  const versions = (entries = {}) => new Map(Object.entries(entries));

  it('reports a workspace dependency whose target was released', () => {
    const changes = diffInternalDependencies({
      previousManifest: { dependencies: { '@entur/tokens': 'workspace:^' } },
      currentManifest: { dependencies: { '@entur/tokens': 'workspace:^' } },
      previousVersions: versions({ '@entur/tokens': '1.0.0' }),
      currentVersions: versions({ '@entur/tokens': '1.1.0' }),
    });

    expect(changes.dependencies).toEqual([
      { name: '@entur/tokens', from: '^1.0.0', to: '^1.1.0', version: '1.1.0' },
    ]);
    expect(changes.peerDependencies).toEqual([]);
  });

  it('ignores external dependencies and unchanged ranges', () => {
    const changes = diffInternalDependencies({
      previousManifest: {
        dependencies: { classnames: '^2.5.0', '@entur/tokens': 'workspace:^' },
      },
      currentManifest: {
        dependencies: { classnames: '^2.5.1', '@entur/tokens': 'workspace:^' },
      },
      previousVersions: versions({ '@entur/tokens': '1.0.0' }),
      currentVersions: versions({ '@entur/tokens': '1.0.0' }),
    });

    expect(changes.dependencies).toEqual([]);
  });

  it('separates peer requirements from ordinary updates', () => {
    const changes = diffInternalDependencies({
      previousManifest: { peerDependencies: { '@entur/tokens': '>=1.0.0' } },
      currentManifest: { peerDependencies: { '@entur/tokens': '>=1.1.0' } },
      previousVersions: versions({ '@entur/tokens': '1.0.0' }),
      currentVersions: versions({ '@entur/tokens': '1.1.0' }),
    });

    expect(changes.dependencies).toEqual([]);
    expect(changes.peerDependencies).toHaveLength(1);
  });

  it('does not read a spec it cannot resolve as an addition', () => {
    const changes = diffInternalDependencies({
      // The dependency was there all along; only the way it is declared moved.
      previousManifest: { dependencies: { '@entur/tokens': 'link:../tokens' } },
      currentManifest: { dependencies: { '@entur/tokens': 'workspace:^' } },
      previousVersions: versions({ '@entur/tokens': '1.0.0' }),
      currentVersions: versions({ '@entur/tokens': '1.1.0' }),
    });

    expect(changes.dependencies).toEqual([]);
  });

  it('does not read a dependency without a previous version as removed', () => {
    const changes = diffInternalDependencies({
      previousManifest: { dependencies: { '@entur/tokens': 'workspace:^' } },
      currentManifest: { dependencies: { '@entur/tokens': 'workspace:^' } },
      // No tag for the previous release: the range it resolved to is unknown.
      previousVersions: versions(),
      currentVersions: versions({ '@entur/tokens': '1.1.0' }),
    });

    expect(changes.dependencies).toEqual([]);
  });

  it('reports dependencies that were added or removed', () => {
    const changes = diffInternalDependencies({
      previousManifest: { dependencies: { '@entur/icons': 'workspace:^' } },
      currentManifest: { dependencies: { '@entur/tokens': 'workspace:^' } },
      previousVersions: versions({
        '@entur/icons': '3.0.0',
        '@entur/tokens': '1.0.0',
      }),
      currentVersions: versions({
        '@entur/icons': '3.0.0',
        '@entur/tokens': '1.0.0',
      }),
    });

    expect(changes.dependencies).toEqual([
      { name: '@entur/icons', from: '^3.0.0', to: null, version: '3.0.0' },
      { name: '@entur/tokens', from: null, to: '^1.0.0', version: '1.0.0' },
    ]);
  });
});

describe('applyDependencySections', () => {
  const sections = renderDependencySections(
    {
      dependencies: [
        {
          name: '@entur/tokens',
          from: '^1.0.0',
          to: '^1.1.0',
          version: '1.1.0',
        },
      ],
      peerDependencies: [],
    },
    { changelogUrl: () => 'https://example.com/CHANGELOG.md#110-2026-01-02' },
  );

  // cli.js only ever rewrites the newest entry, and passes it in.
  const apply = (text, overrides = {}) =>
    applyDependencySections(text, findReleaseSections(text)[0], {
      packageName: '@entur/chip',
      sections,
      ...overrides,
    });

  it('replaces only the note in the entry being released', () => {
    const content = apply(changelog('2.0.1'));

    expect(content).toContain('### Entur Dependency Updates');
    // The 2.0.0 entry below still carries its own note.
    expect(content.match(/Version bump only/g)).toHaveLength(1);
  });

  it('refuses an entry whose notes were authored', () => {
    const authored = changelog('2.0.1').replace(
      '**Note:** Version bump only for package @entur/chip',
      '### Bug Fixes\n\n- **chip:** stop the label wrapping ([abc](https://x))',
    );

    expect(apply(authored)).toBeNull();
  });

  it('is a no-op once the sections are there', () => {
    expect(apply(apply(changelog('2.0.1')))).toBeNull();
  });
});

describe('hasBumpOnlyNote', () => {
  const latest = text => findReleaseSections(text)[0];

  it('sees the note in the entry being released', () => {
    const text = changelog('2.0.1');

    expect(hasBumpOnlyNote(text, latest(text), '@entur/chip')).toBe(true);
    // The note names its own package, and nobody else's.
    expect(hasBumpOnlyNote(text, latest(text), '@entur/tokens')).toBe(false);
  });

  it('sees no note in an authored entry', () => {
    const text = changelog('2.0.1').replace(
      '**Note:** Version bump only for package @entur/chip',
      '### Bug Fixes\n\n- **chip:** stop the label wrapping ([abc](https://x))',
    );

    expect(hasBumpOnlyNote(text, latest(text), '@entur/chip')).toBe(false);
  });
});
