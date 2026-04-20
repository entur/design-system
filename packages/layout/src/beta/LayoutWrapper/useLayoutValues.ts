import { DEFAULT_BREAKPOINTS } from './utils';
import { type LayoutValues, useLayoutContext } from './LayoutWrapper';

export const useLayoutValues = (): LayoutValues => {
  const context = useLayoutContext();

  if (context) {
    return context;
  }

  return {
    breakpoints: DEFAULT_BREAKPOINTS,
  };
};
