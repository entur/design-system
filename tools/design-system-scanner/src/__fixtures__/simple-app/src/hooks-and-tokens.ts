import { colors, space } from '@entur/tokens';
import { useRandomId } from '@entur/utils';

// Token usage
const primaryColor = colors.brand.blue;
const gap = space.medium;
const accent = colors.validation.canary;

// Hook usage
export function useStyledId() {
  const id = useRandomId('styled');
  return `${id}-${primaryColor}-${gap}`;
}
