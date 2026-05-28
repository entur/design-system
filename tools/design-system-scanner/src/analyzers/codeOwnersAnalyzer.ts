import * as fs from 'fs';
import * as path from 'path';

const CODEOWNERS_PATHS = [
  '.github/CODEOWNERS',
  'CODEOWNERS',
  'docs/CODEOWNERS',
];

/**
 * Parse a CODEOWNERS file and return all unique owners mentioned.
 * Owners are GitHub usernames or team slugs (e.g. "@entur/team-x").
 */
export function analyzeCodeOwners(repoDir: string): string[] {
  let content: string | null = null;

  for (const relative of CODEOWNERS_PATHS) {
    const fullPath = path.join(repoDir, relative);
    if (fs.existsSync(fullPath)) {
      content = fs.readFileSync(fullPath, 'utf-8');
      break;
    }
  }

  if (!content) return [];

  return parseCodeOwners(content);
}

/** Extract unique owners from CODEOWNERS file content. */
export function parseCodeOwners(content: string): string[] {
  const owners = new Set<string>();

  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    // Format: <pattern> <owner1> <owner2> ...
    // Owners start with @ — split on whitespace and collect them
    const tokens = trimmed.split(/\s+/);
    for (let i = 1; i < tokens.length; i++) {
      const token = tokens[i];
      if (token.startsWith('@entur/')) {
        owners.add(token);
      }
    }
  }

  return [...owners].sort();
}
