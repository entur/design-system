const { sync: parse } = require('conventional-commits-parser');
const writer = require('conventional-changelog-writer');
const { Readable } = require('stream');

const createPreset = require('./index');

// The same parser and writer versions Lerna uses through conventional-changelog-core
let preset;
beforeAll(async () => {
  preset = await createPreset();
});

const commit = message => parse(message, preset.parserOpts);

const BUMP = ['major', 'minor', 'patch'];
const bump = (...messages) =>
  BUMP[preset.recommendedBumpOpts.whatBump(messages.map(commit)).level];

const changelog = messages =>
  new Promise((resolve, reject) => {
    const chunks = [];
    Readable.from(messages.map(commit))
      .pipe(writer({ version: '1.0.0' }, preset.writerOpts))
      .on('data', chunk => chunks.push(chunk))
      .on('end', () => resolve(chunks.join('')))
      .on('error', reject);
  });

const sections = markdown =>
  markdown.match(/^### .+$/gm).map(line => line.slice(4));

describe('version bump', () => {
  it.each([
    ['feat(x): add a', 'minor'],
    ['fix(x): fix a', 'patch'],
    ['feat(x)!: drop a', 'major'],
    ['feat(x): drop a\n\nBREAKING CHANGE: a is gone. Use b.', 'major'],
    ['feat(x): drop a\n\nBREAKING CHANGES: a is gone. Use b.', 'major'],
    ['feat(x): add b\n\nDEPRECATED: a will be removed in 2.0.0.', 'minor'],
    ['feat(x)!: drop c\n\nDEPRECATED: a will be removed in 2.0.0.', 'major'],
    ['fix(x): fix a\n\nDeprecated props still work.', 'patch'],
    ['feat(x/beta/y)!: drop a', 'minor'],
    ['fix(x/beta/y)!: drop a', 'minor'],
    ['fix(x/beta/y): drop a\n\nBREAKING CHANGE: a is gone. Use b.', 'minor'],
  ])('%j bumps %s', (message, level) => {
    expect(bump(message)).toBe(level);
  });
});

it('bumps a major when a stable breaking change ships with a beta one', () => {
  expect(bump('feat(x/beta/y)!: drop a', 'fix(x)!: drop b')).toBe('major');
});

describe('changelog', () => {
  it('lists what needs action first, beta after stable', async () => {
    const markdown = await changelog([
      'fix(x): fix a',
      'feat(x): add b\n\nDEPRECATED: a will be removed in 2.0.0.',
      'feat(x/beta/y): add c\n\nDEPRECATED: d will be removed in 1.0.0.',
      'feat(x/beta/y)!: drop e',
      'feat(x): drop f\n\nBREAKING CHANGE: f is gone. Use g.',
    ]);

    expect(sections(markdown)).toEqual([
      'BREAKING CHANGES',
      'BREAKING CHANGES (beta)',
      'Deprecations',
      'Deprecations (beta)',
      'Bug Fixes',
      'Features',
      'Features (beta)',
    ]);
  });

  it('keeps the breaking change of a `!` commit with a DEPRECATED footer', async () => {
    const markdown = await changelog([
      'feat(x)!: drop c\n\nDEPRECATED: a will be removed in 2.0.0.',
    ]);

    expect(markdown).toMatch(/### BREAKING CHANGES\s+\* \*\*x:\*\* drop c/);
    expect(markdown).toMatch(
      /### Deprecations\s+\* \*\*x:\*\* a will be removed in 2\.0\.0\./,
    );
  });

  it('leaves a body line starting with "Deprecated" in the body', async () => {
    const markdown = await changelog([
      'fix(x): fix a\n\nDeprecated props still work.',
    ]);

    expect(sections(markdown)).toEqual(['Bug Fixes']);
    expect(markdown).toContain('  Deprecated props still work.');
  });
});
