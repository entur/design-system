import React from 'react';

import { DropdownItemType, NormalizedDropdownItemType } from './types';

export const useNormalizedItems = <ValueType = string>(
  items: DropdownItemType<ValueType>[],
): NormalizedDropdownItemType<ValueType>[] =>
  React.useMemo(
    () =>
      items.map(item => {
        if (typeof item == 'string') {
          return {
            value: item as ValueType,
            label: item,
          };
        }

        if (item?.value === undefined) {
          return {
            ...item,
            value: item.label as ValueType,
          };
        }
        return { ...item, value: item.value };
      }),
    [items],
  );
