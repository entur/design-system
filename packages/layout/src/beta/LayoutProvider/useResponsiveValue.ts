import { useEffect, useState } from 'react';
import { useLayoutValues } from './useLayoutValues';
import type { ResponsiveValue } from './utils';

const isResponsiveObject = <T>(
  value: ResponsiveValue<T>,
): value is { s?: T; m?: T; lg?: T; xl?: T } => {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    ('s' in value || 'm' in value || 'lg' in value || 'xl' in value)
  );
};

const getCurrentBreakpoint = (
  breakpoints: { m: number; lg: number; xl: number },
  windowWidth: number,
): 's' | 'm' | 'lg' | 'xl' => {
  if (windowWidth >= breakpoints.xl) {
    return 'xl';
  }
  if (windowWidth >= breakpoints.lg) {
    return 'lg';
  }
  if (windowWidth >= breakpoints.m) {
    return 'm';
  }
  return 's';
};

export const useResponsiveValue = <T>(
  value: ResponsiveValue<T> | undefined,
): T | undefined => {
  const { breakpoints } = useLayoutValues();
  const [currentBreakpoint, setCurrentBreakpoint] = useState<
    's' | 'm' | 'lg' | 'xl'
  >(() => {
    if (typeof window === 'undefined') {
      return 's';
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
      window.matchMedia(`(min-width: ${breakpoints.m}px)`),
      window.matchMedia(`(min-width: ${breakpoints.lg}px)`),
      window.matchMedia(`(min-width: ${breakpoints.xl}px)`),
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

  const fallbackOrder: Array<'xl' | 'lg' | 'm' | 's'> =
    currentBreakpoint === 'xl'
      ? ['xl', 'lg', 'm', 's']
      : currentBreakpoint === 'lg'
      ? ['lg', 'm', 's']
      : currentBreakpoint === 'm'
      ? ['m', 's']
      : ['s'];

  for (const bp of fallbackOrder) {
    if (value[bp] !== undefined) {
      return value[bp];
    }
  }

  return undefined;
};
