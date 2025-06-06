import React from 'react';
import classNames from 'classnames';
import { UseComboboxPropGetters, UseSelectPropGetters } from 'downshift';

import { VisuallyHidden } from '@entur/a11y';
import { Checkbox } from '@entur/form';

import { NormalizedDropdownItemType } from '../types';

import './DropdownList.scss';

type DropdownListProps<ValueType> = {
  ariaLabelChosenSingular?: string;
  ariaLabelSelectedItem?: string;
  getMenuProps:
    | UseComboboxPropGetters<ValueType>['getMenuProps']
    | UseSelectPropGetters<ValueType>['getMenuProps'];
  getItemProps:
    | UseComboboxPropGetters<ValueType>['getItemProps']
    | UseSelectPropGetters<ValueType>['getItemProps'];
  highlightedIndex: number;
  isOpen: boolean;
  listItems: NormalizedDropdownItemType<ValueType | string>[];
  floatingStyles: { [key: string]: any } | undefined;
  setListRef: (node: HTMLElement | null) => void;
  loading?: boolean;
  loadingText?: string;
  noMatchesText?: string;
  selectAllCheckboxState?: () => boolean | 'indeterminate';
  selectAllItem?: NormalizedDropdownItemType<string>;
  selectedItems: NormalizedDropdownItemType<ValueType>[];
  style?: React.CSSProperties;
};

export const DropdownList = <ValueType extends NonNullable<any>>({
  ariaLabelChosenSingular = 'valgt',
  ariaLabelSelectedItem = ', valgt element, trykk for å fjerne',
  getItemProps,
  getMenuProps,
  isOpen,
  highlightedIndex,
  listItems,
  floatingStyles,
  setListRef,
  loading = false,
  loadingText = 'Laster inn …',
  noMatchesText = 'Ingen treff for søket',
  selectAllCheckboxState,
  selectAllItem,
  selectedItems,
  ...rest
}: DropdownListProps<ValueType>) => {
  const isMultiselect = selectAllItem !== undefined;
  const isNoMatches =
    !loading &&
    (listItems.length === 0 ||
      (listItems?.length === 1 &&
        listItems?.[0]?.value === selectAllItem?.value));
  const isItemSelected = (
    item: NormalizedDropdownItemType<ValueType | string>,
  ) =>
    selectedItems.some(
      selectedItem =>
        selectedItem?.value === item?.value &&
        selectedItem?.label === item?.label,
    );

  const ariaValuesSelectAll = () => {
    switch (selectAllCheckboxState?.()) {
      case 'indeterminate': {
        return {
          label: `${selectAllItem?.label}, delvis valgt`,
          selected: false,
        };
      }
      case true: {
        return {
          label: `${selectAllItem?.label}, ${ariaLabelChosenSingular}`,
          selected: true,
        };
      }
      default: {
        return { label: `${selectAllItem?.label}`, selected: false };
      }
    }
  };

  const selectAllListItemContent = () => (
    <>
      <Checkbox
        aria-hidden="true"
        checked={selectAllCheckboxState?.()}
        className="eds-dropdown__list__item__checkbox"
        tabIndex={-1}
        readOnly
      />
      <span
        className="eds-dropdown__list__item__text"
        aria-label={ariaValuesSelectAll().label}
      >
        {selectAllItem?.label}
      </span>
    </>
  );

  const isReactComponent = (icon: any): icon is React.ComponentType<any> => {
    return (
      typeof icon === 'function' ||
      (typeof icon === 'object' &&
        icon !== null &&
        '$$typeof' in icon &&
        typeof icon.$$typeof === 'symbol')
    );
  };

  const listItemContent = (item: NormalizedDropdownItemType<ValueType>) => {
    return (
      <>
        {isMultiselect && (
          <Checkbox
            aria-hidden="true"
            checked={isItemSelected(item)}
            className="eds-dropdown__list__item__checkbox"
            tabIndex={-1}
            readOnly
          />
        )}
        <span className="eds-dropdown__list__item__text">
          {item.label}
          <VisuallyHidden>
            {isItemSelected(item) ? ariaLabelSelectedItem : ''}
          </VisuallyHidden>
        </span>
        {Array.isArray(item.icons)
          ? item.icons.filter(isReactComponent).map((Icon, index) => {
              const key = `${
                Icon.displayName ?? Icon.name ?? Icon.name
              }-${index}`;
              return (
                <Icon
                  key={key}
                  inline
                  className="eds-dropdown__list__item__icon"
                />
              );
            })
          : null}
      </>
    );
  };

  return (
    // use popover from @entur/tooltip when that package upgrades to floating-ui
    <ul
      {...getMenuProps({
        'aria-multiselectable': isMultiselect,
        ref: setListRef,
        className: 'eds-dropdown__list',
        style: {
          ...floatingStyles,
          display: isOpen ? undefined : 'none',
          ...rest.style,
        },
      })}
    >
      {(() => {
        if (!isOpen) {
          return null;
        }

        if (loading) {
          return (
            <li
              key="dropdown-list-loading"
              className="eds-dropdown__list__item"
            >
              {loadingText}
            </li>
          );
        }

        if (isNoMatches) {
          return (
            <li
              key="dropdown-list-no-match"
              className="eds-dropdown__list__item"
            >
              {noMatchesText}
            </li>
          );
        }

        return listItems.map((item, index) => {
          const key =
            item.itemKey ??
            `${item.label ?? ''}-${item.value ?? ''}-${(item.icons ?? [])
              .map(icon => icon?.displayName ?? icon?.name ?? 'unknown')
              .join('-')}`;
          const itemIsSelectAll = item.value === selectAllItem?.value;
          if (itemIsSelectAll && listItems.length <= 2) return null;
          return (
            <li
              className={classNames('eds-dropdown__list__item', {
                'eds-dropdown__list__item--select-all': itemIsSelectAll,
                'eds-dropdown__list__item--highlighted':
                  highlightedIndex === index,
                'eds-dropdown__list__item--selected':
                  !isMultiselect && isItemSelected(item),
              })}
              key={key}
              {...getItemProps({
                // @ts-expect-error Since getItemProps expects the same item type
                // here as items, it throws error when selectAllItem is a string.
                // This does, however, not cause any functional issues.
                item,
                index,
                'aria-selected': itemIsSelectAll
                  ? ariaValuesSelectAll().selected
                  : isItemSelected(item),
              })}
            >
              {itemIsSelectAll
                ? selectAllListItemContent()
                : listItemContent(
                    item as NormalizedDropdownItemType<ValueType>,
                  )}
            </li>
          );
        });
      })()}
    </ul>
  );
};
