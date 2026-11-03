'use strict';

// Metadata trailers add no value for consumers reading the changelog.
const TRAILER_PATTERN =
  /^(AI-assistant|Co-authored-by|Signed-off-by|Reviewed-by|Reported-by|Tested-by|Acked-by|Refs|ISSUES CLOSED):/i;

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

// Aligns continuation lines with the text of the bullet they belong to.
// Without it a blank line ends the list item, and the rest of the note is
// rendered as a paragraph of its own.
function indentLines(text, skipFirst) {
  return text
    .split('\n')
    .map((line, index) => {
      if (skipFirst && index === 0) return line;
      return line.trim() ? `  ${line}` : '';
    })
    .join('\n');
}

// Renders the commit body as an indented block under its changelog bullet.
function formatBody(body) {
  if (typeof body !== 'string') return '';

  const cleaned = stripTrailers(body);

  if (!cleaned) return '';

  return `\n\n${indentLines(cleaned, false)}`;
}

// The note is written straight after the bullet, so only what follows the
// first line needs the indent.
function formatNote(text) {
  return indentLines(stripTrailers(text), true);
}

module.exports = { formatBody, formatNote };
