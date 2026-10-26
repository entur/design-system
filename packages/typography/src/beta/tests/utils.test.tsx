import {
  getHeadingVariantFromSemanticType,
  getSpacingStyle,
} from '../utils/utils';

describe('Utility Functions', () => {
  describe('getHeadingVariantFromSemanticType', () => {
    test('returns correct variant for h1', () => {
      expect(getHeadingVariantFromSemanticType('h1')).toBe('title-1');
    });

    test('returns correct variant for h2', () => {
      expect(getHeadingVariantFromSemanticType('h2')).toBe('title-2');
    });

    test('returns correct variant for h3', () => {
      expect(getHeadingVariantFromSemanticType('h3')).toBe('subtitle-1');
    });

    test('returns correct variant for h4', () => {
      expect(getHeadingVariantFromSemanticType('h4')).toBe('subtitle-2');
    });

    test('returns default variant for unknown semantic type', () => {
      expect(getHeadingVariantFromSemanticType('div')).toBe('title-1');
    });

    test('returns default variant for non-string input', () => {
      // Test with an actual React component (non-string)
      const MockComponent = () => <div>Mock</div>;
      expect(getHeadingVariantFromSemanticType(MockComponent)).toBe('title-1');
    });
  });

  describe('getSpacingStyle', () => {
    test('sets top and bottom from a single value', () => {
      expect(getSpacingStyle('lg')).toEqual({
        '--eds-text-spacing-top': 'var(--spacing-lg)',
        '--eds-text-spacing-bottom': 'var(--spacing-lg)',
      });
    });

    test('sets top and bottom separately', () => {
      expect(getSpacingStyle({ top: 's', bottom: '2xl' })).toEqual({
        '--eds-text-spacing-top': 'var(--spacing-s)',
        '--eds-text-spacing-bottom': 'var(--spacing-2xl)',
      });
      expect(getSpacingStyle({ bottom: 'none' })).toEqual({
        '--eds-text-spacing-bottom': '0px',
      });
    });

    test('keeps the style prop, which wins', () => {
      expect(
        getSpacingStyle('m', {
          color: 'red',
          '--eds-text-spacing-top': '1px',
        } as React.CSSProperties),
      ).toEqual({
        '--eds-text-spacing-top': '1px',
        '--eds-text-spacing-bottom': 'var(--spacing-m)',
        color: 'red',
      });
      const style = { color: 'red' };
      expect(getSpacingStyle(undefined, style)).toBe(style);
    });

    test('ignores values from the old scale and warns once', () => {
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
      expect(getSpacingStyle('md-bottom' as any)).toEqual({});
      getSpacingStyle('md-bottom' as any);
      expect(
        warn.mock.calls.filter(([msg]) => String(msg).includes('"md-bottom"')),
      ).toHaveLength(1);
      warn.mockRestore();
    });
  });
});
