import React, { createContext, useContext, useMemo } from 'react';
import { DEFAULT_BREAKPOINTS, type Breakpoints } from './utils';

export type LayoutValues = {
  breakpoints: Breakpoints;
};

const LayoutContext = createContext<LayoutValues | null>(null);

export type LayoutWrapperProps = {
  /** Custom breakpoint values to override defaults */
  breakpoints?: Partial<Breakpoints>;
  /** Children components that can use layout values */
  children: React.ReactNode;
};

export const LayoutWrapper = ({
  breakpoints: customBreakpoints,
  children,
}: LayoutWrapperProps): JSX.Element => {
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
