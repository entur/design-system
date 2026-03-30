import * as path from 'path';
import { analyzeCssOverrides } from './cssOverrideAnalyzer';

const FIXTURES_DIR = path.join(__dirname, '..', '__fixtures__');

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
