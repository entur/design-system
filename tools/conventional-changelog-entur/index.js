'use strict';

const createAngularPreset = require('conventional-changelog-angular');

// Metadata trailers add no value for consumers reading the changelog.
const TRAILER_PATTERN =
  /^(AI-assistant|Co-authored-by|Signed-off-by|Reviewed-by|Reported-by|Tested-by|Acked-by|Refs):/i;

// Older commits list the packages they touch; the changelog is per package.
const AFFECTS_PATTERN = /^affects:/i;

function stripTrailers(text) {
  const kept = [];
  let inAffects = false;

  for (const line of text.split('\n')) {
    const trimmed = line.trim();

    // The affects list wraps across lines and ends at the next blank line.
    if (inAffects) {
      if (!trimmed) inAffects = false;
      continue;
    }

    if (AFFECTS_PATTERN.test(trimmed)) {
      inAffects = true;
      continue;
    }

    if (TRAILER_PATTERN.test(trimmed)) continue;

    kept.push(line);
  }

  return kept
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// Scopes for beta components carry a beta segment, e.g. layout/beta/sidebar.
const BETA_SCOPE_PATTERN = /(^|\/)beta(\/|$)/i;
const BETA_SUFFIX = ' (beta)';

const betaTitle = title => `${title}${BETA_SUFFIX}`;
const isBetaTitle = title => title.endsWith(BETA_SUFFIX);

// Renders the commit body as an indented block under its changelog bullet.
function formatBody(body) {
  if (typeof body !== 'string') return '';

  const cleaned = stripTrailers(body);

  if (!cleaned) return '';

  const indented = cleaned
    .split('\n')
    .map(line => (line.trim() ? `  ${line}` : ''))
    .join('\n');

  return `\n\n${indented}`;
}

async function createPreset() {
  const preset = await createAngularPreset();

  // The angular preset does not understand the `!` breaking-change marker, so
  // `feat(x)!: ...` fails to parse and is dropped from the changelog entirely.
  preset.parserOpts.headerPattern = /^(\w*)(?:\((.*)\))?!?: (.*)$/;
  // Only applied when the commit has no BREAKING CHANGE footer of its own.
  preset.parserOpts.breakingHeaderPattern = /^(\w*)(?:\((.*)\))?!: (.*)$/;

  // Angular only writes the commit subject, so the long description written in
  // the Commitizen prompt never reached the changelog. `body` is always a
  // string after the transform below, so the partial needs no conditional.
  preset.writerOpts.commitPartial = `${preset.writerOpts.commitPartial.replace(
    /\s+$/,
    '',
  )}{{{body}}}\n`;

  const originalTransform = preset.writerOpts.transform;

  preset.writerOpts.transform = function transform(commit, context) {
    const transformed = originalTransform(commit, context);

    if (!transformed) return transformed;

    const isBeta = BETA_SCOPE_PATTERN.test(transformed.scope || '');

    transformed.notes.forEach(note => {
      note.text = stripTrailers(note.text);
      if (isBeta) note.title = betaTitle(note.title);
    });
    transformed.body = formatBody(transformed.body);

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
