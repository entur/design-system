import React from 'react';
import classNames from 'classnames';
import {
  UseComboboxGetMenuPropsOptions,
  GetPropsCommonOptions,
  UseComboboxGetItemPropsOptions,
} from 'downshift';

import { Checkbox } from '@entur/form';
import { VisuallyHidden } from '@entur/a11y';

import { NormalizedDropdownItemType } from '../../useNormalizedItems';

import './DropdownList.scss';

type DropdownListProps = {
  selectedItems: NormalizedDropdownItemType[];
  isOpen: boolean;
  listItems: NormalizedDropdownItemType[];
  highlightedIndex: number;
  listStyle: { [key: string]: any } | undefined;
  getMenuProps: (
    options?: UseComboboxGetMenuPropsOptions | undefined,
    otherOptions?: GetPropsCommonOptions | undefined,
  ) => any;
  getItemProps: (
    options: UseComboboxGetItemPropsOptions<NormalizedDropdownItemType>,
  ) => any;
  selectAllCheckboxState?: () => boolean | 'indeterminate';
  noMatchesText?: string;
  loadingText?: string;
  selectedItemAriaLabel?: string;
  loading?: boolean;
  [key: string]: any;
};

export const DropdownList = ({
  selectedItems,
  listItems,
  inputValue,
  isOpen,
  getMenuProps,
  getItemProps,
  highlightedIndex,
  showSelectAllInList = false,
  loading = false,
  selectAllCheckboxState,
  selectAllItem,
  listStyle,
  noMatchesText = 'Ingen treff for søket',
  loadingText = 'Laster inn …',
  selectedItemAriaLabel = ', valgt element',
  ...rest
}: DropdownListProps) => {
  const isNoMatches =
    !loading &&
    (listItems.length == 0 ||
      (listItems.length == 1 && listItems[0].value == selectAllItem.value));

  const selectAllListItemContent = () => (
    <>
      <Checkbox
        checked={selectAllCheckboxState?.()}
        aria-hidden="true"
        onChange={() => {
          return;
        }}
      />
      <span className="eds-dropdown__list__item-text">
        {selectAllItem.label}
      </span>
    </>
  );

  const listItemContent = (item: NormalizedDropdownItemType) => {
    const itemIsSelected = selectedItems.some(
      selectedItem => selectedItem.value === item.value,
    );
    return (
      <>
        <Checkbox
          style={
            !selectAllItem && !itemIsSelected ? { visibility: 'hidden' } : {}
          }
          checked={itemIsSelected}
          aria-hidden="true"
          onChange={() => {
            return;
          }}
        />

        <span className="eds-dropdown__list__item-text">
          {item.label}
          <VisuallyHidden>{selectedItemAriaLabel}</VisuallyHidden>
        </span>
        {item.icons && (
          <span>
            {item.icons.map((Icon, index) => (
              <Icon
                key={index}
                inline
                className="eds-dropdown__list__item-icon"
              />
            ))}
          </span>
        )}
      </>
    );
  };

  return (
    <ul
      {...getMenuProps()}
      className={classNames('eds-dropdown__list', {
        'eds-dropdown__list--open': isOpen,
      })}
      style={{ ...rest.style, ...listStyle }}
    >
      {isOpen &&
        listItems.length > 0 &&
        listItems.map((item, index) => {
          const itemIsSelectAll = item.value === selectAllItem.value;
          if (itemIsSelectAll && listItems.length <= 2) return;

          return (
            <li
              key={item.value}
              className={classNames('eds-dropdown__list__item', {
                'eds-dropdown__list__item--select-all': itemIsSelectAll,
                'eds-dropdown__list__item--highlighted':
                  highlightedIndex === index,
              })}
              {...getItemProps({
                key: `${index}${item.value}`,
                item,
                index,
              })}
            >
              {itemIsSelectAll
                ? selectAllListItemContent()
                : listItemContent(item)}
            </li>
          );
        })}

      {isOpen && isNoMatches && (
        <li className="eds-dropdown__list__item">{noMatchesText}</li>
      )}

      {isOpen && loading && (
        <li className="eds-dropdown__list__item">{loadingText}</li>
      )}
    </ul>
  );
};
