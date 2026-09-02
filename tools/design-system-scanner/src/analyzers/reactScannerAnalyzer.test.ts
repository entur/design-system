import * as path from 'path';
import { analyzeComponents } from './reactScannerAnalyzer';

const FIXTURES_DIR = path.join(__dirname, '..', '__fixtures__');
const DEEP_IMPORT_APP = path.join(FIXTURES_DIR, 'deep-import-app');

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
});
