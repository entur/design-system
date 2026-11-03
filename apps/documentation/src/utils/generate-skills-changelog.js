// Skills are not versioned: consumers always run the latest from main. The
// changelog is built from git history instead, one entry per day on main.
const { execFileSync } = require('child_process');
const path = require('path');
const {
  formatBody,
  formatNote,
} = require('../../../../tools/conventional-changelog-entur/format');

const REPO_URL = 'https://github.com/entur/design-system';
const REPO_ROOT = path.resolve(__dirname, '../../../..');

// Unit and record separators, so commit bodies can hold any text
const FIELD = '\x1f';
const RECORD = '\x1e';

const HEADER_PATTERN = /^(\w+)(?:\(([^)]*)\))?(!)?: (.*)$/;
const BREAKING_PATTERN = /^BREAKING[ -]CHANGES?:\s*/m;
const SKILLS_SCOPE_PATTERN = /^skills(?:\/(.+))?$/;

const SECTIONS = { feat: 'Features', fix: 'Bug Fixes' };
const SECTION_ORDER = ['Bug Fixes', 'Features', 'BREAKING CHANGES'];

const git = (...args) =>
  execFileSync('git', args, { cwd: REPO_ROOT, encoding: 'utf8' });

// The changed files follow the format, after its last field separator
const readCommits = (...range) =>
  git(
    'log',
    '--name-only',
    `--format=${RECORD}%H${FIELD}%P${FIELD}%cs${FIELD}%s${FIELD}%b${FIELD}`,
    ...range,
    '--',
    'skills',
  )
    .split(RECORD)
    .filter(record => record.trim())
    .map(record => {
      const [hash, parents, date, subject, body, files] = record.split(FIELD);
      return {
        hash,
        parents: parents.split(' '),
        date,
        subject,
        body,
        files: files.split('\n').filter(Boolean),
      };
    });

// More than this and the commit is about the skills as a whole
const MAX_NAMED_SKILLS = 2;

/** The skills a commit changes, from the folders under skills/. */
const skillsScope = files => {
  const skills = [
    ...new Set(
      files.map(file => file.match(/^skills\/([^/]+)\//)?.[1]).filter(Boolean),
    ),
  ].sort();

  if (skills.length === 0) return null;
  return skills.length > MAX_NAMED_SKILLS ? 'all skills' : skills.join(', ');
};

/** The commit as a changelog entry, or null when consumers don't need it. */
const toEntry = (commit, pullRequest) => {
  const match = commit.subject.match(HEADER_PATTERN);
  if (!match) return null;

  const [, type, scope = '', bang, subject] = match;
  const scopeMatch = scope.match(SKILLS_SCOPE_PATTERN);
  if (!SECTIONS[type] || !scopeMatch) return null;

  const [body, breaking] = commit.body.split(BREAKING_PATTERN);
  const note = breaking ?? (bang ? subject : null);

  const links = [
    `([${commit.hash.slice(0, 7)}](${REPO_URL}/commit/${commit.hash}))`,
    pullRequest && `([#${pullRequest}](${REPO_URL}/pull/${pullRequest}))`,
  ]
    .filter(Boolean)
    .join(' ');
  // A scope like skills/migrate-typography wins over the changed files
  const target = scopeMatch[1] ?? skillsScope(commit.files);
  const prefix = target ? `**${target}:** ` : '';

  return {
    section: SECTIONS[type],
    text: `- ${prefix}${subject} ${links}${formatBody(body)}`,
    note: note && `- ${prefix}${formatNote(note)}`,
  };
};

/** Every change to skills/ on main, as markdown in the format of the package changelogs. */
const generateSkillsChangelog = () => {
  const days = new Map();

  // Merges and direct commits on main whose diff touches skills/
  readCommits('--first-parent', 'HEAD').forEach(mainCommit => {
    const isMerge = mainCommit.parents.length > 1;
    const pullRequest = isMerge
      ? mainCommit.subject.match(/^Merge pull request #(\d+)/)?.[1]
      : undefined;
    const commits = isMerge
      ? readCommits('--no-merges', `${mainCommit.hash}^1..${mainCommit.hash}`)
      : [mainCommit];

    const sections = days.get(mainCommit.date) ?? {};
    commits.forEach(commit => {
      const entry = toEntry(commit, pullRequest);
      if (!entry) return;
      (sections[entry.section] ??= []).push(entry.text);
      if (entry.note) (sections['BREAKING CHANGES'] ??= []).push(entry.note);
    });
    days.set(mainCommit.date, sections);
  });

  const releases = [...days]
    .filter(([, sections]) => Object.keys(sections).length > 0)
    .map(([date, sections]) =>
      [
        `## ${date}`,
        ...SECTION_ORDER.filter(title => sections[title]).map(
          title => `### ${title}\n\n${sections[title].join('\n\n')}`,
        ),
      ].join('\n\n'),
    );

  return `# Changelog\n\n${releases.join('\n\n')}\n`;
};

/** Whether the checkout lacks the history the changelog is built from. */
const isShallowClone = () =>
  git('rev-parse', '--is-shallow-repository').trim() === 'true';

module.exports = { generateSkillsChangelog, isShallowClone };
