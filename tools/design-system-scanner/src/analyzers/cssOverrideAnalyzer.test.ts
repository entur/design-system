import * as path from 'path';
import { analyzeCssOverrides } from './cssOverrideAnalyzer';
import { loadStyleCatalog } from './styleCatalog';

const FIXTURES_DIR = path.join(__dirname, '..', '__fixtures__');
const TYPOGRAPHY_BETA_APP = path.join(FIXTURES_DIR, 'typography-beta-app');

describe('cssOverrideAnalyzer', () => {
  it('detects .eds-* selectors in SCSS files', () => {
    const repoDir = path.join(FIXTURES_DIR, 'css-override-app');
    const { findings } = analyzeCssOverrides(repoDir);

    const scssFindings = findings.filter(f => f.fileExtension === '.scss');
    expect(scssFindings.length).toBeGreaterThanOrEqual(2);

    const selectors = scssFindings.map(f => f.selector);
    expect(selectors).toContain('.eds-primary-button');
    expect(selectors).toContain('.eds-table__header');
  });

  it('detects .eds-* selectors in .module.css files', () => {
    const repoDir = path.join(FIXTURES_DIR, 'css-override-app');
    const { findings } = analyzeCssOverrides(repoDir);

    const cssFindings = findings.filter(f => f.fileExtension === '.css');
    expect(cssFindings.length).toBeGreaterThanOrEqual(1);
    expect(cssFindings[0].selector).toBe('.eds-dropdown__menu');
  });

  it('records file path relative to repo root', () => {
    const repoDir = path.join(FIXTURES_DIR, 'css-override-app');
    const { findings } = analyzeCssOverrides(repoDir);

    const scssFindings = findings.filter(f => f.fileExtension === '.scss');
    expect(scssFindings[0].filePath).toBe('src/overrides.scss');
  });

  it('records correct line numbers', () => {
    const repoDir = path.join(FIXTURES_DIR, 'css-override-app');
    const { findings } = analyzeCssOverrides(repoDir);

    const primaryButton = findings.find(
      f => f.selector === '.eds-primary-button',
    );
    expect(primaryButton).toBeDefined();
    expect(primaryButton!.lineNumber).toBe(2);
  });

  it('does not match non-.eds-* classes', () => {
    const repoDir = path.join(FIXTURES_DIR, 'css-override-app');
    const { findings } = analyzeCssOverrides(repoDir);

    const customClass = findings.find(f => f.selector === '.my-custom-class');
    expect(customClass).toBeUndefined();
  });

  it('returns empty findings for a repo with no style files', () => {
    const repoDir = path.join(FIXTURES_DIR, 'simple-app');
    const { findings } = analyzeCssOverrides(repoDir);
    expect(findings).toEqual([]);
  });
});

describe('cssOverrideAnalyzer classification', () => {
  const catalog = loadStyleCatalog();

  it('attributes typography classes to typography and tags the generation', () => {
    if (!catalog) return;
    const { findings } = analyzeCssOverrides(TYPOGRAPHY_BETA_APP, catalog);

    const beta = findings.find(f => f.selector === '.eds-heading--section-1')!;
    expect(beta.packageName).toBe('@entur/typography');
    expect(beta.baseClass).toBe('eds-heading');
    expect(beta.classGeneration).toBe('beta');

    const legacy = findings.find(f => f.selector === '.eds-paragraph')!;
    expect(legacy.packageName).toBe('@entur/typography');
    expect(legacy.classGeneration).toBe('legacy');
  });

  it('does not attribute a form class to typography', () => {
    // .eds-textfield__wrapper shares the "eds-text" prefix; a prefix match
    // would have counted it as a typography override
    if (!catalog) return;
    const { findings } = analyzeCssOverrides(TYPOGRAPHY_BETA_APP, catalog);

    const textfield = findings.find(
      f => f.selector === '.eds-textfield__wrapper',
    )!;
    expect(textfield.packageName).toBe('@entur/form');
  });

  it('finds overrides inside CSS-in-JS template literals', () => {
    if (!catalog) return;
    const { findings } = analyzeCssOverrides(TYPOGRAPHY_BETA_APP, catalog);

    const cssInJs = findings.filter(f => f.source === 'css-in-js');
    expect(cssInJs.map(f => f.selector)).toEqual(
      expect.arrayContaining(['.eds-text--paragraph', '.eds-heading']),
    );
    expect(cssInJs[0].filePath).toBe(path.join('src', 'Styled.tsx'));
  });

  it('finds hand-written internal class names in className attributes', () => {
    if (!catalog) return;
    const { findings } = analyzeCssOverrides(TYPOGRAPHY_BETA_APP, catalog);

    const inMarkup = findings.filter(f => f.source === 'jsx-classname');
    expect(inMarkup.map(f => f.selector)).toContain('.eds-h2');
    // The neighbouring non-eds class in the same attribute is not a finding
    expect(inMarkup.map(f => f.selector)).not.toContain('.custom-heading');
  });

  it('reports how many stylesheets it inspected', () => {
    const { styleFilesScanned } = analyzeCssOverrides(TYPOGRAPHY_BETA_APP);
    expect(styleFilesScanned).toBe(1);
  });

  it('leaves classifications unknown when no catalogue is available', () => {
    const { findings } = analyzeCssOverrides(TYPOGRAPHY_BETA_APP, null);
    expect(findings.length).toBeGreaterThan(0);
    for (const finding of findings) {
      expect(finding.packageName).toBeNull();
      expect(finding.classGeneration).toBe('unknown');
    }
  });
});
