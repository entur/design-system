import React from 'react';
import {
  getHeadingVariantFromSemanticType,
  getSpacingClasses,
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

  describe('getSpacingClasses', () => {
    test('returns correct spacing classes for different values', () => {
      const lgResult = getSpacingClasses('lg', 'eds-heading');
      expect(lgResult).toBe('eds-heading--spacing-lg');

      const mdTopResult = getSpacingClasses('md-top', 'eds-text');
      expect(mdTopResult).toBe('eds-text--spacing-md-top');
    });

    test('returns empty string when spacing is not provided', () => {
      expect(getSpacingClasses(undefined, 'eds-heading')).toBe('');
    });

    test('handles all spacing variants', () => {
      const spacingVariants = [
        'none',
        'xs2',
        'xs2-top',
        'xs2-bottom',
        'xs',
        'xs-top',
        'xs-bottom',
        'sm',
        'sm-top',
        'sm-bottom',
        'md',
        'md-top',
        'md-bottom',
        'lg',
        'lg-top',
        'lg-bottom',
        'xl',
        'xl-top',
        'xl-bottom',
      ];

      spacingVariants.forEach(spacing => {
        const result = getSpacingClasses(spacing as any, 'eds-test');
        expect(result).toBe(`eds-test--spacing-${spacing}`);
      });
    });
  });
});
