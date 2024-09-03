import React from 'react';
import classNames from 'classnames';
import { UseComboboxPropGetters, UseSelectPropGetters } from 'downshift';

import { VisuallyHidden } from '@entur/a11y';
import { Checkbox } from '@entur/form';
import { mergeRefs } from '@entur/utils';

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
  listStyle: { [key: string]: any } | undefined;
  listRef?: React.Ref<HTMLUListElement>;
  loading?: boolean;
  loadingText?: string;
  noMatchesText?: string;
  selectAllCheckboxState?: () => boolean | 'indeterminate';
  selectAllItem?: NormalizedDropdownItemType<string>;
  selectedItems: NormalizedDropdownItemType<ValueType>[];
  [key: string]: any;
};

export const DropdownList = <ValueType extends NonNullable<any>>({
  ariaLabelChosenSingular = 'valgt',
  ariaLabelSelectedItem = ', valgt element, trykk for å fjerne',
  getItemProps,
  getMenuProps,
  inputValue,
  isOpen,
  highlightedIndex,
  listItems,
  listStyle,
  listRef,
  loading = false,
  loadingText = 'Laster inn …',
  noMatchesText = 'Ingen treff for søket',
  selectAllCheckboxState,
  selectAllItem,
  selectedItems,
  showSelectAllInList = false,
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
        onChange={() => {
          return;
        }}
        tabIndex={-1}
      />
      <span
        className="eds-dropdown__list__item__text"
        aria-label={ariaValuesSelectAll().label}
      >
        {selectAllItem?.label}
      </span>
    </>
  );

  const listItemContent = (item: NormalizedDropdownItemType<ValueType>) => {
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
            {item.icons.map(Icon => (
              <Icon
                key={
                  item?.label + item?.value + (Icon?.displayName ?? Icon?.name)
                }
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
      {...getMenuProps(
        {
          'aria-multiselectable': isMultiselect,
        },
        { suppressRefError: true },
      )}
      ref={mergeRefs(listRef, getMenuProps().ref)}
      className="eds-dropdown__list"
      style={{
        display: isOpen ? 'inline-block' : 'none',
        ...rest.style,
        ...listStyle,
      }}
    >
      {!loading &&
        listItems.length > 0 &&
        listItems.map((item, index) => {
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
              {...getItemProps({
                key: item?.label + item?.value,
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
        })}

      {isNoMatches && (
        <li key="dropdown-list-no-match" className="eds-dropdown__list__item">
          {noMatchesText}
        </li>
      )}
      {/* Known bug: the debounce of useResolvedItems makes noMatchesText show up before loadingText on fetch.
          To solve this, the dropdownList needs to account for the debounce */}
      {loading && (
        <li key="dropdown-list-loading" className="eds-dropdown__list__item">
          {loadingText}
        </li>
      )}
    </ul>
  );
};
