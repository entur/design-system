// Writes .design-sync/overrides/dts.mjs: Claude Code's design-sync lib/dts.mjs (from the
// staged .ds-sync/, not committed) with this repo's two edits. Part of cfg.buildCmd.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const SOURCE = join(resolve(HERE, '..'), '.ds-sync/lib/dts.mjs');
const TARGET = join(HERE, 'overrides/dts.mjs');

const edits = [
  {
    anchor: "  return s.length > 240 ? 'unknown' : s;\n}",
    insert: [
      '  // Unions and object literals are rebuilt from checker text, so they stay complete TS at any length.',
      "  if ((t.isUnion() || (t.isObject() && s.startsWith('{'))) && s.length <= 2000) return s;",
    ],
  },
  {
    anchor: '    let tt = typeText(pt, at);\n',
    replace: [
      '    // Polymorphic `as` would otherwise expand to hundreds of `"a" & T` members.',
      "    let tt = p.getName() === 'as' ? 'React.ElementType' : typeText(pt, at);",
    ],
  },
];

let text = readFileSync(SOURCE, 'utf8');
for (const edit of edits) {
  const count = text.split(edit.anchor).length - 1;
  if (count !== 1) {
    console.error(
      `patch-dts: expected the anchor once in ${SOURCE}, found ${count}:\n${edit.anchor}`,
    );
    console.error(
      'The design-sync lib changed upstream; re-apply the edits in .design-sync/patch-dts.mjs.',
    );
    process.exit(1);
  }
  text = edit.insert
    ? text.replace(edit.anchor, `${edit.insert.join('\n')}\n${edit.anchor}`)
    : text.replace(edit.anchor, `${edit.replace.join('\n')}\n`);
}
const header =
  '// forked from design-sync lib/dts.mjs - keep long literal/object unions and map polymorphic `as` to React.ElementType\n';
mkdirSync(dirname(TARGET), { recursive: true });
writeFileSync(TARGET, header + text);
console.error(`  patch-dts: wrote ${TARGET}`);
