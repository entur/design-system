import { useCallback, useSyncExternalStore } from 'react';
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

type Breakpoint = 's' | 'm' | 'lg' | 'xl';

const getCurrentBreakpoint = (breakpoints: {
  m: number;
  lg: number;
  xl: number;
}): Breakpoint => {
  const width = window.innerWidth;
  if (width >= breakpoints.xl) return 'xl';
  if (width >= breakpoints.lg) return 'lg';
  if (width >= breakpoints.m) return 'm';
  return 's';
};

const serverBreakpoint: Breakpoint = 's';

export const useResponsiveValue = <T>(
  value: ResponsiveValue<T> | undefined,
): T | undefined => {
  const { breakpoints } = useLayoutValues();

  const subscribe = useCallback(
    (callback: () => void) => {
      if (typeof window.matchMedia !== 'function') {
        return () => {};
      }
      const mediaQueries = [
        window.matchMedia(`(min-width: ${breakpoints.m}px)`),
        window.matchMedia(`(min-width: ${breakpoints.lg}px)`),
        window.matchMedia(`(min-width: ${breakpoints.xl}px)`),
      ];
      mediaQueries.forEach(mq => mq.addEventListener('change', callback));
      return () => {
        mediaQueries.forEach(mq => mq.removeEventListener('change', callback));
      };
    },
    [breakpoints],
  );

  const getSnapshot = useCallback(
    () =>
      typeof window.matchMedia === 'function'
        ? getCurrentBreakpoint(breakpoints)
        : serverBreakpoint,
    [breakpoints],
  );

  const getServerSnapshot = useCallback(() => serverBreakpoint, []);

  const currentBreakpoint = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

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

  const fallbackOrder: Array<Breakpoint> =
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
