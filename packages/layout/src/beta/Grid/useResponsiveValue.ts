import { useEffect, useState } from 'react';
import { useLayoutValues } from './useLayoutValues';
import type { ResponsiveValue } from './utils';

const isResponsiveObject = <T>(
  value: ResponsiveValue<T>,
): value is { sm?: T; md?: T; lg?: T } => {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    ('sm' in value || 'md' in value || 'lg' in value)
  );
};

const getCurrentBreakpoint = (
  breakpoints: { sm: number; md: number; lg: number },
  windowWidth: number,
): 'sm' | 'md' | 'lg' => {
  if (windowWidth >= breakpoints.lg) {
    return 'lg';
  }
  if (windowWidth >= breakpoints.md) {
    return 'md';
  }
  return 'sm';
};

export const useResponsiveValue = <T>(
  value: ResponsiveValue<T> | undefined,
): T | undefined => {
  const { breakpoints } = useLayoutValues();
  const [currentBreakpoint, setCurrentBreakpoint] = useState<
    'sm' | 'md' | 'lg'
  >(() => {
    if (typeof window === 'undefined') {
      return 'sm';
    }
    return getCurrentBreakpoint(breakpoints, window.innerWidth);
  });

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      typeof window.matchMedia !== 'function'
    ) {
      return;
    }

    const updateBreakpoint = () => {
      setCurrentBreakpoint(
        getCurrentBreakpoint(breakpoints, window.innerWidth),
      );
    };

    const mediaQueries = [
      window.matchMedia(`(min-width: ${breakpoints.md}px)`),
      window.matchMedia(`(min-width: ${breakpoints.lg}px)`),
    ];

    updateBreakpoint();

    const handleChange = () => {
      updateBreakpoint();
    };

    mediaQueries.forEach(mq => {
      if (mq.addEventListener) {
        mq.addEventListener('change', handleChange);
      } else {
        mq.addListener(handleChange);
      }
    });

    return () => {
      mediaQueries.forEach(mq => {
        if (mq.removeEventListener) {
          mq.removeEventListener('change', handleChange);
        } else {
          mq.removeListener(handleChange);
        }
      });
    };
  }, [breakpoints]);

  if (!value) {
    return undefined;
  }

  if (!isResponsiveObject(value)) {
    return value;
  }

  const responsiveValue = value[currentBreakpoint];
  if (responsiveValue !== undefined) {
    return responsiveValue;
  }

  const fallbackOrder: Array<'lg' | 'md' | 'sm'> =
    currentBreakpoint === 'lg'
      ? ['lg', 'md', 'sm']
      : currentBreakpoint === 'md'
      ? ['md', 'sm']
      : ['sm'];

  for (const bp of fallbackOrder) {
    if (value[bp] !== undefined) {
      return value[bp];
    }
  }

  return undefined;
};
