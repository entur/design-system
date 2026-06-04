import { useId } from 'react';

export const useRandomId = (prefix?: string): string => {
  const id = useId();
  return prefix ? `${prefix}${id}` : id;
};
