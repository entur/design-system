import {
  extractDeclaredClassNames,
  figmaNameToTokenName,
  indexStyleCatalog,
  legacyPathToTokenName,
  loadStyleCatalog,
  normalizeColor,
  toBaseClass,
} from './styleCatalog';
import type { StyleCatalog } from '../types';

describe('extractDeclaredClassNames', () => {
  it('treats the leading compound of a selector as declared', () => {
    const declared = extractDeclaredClassNames(`
      .eds-paragraph {
        margin: 0;
      }
    `);
    expect(declared).toContain('eds-paragraph');
  });

  it('resolves nested & modifiers into full class names', () => {
    const declared = extractDeclaredClassNames(`
      .eds-text {
        color: black;

        &--paragraph {
          font-size: 1rem;
        }

        &--weight-bold {
          font-weight: 700;
        }
      }
    `);
    expect(declared).toEqual(
      expect.arrayContaining([
        'eds-text',
        'eds-text--paragraph',
        'eds-text--weight-bold',
      ]),
    );
  });

  it('sees through at-rule wrappers such as @layer', () => {
    // The beta styles wrap everything in @layer components.primitives, so an
    // at-rule must not count as a level of selector nesting
    const declared = extractDeclaredClassNames(`
      @layer components.primitives {
        .eds-heading {
          margin: 0;

          &--xl {
            font-size: 2rem;
          }
        }
      }
    `);
    expect(declared).toEqual(
      expect.arrayContaining(['eds-heading', 'eds-heading--xl']),
    );
  });

  it('does not claim a class it only references from a descendant selector', () => {
    // @entur/layout styles typography inside its own components; that must not
    // make it the owner of typography's class names
    const declared = extractDeclaredClassNames(`
      .eds-navigation-card {
        .eds-paragraph {
          margin-bottom: 0;
        }
      }
    `);
    expect(declared).toContain('eds-navigation-card');
    expect(declared).not.toContain('eds-paragraph');
  });

  it('does not claim a class referenced inside :where()', () => {
    const declared = extractDeclaredClassNames(`
      .eds-heading {
        :where(.eds-contrast) & {
          color: white;
        }
      }
    `);
    expect(declared).toContain('eds-heading');
    expect(declared).not.toContain('eds-contrast');
  });

  it('ignores commented-out selectors', () => {
    const declared = extractDeclaredClassNames(`
      /* .eds-commented-out { color: red; } */
      .eds-real {
        color: blue;
      }
    `);
    expect(declared).toContain('eds-real');
    expect(declared).not.toContain('eds-commented-out');
  });
});

describe('toBaseClass', () => {
  it('strips the modifier suffix', () => {
    expect(toBaseClass('eds-text--paragraph')).toBe('eds-text');
    expect(toBaseClass('eds-text--numbered-list--type-a')).toBe('eds-text');
  });

  it('leaves an element suffix alone', () => {
    expect(toBaseClass('eds-textfield__wrapper')).toBe(
      'eds-textfield__wrapper',
    );
  });
});

describe('figmaNameToTokenName', () => {
  it('kebab-cases a Figma variable path', () => {
    expect(figmaNameToTokenName('Fill/Background/Tint/Light')).toBe(
      'fill-background-tint-light',
    );
    expect(figmaNameToTokenName('Blue/10')).toBe('blue-10');
    expect(figmaNameToTokenName('White Alpha/100')).toBe('whitealpha-100');
  });
});

describe('legacyPathToTokenName', () => {
  it('matches the legacy token stylesheet naming', () => {
    expect(legacyPathToTokenName('colors.blues.blue50')).toBe(
      'colors-blues-blue50',
    );
    expect(legacyPathToTokenName('colors.brand.blue')).toBe(
      'colors-brand-blue',
    );
    expect(legacyPathToTokenName('colors.validation.skyContrast')).toBe(
      'colors-validation-sky-contrast',
    );
    expect(legacyPathToTokenName('colors.transport.default.bus')).toBe(
      'colors-transport-default-bus',
    );
  });
});

describe('normalizeColor', () => {
  it('expands short hex forms', () => {
    expect(normalizeColor('#ABC')).toBe('#aabbcc');
    expect(normalizeColor('#abcd')).toBe('#aabbccdd');
  });

  it('keeps long hex forms, lowercased', () => {
    expect(normalizeColor('#181C56')).toBe('#181c56');
    expect(normalizeColor('#181c5680')).toBe('#181c5680');
  });

  it('converts rgb and rgba to hex', () => {
    expect(normalizeColor('rgb(24, 28, 86)')).toBe('#181c56');
    expect(normalizeColor('rgba(24, 28, 86, 0.5)')).toBe('#181c56');
  });

  it('returns null for values it cannot convert', () => {
    expect(normalizeColor('#ab')).toBeNull();
    expect(normalizeColor('hsl(210, 50%, 20%)')).toBeNull();
    expect(normalizeColor('transparent')).toBeNull();
  });
});

describe('indexStyleCatalog', () => {
  const catalog: StyleCatalog = {
    classNames: [
      {
        className: 'eds-text',
        baseClass: 'eds-text',
        packageName: '@entur/typography',
        generation: 'beta',
      },
      {
        className: 'eds-h2',
        baseClass: 'eds-h2',
        packageName: '@entur/typography',
        generation: 'legacy',
      },
      {
        className: 'eds-textfield__wrapper',
        baseClass: 'eds-textfield__wrapper',
        packageName: '@entur/form',
        generation: 'legacy',
      },
    ],
    colorTokens: [
      { name: 'blue-10', layer: 'primitive', value: '#f6f6f9' },
      {
        name: 'fill-background-tint-light',
        layer: 'semantic',
        value: '#f6f6f9',
      },
      { name: 'colors-blues-blue50', layer: 'legacy', value: '#8285a8' },
    ],
  };
  const index = indexStyleCatalog(catalog);

  it('classifies a modifier class via its base class', () => {
    expect(index.classifyClass('eds-text--paragraph')).toEqual({
      packageName: '@entur/typography',
      baseClass: 'eds-text',
      generation: 'beta',
    });
  });

  it('does not classify a longer class as a hit on a shorter one', () => {
    // A prefix match would report .eds-textfield__wrapper as typography's
    // .eds-text, which is exactly the mistake this lookup exists to avoid
    expect(index.classifyClass('eds-textfield__wrapper').packageName).toBe(
      '@entur/form',
    );
  });

  it('returns an unknown classification for a class it does not know', () => {
    expect(index.classifyClass('eds-not-a-real-class')).toEqual({
      packageName: null,
      baseClass: null,
      generation: 'unknown',
    });
  });

  it('looks up tokens by name', () => {
    expect(index.lookupToken('colors-blues-blue50')?.layer).toBe('legacy');
    expect(index.lookupToken('not-a-token')).toBeUndefined();
  });

  it('prefers the semantic layer when matching a colour value', () => {
    // Both blue-10 and fill-background-tint-light resolve to #f6f6f9; the
    // semantic name is the more useful suggestion for a consumer
    expect(index.findTokenByValue('#F6F6F9')?.name).toBe(
      'fill-background-tint-light',
    );
  });

  it('matches a colour value written in another notation', () => {
    expect(index.findTokenByValue('rgb(130, 133, 168)')?.name).toBe(
      'colors-blues-blue50',
    );
  });
});

describe('loadStyleCatalog', () => {
  // Reads the monorepo this scanner lives in, so it is skipped when the
  // scanner is checked out on its own
  const index = loadStyleCatalog();

  it('finds the design system packages', () => {
    expect(index).not.toBeNull();
  });

  it('separates the two generations of typography class names', () => {
    if (!index) return;
    const typography = index.catalog.classNames.filter(
      c => c.packageName === '@entur/typography',
    );
    const beta = typography.filter(c => c.generation === 'beta');
    const legacy = typography.filter(c => c.generation === 'legacy');

    expect(beta.map(c => c.className)).toEqual(
      expect.arrayContaining([
        'eds-heading',
        'eds-text',
        'eds-text--paragraph',
      ]),
    );
    expect(legacy.map(c => c.className)).toEqual(
      expect.arrayContaining(['eds-h1', 'eds-paragraph', 'eds-lead-paragraph']),
    );
  });

  it('covers every colour token layer', () => {
    if (!index) return;
    const layers = new Set(index.catalog.colorTokens.map(t => t.layer));
    for (const layer of [
      'primitive',
      'semantic',
      'base',
      'data',
      'transport',
      'component',
      'legacy',
    ]) {
      expect([...layers]).toContain(layer);
    }
  });

  it('attributes a form class to form, not to typography', () => {
    if (!index) return;
    expect(index.classifyClass('eds-textfield__wrapper').packageName).toBe(
      '@entur/form',
    );
  });
});
