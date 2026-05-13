import React, { createContext, useContext, useMemo } from 'react';
import { type Breakpoints, DEFAULT_BREAKPOINTS } from './utils';

export type LayoutValues = {
  breakpoints: Breakpoints;
};

const LayoutContext = createContext<LayoutValues | null>(null);

export type LayoutProviderProps = {
  /**
   * Custom breakpoint values (in px) to override the defaults.
   *
   * Breakpoints are **min-width** based: a breakpoint activates when the
   * viewport is at least that wide and stays active until the next breakpoint.
   *
   * Default values:
   * - `s`: 0px — always active below `m` (not configurable)
   * - `m`: 800px — active from 800px up to (but not including) `lg`
   * - `lg`: 1200px — active from 1200px up to (but not including) `xl`
   * - `xl`: 1400px — active from 1400px and above
   *
   * @example
   * <LayoutProvider breakpoints={{ m: 600, lg: 1024, xl: 1280 }}>
   *   ...
   * </LayoutProvider>
   */
  breakpoints?: Partial<Breakpoints>;
  children: React.ReactNode;
};

export const LayoutProvider = ({
  breakpoints: customBreakpoints,
  children,
}: LayoutProviderProps): JSX.Element => {
  const breakpoints = useMemo<Breakpoints>(
    () => ({
      ...DEFAULT_BREAKPOINTS,
      ...customBreakpoints,
    }),
    [customBreakpoints],
  );

  const layoutValues = useMemo<LayoutValues>(
    () => ({
      breakpoints,
    }),
    [breakpoints],
  );

  return (
    <LayoutContext.Provider value={layoutValues}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayoutContext = (): LayoutValues | null => {
  return useContext(LayoutContext);
};
