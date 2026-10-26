/**
 * @jest-environment node
 */
import fs from 'fs';
import path from 'path';
import { compile } from 'sass';
import { SPACING_STEPS } from '../utils/utils';

// The rules that matter are in the CSS, which jsdom can't lay out. These tests check that the
// stylesheets agree with each other, so a new variant, size or spacing step can't be forgotten.

const components = path.resolve(__dirname, '../components');
const read = (file: string) =>
  fs.readFileSync(path.join(components, file), 'utf8');

// Modifier classes defined directly on .eds-text or .eds-heading, such as &--paragraph
const modifiers = (scss: string) =>
  Array.from(scss.matchAll(/^ {4}&--([a-z0-9-]+)/gm), match => match[1]);

const textContainerCss = compile(
  path.join(components, 'text-container.scss'),
).css;

// The element before `+ *` in each rule that sets the space after an element
const afterSubjects = Array.from(
  textContainerCss.matchAll(/([^{}]+)\{\s*--eds-text-container-after:/g),
)
  .flatMap(match => match[1].split(/,\s*\n/))
  .map(selector => selector.trim())
  .filter(selector => selector.endsWith('+ *'))
  .map(selector => selector.slice(0, -'+ *'.length));

const hasSpaceAfter = (className: string) =>
  afterSubjects.some(
    subject =>
      subject.includes(`.${className})`) || subject.includes(`.${className},`),
  );

describe('TextContainer rhythm', () => {
  test('every heading variant and size has a space after', () => {
    const missing = modifiers(read('heading.scss'))
      .filter(name => name !== 'tone-subdued')
      .filter(name => !hasSpaceAfter(`eds-heading--${name}`));
    expect(missing).toEqual([]);
  });

  test('every block-level text variant and size has a space after', () => {
    // Inline text, list parts and modifiers that don't change the size follow the text around them
    const notBlocks = new Set([
      'code',
      'emphasized',
      'inherit',
      'link',
      'list-item',
      'steps',
      'tone-subdued',
      'weight-bold',
      'weight-medium',
    ]);
    const missing = modifiers(read('text.scss'))
      .filter(
        name =>
          !notBlocks.has(name) && !name.startsWith('numbered-list--type-'),
      )
      .filter(name => !hasSpaceAfter(`eds-text--${name}`));
    expect(missing).toEqual([]);
  });
});

describe('hyphens', () => {
  test('TextContainer hyphenates only raw text, so UI text variants keep their words whole', () => {
    const selectors = Array.from(
      textContainerCss.matchAll(/([^{}]+)\{\s*hyphens: auto;/g),
      match => match[1].trim(),
    );
    expect(selectors.length).toBeGreaterThan(0);
    selectors.forEach(selector =>
      expect(selector).toContain(':not(.eds-text)'),
    );
  });
});

describe('tone', () => {
  test.each(['text', 'heading'])(
    'the %s tone comes after every variant and size, so it wins',
    block => {
      const scss = read(`${block}.scss`);
      const tone = scss.indexOf(`.eds-${block}--tone-subdued {`);
      expect(tone).toBeGreaterThan(-1);
      expect(tone).toBeGreaterThan(scss.lastIndexOf('    &--'));
      expect(scss.slice(tone)).toContain('-contrast-text-subdued');
    },
  );
});

describe('spacing scale', () => {
  test('has the same steps as the spacing tokens', () => {
    const tokens = fs.readFileSync(
      path.resolve(__dirname, '../../../../tokens/dist/spacing.css'),
      'utf8',
    );
    const steps = new Set(
      Array.from(tokens.matchAll(/--spacing-([a-z0-9]+):/g), match => match[1]),
    );
    expect(
      Array.from(SPACING_STEPS)
        .filter(step => step !== 'none')
        .sort(),
    ).toEqual(Array.from(steps).sort());
  });
});
