import React from 'react';
import classNames from 'classnames';
import {
  UseComboboxGetMenuPropsOptions,
  GetPropsCommonOptions,
  UseComboboxGetItemPropsOptions,
} from 'downshift';

import { Checkbox } from '@entur/form';
import { VisuallyHidden } from '@entur/a11y';

import { NormalizedDropdownItemType } from '../useNormalizedItems';

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
  ariaLabelSelectedItem?: string;
  loading?: boolean;
  selectAllItem?: NormalizedDropdownItemType;
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
  ariaLabelSelectedItem = ', valgt element, trykk for å fjerne',
  ...rest
}: DropdownListProps) => {
  const isMultiselect = selectAllItem !== undefined;
  const isNoMatches =
    !loading &&
    (listItems.length === 0 ||
      (listItems.length === 1 && listItems[0].value === selectAllItem?.value));
  const isItemSelected = (item: NormalizedDropdownItemType) =>
    selectedItems.some(selectedItem => selectedItem.value === item.value);

  const ariaLabelSelectAll = () => {
    switch (selectAllCheckboxState?.()) {
      case 'indeterminate': {
        return `${selectAllItem?.label}, delvis valgt`;
      }
      case true: {
        return `${selectAllItem?.label}, valgt`;
      }
      default: {
        return `${selectAllItem?.label}`;
      }
    }
  };

  const selectAllListItemContent = () => (
    <>
      <Checkbox
        aria-hidden="true"
        checked={selectAllCheckboxState?.()}
        className="eds-dropdown__list__item__checkbox"
        onChange={() => {
          return;
        }}
        tabIndex={-1}
      />
      <span
        className="eds-dropdown__list__item__text"
        aria-label={ariaLabelSelectAll()}
      >
        {selectAllItem?.label}
      </span>
    </>
  );

  const listItemContent = (item: NormalizedDropdownItemType) => {
    return (
      <>
        <Checkbox
          aria-hidden="true"
          checked={isItemSelected(item)}
          className="eds-dropdown__list__item__checkbox"
          onChange={() => {
            return;
          }}
          style={!isMultiselect ? { display: 'none' } : {}}
          tabIndex={-1}
        />

        <span className="eds-dropdown__list__item__text">
          {item.label}
          <VisuallyHidden>
            {isItemSelected(item) ? ariaLabelSelectedItem : ''}
          </VisuallyHidden>
        </span>
        {item.icons && (
          <span>
            {item.icons.map((Icon, index) => (
              <Icon
                key={index}
                inline
                className="eds-dropdown__list__item__icon"
              />
            ))}
          </span>
        )}
      </>
    );
  };

  return (
    // use popover from @entur/tooltip when that package upgrades to floating-ui
    <ul
      {...getMenuProps()}
      className={classNames('eds-dropdown__list', {
        'eds-dropdown__list--open': isOpen,
      })}
      style={{ ...rest.style, ...listStyle }}
    >
      {listItems.length > 0 &&
        listItems.map((item, index) => {
          const itemIsSelectAll = item.value === selectAllItem?.value;
          if (itemIsSelectAll && listItems.length <= 2) return <></>;

          return (
            <li
              key={item.value}
              className={classNames('eds-dropdown__list__item', {
                'eds-dropdown__list__item--select-all': itemIsSelectAll,
                'eds-dropdown__list__item--highlighted':
                  highlightedIndex === index,
                'eds-dropdown__list__item--selected':
                  !isMultiselect && isItemSelected(item),
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

      {isNoMatches && (
        <li className="eds-dropdown__list__item">{noMatchesText}</li>
      )}

      {loading && <li className="eds-dropdown__list__item">{loadingText}</li>}
    </ul>
  );
};
