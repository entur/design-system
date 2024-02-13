import React from 'react';

import { DropdownItemType, NormalizedDropdownItemType } from './types';

// export type DropdownItemType<ValueType> =
//   | { value?: ValueType; label: string; icons?: React.ComponentType<any>[] }
//   | string;

// export type NormalizedDropdownItemType = {
//   value: string | number | Record<any, any>;
//   label: string;
//   icons?: React.ComponentType<any>[];
// };

export const useNormalizedItems = <ValueType = string>(
  items: DropdownItemType<ValueType>[],
): NormalizedDropdownItemType<ValueType>[] =>
  React.useMemo(
    () =>
      items.map(item => {
        if (typeof item == 'string') {
          return {
            value: item,
            label: item,
          } as NormalizedDropdownItemType<ValueType>;
        }

        if (!('value' in item)) {
          return {
            ...item,
            value: item.label,
          } as NormalizedDropdownItemType<ValueType>;
        }
        return item as NormalizedDropdownItemType<ValueType>;
      }),
    [items],
  );
