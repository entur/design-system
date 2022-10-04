import React from 'react';
import classNames from 'classnames';
import {
  UseComboboxGetMenuPropsOptions,
  GetPropsCommonOptions,
  UseComboboxGetItemPropsOptions,
} from 'downshift';

import { CheckIcon } from '@entur/icons';

import { NormalizedDropdownItemType } from '../useNormalizedItems';

type DropdownListProps = {
  selectedItem: NormalizedDropdownItemType | null;
  isOpen: boolean;
  filteredItems: NormalizedDropdownItemType[];
  highlightedIndex: number;
  listStyle: { [key: string]: any } | undefined;
  getMenuProps: (
    options?: UseComboboxGetMenuPropsOptions | undefined,
    otherOptions?: GetPropsCommonOptions | undefined,
  ) => any;
  getItemProps: (
    options: UseComboboxGetItemPropsOptions<NormalizedDropdownItemType>,
  ) => any;
  [key: string]: any;
};

export const DropdownList = ({
  selectedItem,
  isOpen,
  getMenuProps,
  getItemProps,
  filteredItems,
  highlightedIndex,
  listStyle,
  ...rest
}: DropdownListProps) => {
  return (
    <ul
      className={classNames('eds-searchable-dropdown__list', {
        'eds-searchable-dropdown__list--open': isOpen,
      })}
      {...getMenuProps()}
      style={{ ...rest.style, ...listStyle }}
    >
      {isOpen
        ? filteredItems.map((item, index) => (
            // eslint-disable-next-line react/jsx-key
            <li
              className={classNames('eds-searchable-dropdown__list__item', {
                'eds-searchable-dropdown__list__item--highlighted':
                  highlightedIndex === index,
                'eds-searchable-dropdown__list__item--selected':
                  selectedItem?.value === item.value,
              })}
              {...getItemProps({ key: `${index}${item.value}`, item, index })}
            >
              <span>{item.label}</span>
              {item.icons && (
                <span>
                  {item.icons.map((Icon, index) => (
                    <Icon
                      key={index}
                      inline
                      className="eds-searchable-dropdown__list__item-icon"
                    />
                  ))}
                </span>
              )}
              {selectedItem?.value === item.value && <CheckIcon />}
            </li>
          ))
        : null}
    </ul>
  );
};
