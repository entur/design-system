import { parseCodeOwners } from './codeOwnersAnalyzer';

describe('parseCodeOwners', () => {
  it('extracts unique owners from standard CODEOWNERS format', () => {
    const content = `* @entur/team-designsystem
packages/sanity/ @entur/team-designsystem @entur/team-selvbetjent`;

    expect(parseCodeOwners(content)).toEqual([
      '@entur/team-designsystem',
      '@entur/team-selvbetjent',
    ]);
  });

  it('ignores comments and blank lines', () => {
    const content = `# This is a comment

# Another comment
* @entur/team-a
`;
    expect(parseCodeOwners(content)).toEqual(['@entur/team-a']);
  });

  it('handles individual user owners', () => {
    const content = `* @someuser @entur/team-a`;
    expect(parseCodeOwners(content)).toEqual(['@entur/team-a', '@someuser']);
  });

  it('returns empty array for empty file', () => {
    expect(parseCodeOwners('')).toEqual([]);
  });

  it('returns empty array for comments-only file', () => {
    expect(parseCodeOwners('# just comments\n# nothing else')).toEqual([]);
  });

  it('deduplicates owners across multiple patterns', () => {
    const content = `* @entur/team-a @entur/team-b
src/ @entur/team-a @entur/team-c
docs/ @entur/team-b`;

    expect(parseCodeOwners(content)).toEqual([
      '@entur/team-a',
      '@entur/team-b',
      '@entur/team-c',
    ]);
  });
});
