import React from 'react';

/** A dropdown item has a string label and a string value */
export type NormalizedDropdownItemType = {
  value: string;
  label: string;
  icons?: React.ComponentType<any>[];
};

export type DropdownItemType =
  | { value?: string; label: string; icons?: React.ComponentType<any>[] }
  | string;
export const useNormalizedItems = (items: DropdownItemType[]) =>
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
