import React, { useRef, useState } from 'react';
import classNames from 'classnames';
import {
  useMultipleSelection,
  useCombobox,
  UseComboboxStateChangeOptions,
} from 'downshift';

import { BaseFormControl } from '@entur/form';
import { useRandomId } from '@entur/utils';

import { NormalizedDropdownItemType } from '../useNormalizedItems';
import {
  PotentiallyAsyncDropdownItemType,
  useResolvedItems,
} from '../useResolvedItems';
import { FieldAppend, SelectedElementsTag } from './components/FieldComponents';
import { DropdownList } from './components/DropdownList';
import {
  itemToString,
  lowerCaseFilterTest,
  useMultiselectUtils,
} from './utils';

import './Dropdown.scss';

export type MultiSelectBetaProps = {
  items: PotentiallyAsyncDropdownItemType;
  selectedItems: NormalizedDropdownItemType[];
  onChange: (value: NormalizedDropdownItemType[]) => void;
  [key: string]: any;
};

export const MultiSelectBeta = ({
  items: initialItems,
  selectedItems,
  onChange,
  label,
  placeholder,
  clearable = false,
  openOnFocus = false,
  selectOnBlur = false,
  hideSelectAll = false,
  readonly = false,
  feedback,
  variant = 'info',
  selectAllLabel = 'Velg alle',
  className,
  listStyle,
  ariaLabelRemoveSelected = 'trykk for å fjerne valg',
  ...rest
}: MultiSelectBetaProps) => {
  const [lastHighlightedIndex, setLastHighlightedIndex] = React.useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    items: normalizedItems,
    loading,
    fetchItems,
  } = useResolvedItems(initialItems);

  const selectAll: NormalizedDropdownItemType = {
    value: useRandomId('select-all'),
    label: selectAllLabel,
  };

  const [listItems, setListItems] = useState([
    ...(!hideSelectAll ? [selectAll] : []),
    ...normalizedItems,
  ]);

  const filterListItems = ({ inputValue }: { inputValue: string }) =>
    setListItems([
      ...(!hideSelectAll ? [selectAll] : []),
      ...normalizedItems.filter(item => lowerCaseFilterTest(item, inputValue)),
    ]);

  React.useEffect(() => {
    filterListItems({ inputValue });
  }, [normalizedItems]);

  const {
    addClickedItemToSelectedItems,
    allListItemsAreSelected,
    clickedItemIsInSelectedItems,
    clickedItemIsSelectAll,
    hasSelectedItems,
    removeClickedItemFromSelectedItems,
    selectAllCheckboxState,
    selectAllUnselectedItemsInListItems,
    unselectAllListItems,
  } = useMultiselectUtils({
    listItems,
    selectAllValue: selectAll.value,
    selectedItems,
  });

  const { getSelectedItemProps, getDropdownProps, removeSelectedItem } =
    useMultipleSelection({
      selectedItems,
      itemToString,
      onSelectedItemsChange(changes) {
        onChange(changes.selectedItems ?? []);
      },
    });

  const stateReducer = React.useCallback(
    (
      _,
      {
        changes,
        type,
      }: UseComboboxStateChangeOptions<NormalizedDropdownItemType>,
    ) => {
      if (changes?.highlightedIndex && changes?.highlightedIndex >= 0)
        setLastHighlightedIndex(changes?.highlightedIndex);

      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          return {
            ...changes,
            isOpen: true, // keep the menu open after selection.
            inputValue: inputRef?.current?.value ?? '', // don't reset input value on select
          };
        case useCombobox.stateChangeTypes.ControlledPropUpdatedSelectedItem:
          return {
            ...changes,
            inputValue: inputRef?.current?.value ?? '', // don't reset input value on select
          };
        case useCombobox.stateChangeTypes.InputChange:
          if (changes.inputValue?.match(/^\s+/g)) {
            // remove leading whitespace if it exists
            return {
              ...changes,
              inputValue: changes.inputValue.replace(/^\s+/g, '') ?? '',
            };
          }

          if (typeof initialItems === 'function')
            fetchItems(changes.inputValue ?? ''); // fetch items only if user provides a function as items

          filterListItems({ inputValue: changes.inputValue ?? '' });
          return changes;
        case useCombobox.stateChangeTypes.InputBlur:
          return {
            ...changes,
            inputValue: '',
          };
        default:
          return changes;
      }
    },
    [hideSelectAll, normalizedItems],
  );

  const {
    getComboboxProps,
    getInputProps,
    getItemProps,
    getLabelProps,
    getMenuProps,
    getToggleButtonProps,
    highlightedIndex,
    inputValue,
    isOpen,
    openMenu,
    setInputValue,
  } = useCombobox({
    defaultHighlightedIndex: lastHighlightedIndex, // after selection, highlight previously selected item.
    items: listItems,
    itemToString,
    selectedItem: null,
    stateReducer,
    onStateChange({ type, selectedItem: clickedItem }) {
      // clickedItem means item just chosen either via mouse or keyboard
      if (!clickedItem) return;

      switch (type) {
        // @ts-expect-error This falltrough is wanted
        case useCombobox.stateChangeTypes.InputBlur:
          if (!selectOnBlur) break;
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          if (clickedItemIsSelectAll(clickedItem)) {
            if (allListItemsAreSelected) {
              return unselectAllListItems(onChange);
            }
            return selectAllUnselectedItemsInListItems(onChange);
          }

          if (clickedItemIsInSelectedItems(clickedItem)) {
            return removeClickedItemFromSelectedItems(clickedItem, onChange);
          }
          addClickedItemToSelectedItems(clickedItem, onChange);
      }
    },
    ...rest,
  });

  // role=combobox leads to strange VoiceOver behavior and is therefor omitted
  // const { role: _, ...comboboxProps } = getComboboxProps();
  const { ...comboboxProps } = getComboboxProps();

  return (
    <div className="eds-dropdown__wrapper">
      <BaseFormControl
        append={
          <FieldAppend
            selectedItems={selectedItems}
            isOpen={isOpen}
            clearable={clearable}
            loading={loading}
            loadingText={''}
            readOnly={readonly}
            onClear={() => {
              onChange([]);
              setInputValue('');
              inputRef.current?.focus();
              if (typeof initialItems === 'function')
                fetchItems(inputValue ?? '');
            }}
            getToggleButtonProps={getToggleButtonProps}
          />
        }
        className={classNames('eds-dropdown', className)}
        label={label}
        isFilled={hasSelectedItems || inputValue !== ''}
        feedback={feedback}
        variant={variant}
        readOnly={readonly}
        labelProps={{
          'aria-label': `${label}, multiselect, ${selectedItems.length} valgte elementer`,
          ...getLabelProps(),
        }}
        {...comboboxProps}
        {...rest}
      >
        <div
          className={classNames('eds-dropdown__selected-items-and-input', {
            'eds-dropdown__selected-items-and-input--filled': hasSelectedItems,
          })}
          onClick={(e: React.MouseEvent) => {
            if (e.target == e.currentTarget) inputRef.current?.focus();
          }}
        >
          {selectedItems.map((selectedItem, index) => (
            <SelectedElementsTag
              index={index}
              key={selectedItem.value}
              getSelectedItemProps={getSelectedItemProps}
              selectedItem={selectedItem}
              removeSelectedItem={removeSelectedItem}
              ariaLabelRemoveSelected={ariaLabelRemoveSelected}
            />
          ))}
          <input
            placeholder={placeholder}
            className="eds-dropdown__input eds-form-control"
            role="combobox"
            {...getInputProps(
              getDropdownProps({
                preventKeyAction: isOpen,
                onFocus: () => {
                  if (!isOpen && openOnFocus) openMenu();
                },
                ref: inputRef,
                value: inputValue ?? '',
              }),
            )}
          />
        </div>
      </BaseFormControl>
      <DropdownList
        listItems={listItems}
        selectedItems={selectedItems}
        inputValue={inputValue}
        isOpen={isOpen}
        highlightedIndex={highlightedIndex}
        getMenuProps={getMenuProps}
        getItemProps={getItemProps}
        selectAllItem={selectAll}
        selectAllCheckboxState={selectAllCheckboxState}
        listStyle={listStyle}
        loading={loading}
      />
    </div>
  );
};
