// Co-authored-by is for humans; AI tools use an `AI-assistant:` trailer (AGENTS.md).
// Matched on the tools' own addresses, so a person's name never trips it.
const AI_CO_AUTHOR =
  /^co-authored-by:.*<(noreply@anthropic\.com|\d+\+copilot@users\.noreply\.github\.com|[^>]*\[bot\]@users\.noreply\.github\.com|cursoragent@cursor\.com)>/im;

// A footer runs until a blank line, the next footer or the end of the message
// (`$(?![\s\S])`, since `$` alone matches every line end with the m flag).
const footers = (raw, keyword) =>
  [
    ...(raw ?? '').matchAll(
      new RegExp(
        `^${keyword}:[ \\t]*([\\s\\S]*?)(?=\\n\\s*\\n|\\n[A-Za-z-]+(?: CHANGES?)?:|$(?![\\s\\S]))`,
        'gm',
      ),
    ),
  ].map(match => match[1].trim());

// Words that leave consumers guessing whether, and how, a change hits them.
const VAGUE =
  /\b(might|may|could|possibly|probably|some|several|etc|et cetera)\b/i;

// The release a deprecated API goes away in, e.g. "will be removed in 10.0.0".
// A bare version could be when it was deprecated instead.
const REMOVAL_VERSION = /\b(removed|removal) in \d+\.\d+\.\d+\b/i;

module.exports = {
  extends: ['@commitlint/config-conventional'],
  plugins: [
    {
      rules: {
        'no-ai-co-author': ({ raw }) => [
          !AI_CO_AUTHOR.test(raw ?? ''),
          'use an `AI-assistant: <tool> (<model>)` trailer for AI tools, not Co-authored-by',
        ],
        'breaking-change-specific': ({ raw }) => {
          const vague = footers(raw, 'BREAKING[ -]CHANGES?')
            .map(text => text.match(VAGUE)?.[0])
            .filter(Boolean);
          return [
            vague.length === 0,
            `say exactly what breaks and what to do instead of "${vague[0]}" in BREAKING CHANGE (AGENTS.md)`,
          ];
        },
        'deprecation-removal-version': ({ raw }) => {
          const missing = footers(raw, 'DEPRECATED').some(
            text => !REMOVAL_VERSION.test(text),
          );
          return [
            !missing,
            'say which version the API goes away in, e.g. "will be removed in 10.0.0", in DEPRECATED (AGENTS.md)',
          ];
        },
      },
    },
  ],
  rules: {
    'body-max-line-length': [0],
    // A BREAKING CHANGE note is one changelog line, often over 100 characters.
    'footer-max-line-length': [0],
    'no-ai-co-author': [2, 'always'],
    // A warning: the words also have plain uses, such as "you may now pass".
    'breaking-change-specific': [1, 'always'],
    'deprecation-removal-version': [2, 'always'],
  },
};
