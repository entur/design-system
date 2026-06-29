import { useId } from 'react';

/**
 * @deprecated Use `useId()` from React directly instead.
 * Will be removed in a future major version.
 *
 * ```diff
 * - import { useRandomId } from '@entur/utils';
 * - const id = useRandomId('eds-my-component');
 * + import { useId } from 'react';
 * + const id = `eds-my-component${useId()}`;
 * ```
 */
export const useRandomId = (prefix?: string): string => {
  const id = useId();
  return prefix ? `${prefix}${id}` : id;
};
