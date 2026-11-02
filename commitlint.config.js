// Co-authored-by is for humans; AI tools use an `AI-assistant:` trailer (AGENTS.md).
// Matched on the tools' own addresses, so a person's name never trips it.
const AI_CO_AUTHOR =
  /^co-authored-by:.*<(noreply@anthropic\.com|\d+\+copilot@users\.noreply\.github\.com|[^>]*\[bot\]@users\.noreply\.github\.com|cursoragent@cursor\.com)>/im;

module.exports = {
  extends: ['@commitlint/config-conventional'],
  plugins: [
    {
      rules: {
        'no-ai-co-author': ({ raw }) => [
          !AI_CO_AUTHOR.test(raw ?? ''),
          'use an `AI-assistant: <tool> (<model>)` trailer for AI tools, not Co-authored-by',
        ],
      },
    },
  ],
  rules: {
    'body-max-line-length': [0],
    // A BREAKING CHANGE note is one changelog line, often over 100 characters.
    'footer-max-line-length': [0],
    'no-ai-co-author': [2, 'always'],
  },
};
