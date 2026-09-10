'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const { assertRepository, manifestAt } = require('./repo.js');
const { cleanup, createRepository } = require('./testRepository.js');

const git = (root, args) =>
  execFileSync('git', ['-C', root, ...args], { encoding: 'utf8' });

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

const repository = () =>
  createRepository([
    { dir: 'tokens', name: '@entur/tokens', version: '1.0.0' },
  ]);

afterEach(cleanup);

describe('assertRepository', () => {
  it('accepts a repository git can read', () => {
    expect(() => assertRepository(repository())).not.toThrow();
  });

  it('refuses a root that is not one', () => {
    const root = repository();

    fs.rmSync(path.join(root, '.git'), { recursive: true, force: true });

    expect(() => assertRepository(root)).toThrow(/not a git repository/);
  });
});

describe('manifestAt', () => {
  it('reads the manifest at a tag', () => {
    const root = repository();

    expect(
      manifestAt(root, '@entur/tokens@1.0.0', 'packages/tokens').version,
    ).toBe('1.0.0');
  });

  it('answers null for a ref or a path that is not there', () => {
    const root = repository();

    expect(
      manifestAt(root, '@entur/tokens@9.9.9', 'packages/tokens'),
    ).toBeNull();
    expect(manifestAt(root, 'HEAD', 'packages/sheet')).toBeNull();
  });

  it('stops the run on a manifest that is not JSON', () => {
    const root = repository();

    fs.writeFileSync(
      path.join(root, 'packages', 'tokens', 'package.json'),
      '{ "name": ',
    );
    git(root, ['add', '.']);
    commit(root, 'chore: break the manifest');

    // Unreadable is not the same answer as absent: a release must not quietly
    // carry on and report that nothing moved.
    expect(() => manifestAt(root, 'HEAD', 'packages/tokens')).toThrow(
      SyntaxError,
    );
  });
});
