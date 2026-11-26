'use strict';

const { execFileSync } = require('child_process');
const createAngularPreset = require('conventional-changelog-angular');

const { formatBody, formatNote } = require('./format');

// Scopes for beta components carry a beta segment, e.g. layout/beta/sidebar.
const BETA_SCOPE_PATTERN = /(^|\/)beta(\/|$)/i;
const BETA_SUFFIX = ' (beta)';

const betaTitle = title => `${title}${BETA_SUFFIX}`;
const isBetaTitle = title => title.endsWith(BETA_SUFFIX);

// Footer keywords and the changelog section each one is listed under
const NOTE_SECTIONS = {
  'BREAKING CHANGE': 'BREAKING CHANGES',
  'BREAKING-CHANGE': 'BREAKING CHANGES',
  'BREAKING CHANGES': 'BREAKING CHANGES',
  DEPRECATED: 'Deprecations',
};
const isBreakingNote = note => NOTE_SECTIONS[note.title] === 'BREAKING CHANGES';
const BANG_HEADER = /^[^:]+!:/;
// What consumers must act on comes first, the soonest deadline at the top
const NOTE_ORDER = ['BREAKING CHANGES', 'Deprecations'];
const noteRank = title =>
  NOTE_ORDER.indexOf(title.replace(BETA_SUFFIX, '')) * 2 +
  (isBetaTitle(title) ? 1 : 0);

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' });

// The merges on main itself, not the ones inside a branch
let mainMerges;

// The pull request a commit came in with: the first merge on main after it.
// Commits pushed straight to main have none.
function pullRequestFor(hash) {
  try {
    mainMerges ??= new Set(
      git('rev-list', '--first-parent', '--merges', 'HEAD').split('\n'),
    );
    const merge = git(
      'log',
      '--merges',
      '--ancestry-path',
      '--reverse',
      '--format=%H %s',
      `${hash}..HEAD`,
    )
      .split('\n')
      .find(line => mainMerges.has(line.split(' ')[0]));
    return merge?.match(/ Merge pull request #(\d+)/)?.[1];
  } catch {
    return undefined;
  }
}

async function createPreset() {
  const preset = await createAngularPreset();

  // The angular preset does not understand the `!` breaking-change marker, so
  // `feat(x)!: ...` fails to parse and is dropped from the changelog entirely.
  preset.parserOpts.headerPattern = /^(\w*)(?:\((.*)\))?!?: (.*)$/;
  // Only applied when the commit has no BREAKING CHANGE footer of its own.
  preset.parserOpts.breakingHeaderPattern = /^(\w*)(?:\((.*)\))?!: (.*)$/;
  preset.parserOpts.noteKeywords = Object.keys(NOTE_SECTIONS);
  // Only the keyword in capitals with a colon starts a note. The default is
  // case-insensitive and takes a space, so "Deprecated prop still works." in
  // a body became a note.
  preset.parserOpts.notesPattern = keywords =>
    new RegExp(`^[\\s|*]*(${keywords}):\\s*(.*)`);

  // Notes need action from consumers, so they go before the commit groups
  preset.writerOpts.mainTemplate =
    '{{> header}}\n{{> footer}}\n{{#each commitGroups}}\n\n{{#if title}}\n### {{title}}\n\n{{/if}}\n{{#each commits}}\n{{> commit root=@root}}\n{{/each}}\n\n{{/each}}\n';
  preset.writerOpts.noteGroupsSort = (a, b) =>
    noteRank(a.title) - noteRank(b.title);

  // Angular only writes the commit subject, so the long description written in
  // the Commitizen prompt never reached the changelog. `body` is always a
  // string after the transform below, so the partial needs no conditional.
  // The pull request goes next to the commit, for the discussion behind it.
  preset.writerOpts.commitPartial = `${preset.writerOpts.commitPartial.replace(
    /\s+$/,
    '',
  )}{{#if pullRequest}} ([#{{pullRequest}}]({{@root.host}}/{{@root.owner}}/{{@root.repository}}/pull/{{pullRequest}})){{/if}}{{{body}}}\n`;

  const originalTransform = preset.writerOpts.transform;

  preset.writerOpts.transform = function transform(commit, context) {
    // Angular titles every note BREAKING CHANGES, so keep the keyword first
    // The parser only reads `!` as breaking when there is no other footer, so
    // `feat(x)!:` with a DEPRECATED footer would lose its breaking change.
    if (
      BANG_HEADER.test(commit.header ?? '') &&
      !commit.notes.some(isBreakingNote)
    ) {
      commit.notes.push({ title: 'BREAKING CHANGE', text: commit.subject });
    }
    const keywords = commit.notes.map(note => note.title);
    const transformed = originalTransform(commit, context);

    if (!transformed) return transformed;

    const isBeta = BETA_SCOPE_PATTERN.test(transformed.scope || '');

    transformed.notes.forEach((note, index) => {
      note.title = NOTE_SECTIONS[keywords[index]] ?? note.title;
      note.text = formatNote(note.text);
      if (isBeta) note.title = betaTitle(note.title);
    });
    transformed.body = formatBody(transformed.body);
    transformed.pullRequest = commit.hash && pullRequestFor(commit.hash);

    // Beta components can change in ways stable ones cannot, so they get their
    // own sections rather than sitting among the stable entries.
    if (isBeta && transformed.type) {
      transformed.type = betaTitle(transformed.type);
    }

    return transformed;
  };

  // Beta sections come after the stable ones, alphabetical within each half.
  preset.writerOpts.commitGroupsSort = (a, b) => {
    const aTitle = a.title || '';
    const bTitle = b.title || '';

    if (isBetaTitle(aTitle) !== isBetaTitle(bTitle)) {
      return isBetaTitle(aTitle) ? 1 : -1;
    }

    return aTitle.localeCompare(bTitle);
  };

  // Beta components can break in a minor (ADR 5), so only a stable breaking
  // change bumps a major. A deprecation is not breaking at all.
  preset.recommendedBumpOpts.whatBump = function whatBump(commits) {
    let level = 2;
    let breaking = 0;
    let features = 0;

    commits.forEach(commit => {
      const isBreaking =
        commit.notes.some(isBreakingNote) ||
        BANG_HEADER.test(commit.header ?? '');
      const isBeta = BETA_SCOPE_PATTERN.test(commit.scope ?? '');

      if (isBreaking && !isBeta) {
        breaking += 1;
        level = 0;
      } else if (commit.type === 'feat' || isBreaking) {
        features += 1;
        level = Math.min(level, 1);
      }
    });

    return {
      level,
      reason: `There are ${breaking} breaking changes and ${features} features, beta breaking changes included`,
    };
  };

  return preset;
}

module.exports = createPreset;
