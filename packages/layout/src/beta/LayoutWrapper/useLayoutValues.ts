import { DEFAULT_BREAKPOINTS } from './utils';
import { useLayoutContext, type LayoutValues } from './LayoutWrapper';

export const useLayoutValues = (): LayoutValues => {
  const context = useLayoutContext();

  if (context) {
    return context;
  }

  return {
    breakpoints: DEFAULT_BREAKPOINTS,
  };
};
