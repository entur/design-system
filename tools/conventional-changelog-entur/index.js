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
  DEPRECATED: 'Deprecations',
};
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

  const originalWhatBump = preset.recommendedBumpOpts.whatBump;

  preset.recommendedBumpOpts.whatBump = function whatBump(commits) {
    const result = originalWhatBump(commits);

    const hasBangBreaking = commits.some(commit =>
      /^.+!$/.test(commit.header?.split(':')[0]),
    );

    if (hasBangBreaking && result.level !== 0) {
      const bangCount = commits.filter(commit =>
        /^.+!$/.test(commit.header?.split(':')[0]),
      ).length;

      return {
        level: 0,
        reason: `There are ${bangCount} BREAKING CHANGES (! suffix) and ${result.reason}`,
      };
    }

    return result;
  };

  return preset;
}

module.exports = createPreset;
