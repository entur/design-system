import * as path from 'path';
import { analyzeComponents } from './reactScannerAnalyzer';
import { buildEnumPropIndex } from '../catalog';
import type { DesignSystemCatalog } from '../types';

const FIXTURES_DIR = path.join(__dirname, '..', '__fixtures__');
const DEEP_IMPORT_APP = path.join(FIXTURES_DIR, 'deep-import-app');
const IMPORT_STYLE_APP = path.join(FIXTURES_DIR, 'import-style-app');
const STABLE_BETA_APP = path.join(FIXTURES_DIR, 'stable-beta-app');
const PROP_VALUES_APP = path.join(FIXTURES_DIR, 'prop-values-app');

const PROP_VALUES_CATALOG: DesignSystemCatalog = {
  packages: [
    {
      packageName: '@entur/button',
      latestVersion: null,
      symbols: [
        {
          symbolName: 'Button',
          symbolType: 'component',
          knownProps: ['variant', 'size', 'disabled', 'loading', 'width'],
          // title is listed to show the free-text guard wins over the catalog
          enumProps: [
            'variant',
            'size',
            'disabled',
            'loading',
            'width',
            'title',
          ],
        },
      ],
    },
    {
      packageName: '@entur/typography',
      deepImportPath: '/beta',
      latestVersion: null,
      symbols: [
        {
          symbolName: 'Text',
          symbolType: 'component',
          knownProps: ['variant', 'size'],
          enumProps: ['variant'],
        },
      ],
    },
  ],
};

describe('reactScannerAnalyzer', () => {
  describe('deep import paths', () => {
    it('reports a real subpath import', async () => {
      const { components } = await analyzeComponents(DEEP_IMPORT_APP);

      const sidebar = components.find(c => c.componentName === 'Sidebar');
      expect(sidebar).toBeDefined();
      // packageName is always the root package; the subpath lives only in
      // deepImportPath, so a breakdown by package does not split beta out
      expect(sidebar!.packageName).toBe('@entur/layout');
      expect(sidebar!.deepImportPath).toBe('/beta');
    });

    it('does not treat a longer package name as a subpath of a shorter one', async () => {
      // '@entur/table' shares a prefix with the '@entur/tab' entry in the package
      // list. Matching without a separator reported every table symbol as a deep
      // import of '@entur/tab' with subpath 'le'.
      const { components } = await analyzeComponents(DEEP_IMPORT_APP);

      const tableComponents = components.filter(
        c => c.packageName === '@entur/table',
      );
      expect(tableComponents.length).toBeGreaterThan(0);

      for (const component of tableComponents) {
        expect(component.deepImportPath).toBeUndefined();
      }
    });
  });
  describe('stable and beta entry points', () => {
    it('reports one row per entry point for a shared component name', async () => {
      const { components } = await analyzeComponents(STABLE_BETA_APP);

      const navs = components.filter(c => c.componentName === 'SideNavigation');
      expect(navs).toHaveLength(2);
      const stable = navs.find(c => c.deepImportPath === undefined);
      const beta = navs.find(c => c.deepImportPath === '/beta');
      expect(stable).toMatchObject({
        packageName: '@entur/menu',
        instanceCount: 1,
        files: ['LegacyNav.tsx'],
      });
      expect(beta).toMatchObject({
        packageName: '@entur/menu',
        instanceCount: 2,
        files: ['BetaNav.tsx'],
      });
    });

    it('splits an aliased beta import from the stable one in the same file', async () => {
      const { components } = await analyzeComponents(STABLE_BETA_APP);

      const links = components.filter(c => c.componentName === 'Link');
      expect(links).toHaveLength(2);
      const stable = links.find(c => c.deepImportPath === undefined);
      const beta = links.find(c => c.deepImportPath === '/beta');
      expect(stable).toMatchObject({ instanceCount: 1, isAliased: false });
      expect(beta).toMatchObject({
        instanceCount: 3,
        isAliased: true,
        aliasName: 'BetaLink',
      });
    });

    it('attributes each file finding to its own import', async () => {
      const { fileFindings } = await analyzeComponents(STABLE_BETA_APP, true);

      const navFindings = fileFindings.filter(
        f => f.symbolName === 'SideNavigation',
      );
      expect(
        navFindings
          .filter(f => f.filePath.endsWith('LegacyNav.tsx'))
          .map(f => f.findingType),
      ).toEqual(['jsx_usage']);
      expect(
        navFindings
          .filter(f => f.filePath.endsWith('BetaNav.tsx'))
          .map(f => f.findingType),
      ).toEqual(['deep_import', 'deep_import']);
    });
  });

  describe('prop values', () => {
    async function scanPropValues() {
      const { components } = await analyzeComponents(
        PROP_VALUES_APP,
        false,
        buildEnumPropIndex(PROP_VALUES_CATALOG),
      );
      return components;
    }

    it('counts literal values of enum-like props', async () => {
      const button = (await scanPropValues()).find(
        c => c.componentName === 'Button',
      );

      expect(button!.propValues).toEqual({
        variant: { primary: 2, secondary: 1 },
        size: { medium: 1, small: 1 },
        disabled: { true: 1 },
        loading: { false: 1 },
      });
      // Prop names are still counted for every prop, values or not
      expect(button!.props.variant).toBe(4);
      expect(button!.props['aria-label']).toBe(1);
    });

    it('matches the catalog entry point of the component', async () => {
      const text = (await scanPropValues()).find(
        c => c.componentName === 'Text',
      );
      expect(text!.propValues).toEqual({ variant: { paragraph: 1 } });
    });

    it('records nothing without a catalog', async () => {
      const { components } = await analyzeComponents(PROP_VALUES_APP);
      for (const component of components) {
        expect(component.propValues).toBeUndefined();
      }
    });
  });

  describe('component names', () => {
    it('keeps the sub-component of an aliased import', async () => {
      // react-scanner already resolves `Expandable as Exp` back to the export,
      // so the key is Expandable.Header. Replacing it with the imported name
      // would fold every sub-component of the alias into the parent, and make
      // them share one distinct id in the export.
      const { components } = await analyzeComponents(IMPORT_STYLE_APP);

      const names = components.map(c => c.componentName);
      expect(names).toContain('Expandable.Header');
      expect(names).not.toContain('Exp.Header');
    });

    it('reports the export name behind a named alias', async () => {
      const { components } = await analyzeComponents(IMPORT_STYLE_APP);

      const heading = components.find(c => c.componentName === 'Heading');
      expect(heading).toBeDefined();
      expect(heading!.isAliased).toBe(true);
      expect(heading!.aliasName).toBe('H');
    });

    it('drops the local binding from a namespace import', async () => {
      // A namespace import has no export name for react-scanner to resolve, so
      // it keys the JSX expression: `Typo.Heading1`. Left alone, the rollup
      // cannot tell which typography generation the component belongs to.
      const { components } = await analyzeComponents(IMPORT_STYLE_APP);

      const names = components.map(c => c.componentName);
      expect(names).toContain('Heading1');
      expect(names).toContain('Paragraph');
      expect(names).not.toContain('Typo.Heading1');
    });
  });
});
