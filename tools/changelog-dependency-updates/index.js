'use strict';

/**
 * Turns Lerna's "Version bump only for package X" fallback into a changelog
 * entry that says which internal dependencies moved, and to where.
 *
 * This file holds the pure logic — parsing, diffing and rendering. The file
 * system and git live in cli.js, so everything here is testable with plain
 * data.
 */

const DEPENDENCY_HEADING = '### Entur Dependency Updates';
const PEER_HEADING = '### Entur Peer Requirements';

// Lerna writes this whenever a release entry ends up without a single bullet.
const bumpOnlyNote = name => `**Note:** Version bump only for package ${name}`;

/**
 * Renames the title Lerna gives a changelog it creates ("Change Log") to the
 * one every file here carries. First line only: an entry further down may well
 * quote it.
 */
const normalizeTitle = changelog =>
  changelog.replace(/^# Change Log[ \t]*(?=\n|$)/, '# Changelog');

// A release heading is an h1 (minor/major) or h2 (patch) whose text is the
// version, either bare or as a compare link, optionally followed by the date.
// Matched one piece at a time: a single expression for all of it needs several
// runs of optional whitespace next to each other, and those backtrack.
const HEADING = /^#{1,2}[ \t](.*)$/;
const RELEASE_DATE = /[ \t]\(\d{4}-\d{2}-\d{2}\)$/;
const LINKED_VERSION = /^\[(\d[^\][]*)\]\([^()]*\)$/;
const BARE_VERSION = /^(\d\S*)$/;

/** The version a heading names, or null when the line names no release. */
function releaseVersion(line) {
  const heading = HEADING.exec(line);

  if (!heading) return null;

  const text = heading[1].trim().replace(RELEASE_DATE, '').trim();
  const linked = LINKED_VERSION.exec(text);

  if (linked) return linked[1];

  const bare = BARE_VERSION.exec(text);

  return bare ? bare[1] : null;
}

/** The release sections of a changelog, newest first. */
function findReleaseSections(changelog) {
  const lines = changelog.split('\n');
  const releases = [];

  lines.forEach((line, index) => {
    const version = releaseVersion(line);

    if (version) {
      releases.push({ start: index, heading: line, version });
    }
  });

  // A section runs until the next release heading, or the end of the file.
  releases.forEach((release, position) => {
    release.end = releases[position + 1]?.start ?? lines.length;
  });

  return releases;
}

/**
 * The anchor GitHub gives a release heading, so a dependency bullet can link
 * to the entry it refers to rather than the top of the file.
 */
function headingAnchor(heading) {
  return (
    heading
      .replace(/^#+\s*/, '')
      // Link syntax renders as its text: [4.1.1](url) -> 4.1.1
      .replace(/\[([^\][]*)\]\([^()]*\)/g, '$1')
      .toLowerCase()
      .replace(/[^\w\- ]+/g, '')
      .trim()
      .replace(/ +/g, '-')
  );
}

/** The version a range names, so `^3.6.1` can pick between two `4.0.0`s. */
const versionInRange = range => /\d[\w.-]*/.exec(range || '')?.[0] ?? null;

/**
 * The anchor for one version in a dependency's changelog. A version can head
 * more than one entry — `@entur/layout` released `4.0.0` twice — and the entry
 * meant here is the one Lerna's compare link says came from `previousRange`.
 * Ambiguity that survives that gets no anchor: the file beats the wrong entry.
 */
function anchorForVersion(changelog, version, previousRange) {
  if (!version) return null;

  const sections = findReleaseSections(changelog).filter(
    entry => entry.version === version,
  );

  if (sections.length === 1) return headingAnchor(sections[0].heading);
  if (!sections.length) return null;

  const previous = versionInRange(previousRange);
  const matching = previous
    ? sections.filter(entry => entry.heading.includes(`@${previous}...`))
    : [];

  return matching.length === 1 ? headingAnchor(matching[0].heading) : null;
}

/**
 * What a `workspace:` specifier means to a consumer: the package manager
 * rewrites it to a plain range against the version being published.
 */
function resolveSpec(spec, version) {
  if (typeof spec !== 'string') return null;

  if (!spec.startsWith('workspace:')) {
    // file:, link: and portal: never reach a published package.
    if (/^(file|link|portal):/.test(spec)) return null;
    return spec;
  }

  const range = spec.slice('workspace:'.length);

  // An explicit range survives the rewrite untouched.
  if (!['', '*', '^', '~'].includes(range)) return range;

  if (!version) return null;

  return range === '^' || range === '~' ? `${range}${version}` : version;
}

const INTERNAL_FIELDS = ['dependencies', 'peerDependencies'];

/**
 * Compares the resolved ranges of a package's internal dependencies between
 * its previous release and this one. Anything that cannot be resolved on both
 * sides is left out: an unverified claim is worse than no claim.
 */
function diffInternalDependencies({
  previousManifest,
  currentManifest,
  previousVersions,
  currentVersions,
}) {
  const changes = { dependencies: [], peerDependencies: [] };

  for (const field of INTERNAL_FIELDS) {
    const before = previousManifest[field] || {};
    const after = currentManifest[field] || {};

    const names = new Set([...Object.keys(before), ...Object.keys(after)]);

    for (const name of [...names].sort()) {
      // Only packages released from this repository can be compared.
      if (!previousVersions.has(name) && !currentVersions.has(name)) continue;

      const declaredBefore = Object.hasOwn(before, name);
      const declaredAfter = Object.hasOwn(after, name);

      const from = resolveSpec(before[name], previousVersions.get(name));
      const to = resolveSpec(after[name], currentVersions.get(name));

      if (from === to) continue;
      // A spec that is declared but cannot be resolved verifies nothing, and
      // must not read as absent: link:../tokens is not the dependency being
      // added, and a missing tag is not it being removed.
      if ((declaredBefore && from === null) || (declaredAfter && to === null)) {
        continue;
      }

      changes[field].push({
        name,
        from,
        to,
        version: currentVersions.get(name) || null,
      });
    }
  }

  return changes;
}

function renderBullet(change, changelogUrl) {
  const url = change.to
    ? changelogUrl(change.name, change.version, change.from)
    : null;
  const link = url ? ` ([changelog](${url}))` : '';

  if (!change.from) {
    return `- **${change.name}:** added at \`${change.to}\`${link}`;
  }
  if (!change.to) {
    return `- **${change.name}:** removed (was \`${change.from}\`)`;
  }

  return `- **${change.name}:** \`${change.from}\` → \`${change.to}\`${link}`;
}

/**
 * The markdown that replaces the fallback note. Peer requirements get their
 * own section: they oblige the consumer to have a version, where an ordinary
 * dependency update is something they get.
 */
function renderDependencySections(changes, { changelogUrl }) {
  return [
    [DEPENDENCY_HEADING, changes.dependencies],
    [PEER_HEADING, changes.peerDependencies],
  ]
    .filter(([, bullets]) => bullets.length)
    .map(([heading, bullets]) =>
      [
        heading,
        '',
        ...bullets.map(change => renderBullet(change, changelogUrl)),
      ].join('\n'),
    )
    .join('\n\n');
}

/** Where the note Lerna writes sits in an entry, or -1 when it is not there. */
const bumpOnlyNoteIndex = (entry, packageName) =>
  entry.findIndex(line => line.trim() === bumpOnlyNote(packageName));

/** Whether a release entry still carries the note Lerna wrote. */
const hasBumpOnlyNote = (changelog, section, packageName) =>
  bumpOnlyNoteIndex(
    changelog.split('\n').slice(section.start, section.end),
    packageName,
  ) !== -1;

/**
 * The changelog with the sections written into one release entry, in place of
 * the fallback note, or null when that entry has no fallback note to replace:
 * an authored entry, or one this tool has already filled in. Everything else
 * in the file, that entry included, is left as it was written.
 */
function applyDependencySections(
  changelog,
  section,
  { packageName, sections },
) {
  const lines = changelog.split('\n');
  const entry = lines.slice(section.start, section.end);
  const noteIndex = bumpOnlyNoteIndex(entry, packageName);

  if (noteIndex === -1) return null;

  entry.splice(noteIndex, 1, ...sections.split('\n'));

  // The note Lerna writes trails several blank lines, which look like nothing
  // after a one-line note and like a gap after a section. One is enough.
  while (entry.length && entry[entry.length - 1].trim() === '') entry.pop();
  entry.push('');

  return [
    ...lines.slice(0, section.start),
    ...entry,
    ...lines.slice(section.end),
  ].join('\n');
}

module.exports = {
  DEPENDENCY_HEADING,
  INTERNAL_FIELDS,
  PEER_HEADING,
  anchorForVersion,
  applyDependencySections,
  diffInternalDependencies,
  findReleaseSections,
  hasBumpOnlyNote,
  normalizeTitle,
  renderDependencySections,
  resolveSpec,
};
