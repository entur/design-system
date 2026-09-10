'use strict';

/**
 * The documentation site renders these entries in the changelog modal with
 * markdown-to-jsx, mapping h3 to a section heading and li to an entry
 * (apps/documentation/src/components/PageHeader/MarkdownParser.tsx). These
 * tests hold that contract: the generated markdown has to parse into the shape
 * that component overrides, and its headings have to match the titles it gives
 * an icon.
 */

const fs = require('fs');
const path = require('path');
const { compiler } = require('markdown-to-jsx');

const {
  DEPENDENCY_HEADING,
  PEER_HEADING,
  renderDependencySections,
} = require('./index.js');

const MARKDOWN_PARSER = path.join(
  __dirname,
  '../../apps/documentation/src/components/PageHeader/MarkdownParser.tsx',
);

const sections = renderDependencySections(
  {
    dependencies: [
      { name: '@entur/tokens', from: '^4.1.1', to: '^4.1.2', version: '4.1.2' },
    ],
    peerDependencies: [
      {
        name: '@entur/icons',
        from: '>=10.0.0',
        to: '>=10.1.0',
        version: '10.1.0',
      },
    ],
  },
  { changelogUrl: () => 'https://example.com/CHANGELOG.md#412-2026-09-09' },
);

/** The element tree, reduced to the types the overrides key on. */
const describeNode = node => {
  if (node === null || node === undefined || node === false) return null;
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return node.map(describeNode);

  return { type: node.type, children: describeNode(node.props?.children) };
};

const parse = markdown =>
  describeNode(
    compiler(markdown, {
      wrapper: null,
      forceBlock: true,
      disableParsingRawHTML: true,
    }),
  );

describe('the documentation changelog parser', () => {
  it('parses the sections as headings and lists', () => {
    const nodes = parse(sections);

    expect(nodes.map(node => node.type)).toEqual(['h3', 'ul', 'h3', 'ul']);
    expect(nodes[0].children).toEqual(['Entur Dependency Updates']);
    expect(nodes[2].children).toEqual(['Entur Peer Requirements']);
    expect(nodes[1].children.map(node => node.type)).toEqual(['li']);
  });

  it('parses a bullet into the inline nodes the entry override expects', () => {
    const [, list] = parse(sections);
    const types = list.children[0].children
      .filter(child => typeof child !== 'string')
      .map(child => child.type);

    // No paragraph: the entry renders as a plain list item.
    expect(types).toEqual(['strong', 'code', 'code', 'a']);
  });

  it('uses the section titles the site gives an icon', () => {
    const source = fs.readFileSync(MARKDOWN_PARSER, 'utf8');

    for (const heading of [DEPENDENCY_HEADING, PEER_HEADING]) {
      expect(source).toContain(`'${heading.replace('### ', '')}':`);
    }
  });

  // Commit bodies name HTML elements. Parsed as markup they become real ones:
  // <details> renders an empty disclosure widget, and everything after a
  // <dialog> disappears into a closed dialog.
  it('leaves tag names in a commit body as text', () => {
    const authored = [
      '### Bug Fixes',
      '',
      '- **modal:** replace @reach/dialog with the native <dialog> element ([abc1234](https://example.com))',
      '',
      '  Content stays mounted, which matches native <details> behavior.',
    ].join('\n');

    const text = JSON.stringify(parse(authored));

    expect(text).toContain('<dialog>');
    expect(text).toContain('<details>');
    expect(text).not.toContain('"details"');
    expect(text).not.toContain('"dialog"');
  });

  it('is parsed with raw HTML off, the way the site parses it', () => {
    expect(fs.readFileSync(MARKDOWN_PARSER, 'utf8')).toContain(
      'disableParsingRawHTML: true',
    );
  });

  // An authored section parses into the same heading-and-list shape, so the
  // site can only tell the two apart by the heading text. These are the titles
  // it folds away; nothing a commit writes may collide with them.
  it('parses an authored entry under a title that is not collapsible', () => {
    const authored = [
      '### Bug Fixes',
      '',
      '- **chip:** keep the label from wrapping ([abc1234](https://example.com))',
      '',
      '  The label now truncates instead.',
    ].join('\n');

    const [heading] = parse(authored);

    expect(heading.children).toEqual(['Bug Fixes']);
    expect([DEPENDENCY_HEADING, PEER_HEADING]).not.toContain('### Bug Fixes');
  });
});
