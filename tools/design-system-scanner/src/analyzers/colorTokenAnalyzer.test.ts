import * as path from 'path';
import { analyzeColorTokens } from './colorTokenAnalyzer';
import { loadStyleCatalog } from './styleCatalog';

const FIXTURES_DIR = path.join(__dirname, '..', '__fixtures__');
const COLOR_TOKEN_APP = path.join(FIXTURES_DIR, 'color-token-app');
const NO_DS_APP = path.join(FIXTURES_DIR, 'no-ds-app');

describe('colorTokenAnalyzer', () => {
  const catalog = loadStyleCatalog();

  const analyze = (repoDir: string) => analyzeColorTokens(repoDir, catalog);

  it('detects new-generation tokens read as CSS custom properties', () => {
    if (!catalog) return;
    const { tokens } = analyze(COLOR_TOKEN_APP);

    const semantic = tokens.find(
      t => t.tokenName === 'fill-background-tint-light',
    )!;
    expect(semantic).toBeDefined();
    expect(semantic.tokenLayer).toBe('semantic');
    expect(semantic.tokenGeneration).toBe('new');
    // Once in the stylesheet and once in an inline style
    expect(semantic.sources).toEqual(
      expect.arrayContaining(['stylesheet', 'inline-style']),
    );

    const base = tokens.find(
      t => t.tokenName === 'basecolors-stroke-focus-standard',
    )!;
    expect(base.tokenLayer).toBe('base');
  });

  it('detects legacy tokens read as SCSS variables', () => {
    if (!catalog) return;
    const { tokens } = analyze(COLOR_TOKEN_APP);

    const legacy = tokens.find(t => t.tokenName === 'colors-blues-blue50')!;
    expect(legacy).toBeDefined();
    expect(legacy.tokenGeneration).toBe('legacy');
    expect(legacy.sources).toEqual(
      expect.arrayContaining(['stylesheet', 'js-token-object']),
    );
  });

  it('resolves which colour a token object member access refers to', () => {
    // Previously importing `colors` only registered as N references to the
    // symbol, with no idea which colours were used
    if (!catalog) return;
    const { tokens } = analyze(COLOR_TOKEN_APP);

    const coral = tokens.find(t => t.tokenName === 'colors-brand-coral')!;
    expect(coral).toBeDefined();
    expect(coral.sources).toContain('js-token-object');
    expect(coral.occurrenceCount).toBe(1);

    // colors.blues.blue50 is read twice in tokens.ts
    const blue = tokens.find(t => t.tokenName === 'colors-blues-blue50')!;
    expect(blue.occurrenceCount).toBeGreaterThanOrEqual(3);
  });

  it('ignores local preprocessor variables that are not tokens', () => {
    if (!catalog) return;
    const { tokens } = analyze(COLOR_TOKEN_APP);
    expect(tokens.map(t => t.tokenName)).not.toContain('local-spacing');
  });

  it('flags a hardcoded colour that already exists as a token', () => {
    if (!catalog) return;
    const { hardcoded } = analyze(COLOR_TOKEN_APP);

    const known = hardcoded.find(c => c.value === '#181c56')!;
    expect(known).toBeDefined();
    expect(known.colorFormat).toBe('hex');
    expect(known.matchesTokenName).toBeDefined();
    expect(known.matchesTokenLayer).toBe('base');
  });

  it('records a hardcoded colour with no token equivalent', () => {
    if (!catalog) return;
    const { hardcoded } = analyze(COLOR_TOKEN_APP);

    const unknown = hardcoded.find(c => c.value === '#abcdef')!;
    expect(unknown).toBeDefined();
    expect(unknown.matchesTokenName).toBeUndefined();
  });

  it('normalises functional notation to the same value as hex', () => {
    if (!catalog) return;
    const { hardcoded } = analyze(COLOR_TOKEN_APP);

    // rgb(255, 89, 89) is the coral brand colour
    const coral = hardcoded.find(c => c.value === '#ff5959')!;
    expect(coral).toBeDefined();
    expect(coral.colorFormat).toBe('rgb');
    expect(coral.matchesTokenName).toBeDefined();
  });

  it('detects a named colour used as a whole declaration value', () => {
    if (!catalog) return;
    const { hardcoded } = analyze(COLOR_TOKEN_APP);

    // Named colours are normalised to hex so the same colour written two ways
    // is one row, and so it can be matched against a token value
    const named = hardcoded.filter(c => c.colorFormat === 'named');
    expect(named.map(c => c.value)).toEqual(
      expect.arrayContaining(['#ff0000', '#ffffff']),
    );

    const white = hardcoded.find(c => c.value === '#ffffff')!;
    expect(white.matchesTokenName).toBeDefined();
  });

  it('aggregates per token rather than per occurrence', () => {
    if (!catalog) return;
    const { tokens, hardcoded } = analyze(COLOR_TOKEN_APP);

    expect(new Set(tokens.map(t => t.tokenName)).size).toBe(tokens.length);
    expect(new Set(hardcoded.map(c => c.value)).size).toBe(hardcoded.length);
  });

  it('counts the files it inspected', () => {
    if (!catalog) return;
    const result = analyze(COLOR_TOKEN_APP);
    expect(result.styleFilesScanned).toBe(1);
    expect(result.sourceFilesScanned).toBe(2);
  });

  it('still runs for a repo with no design system dependency', () => {
    if (!catalog) return;
    const result = analyze(NO_DS_APP);
    expect(result.tokens).toEqual([]);
    expect(result.sourceFilesScanned).toBeGreaterThan(0);
  });

  it('returns nothing when no catalogue is available', () => {
    const result = analyzeColorTokens(COLOR_TOKEN_APP, null);
    expect(result.tokens).toEqual([]);
    expect(result.hardcoded).toEqual([]);
    expect(result.styleFilesScanned).toBe(0);
  });
});
