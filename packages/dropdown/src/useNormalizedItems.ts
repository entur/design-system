import React from 'react';

export type DropdownItemType =
  | { value?: string; label: string; icons?: React.ComponentType<any>[] }
  | string;

export type NormalizedDropdownItemType = {
  value: string;
  label: string;
  icons?: React.ComponentType<any>[];
};

export const useNormalizedItems = (
  items: DropdownItemType[],
): NormalizedDropdownItemType[] =>
  React.useMemo(
    () =>
      items.map(item => {
        if (typeof item == 'string') {
          return { value: item, label: item };
        }

        if (!('value' in item)) {
          return { ...item, value: item.label };
        }
        return item as NormalizedDropdownItemType;
      }),
    [items],
  );
