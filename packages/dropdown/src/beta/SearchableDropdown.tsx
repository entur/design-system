/* eslint-disable  no-warning-comments */
import React, { useRef, useState } from 'react';
import { useCombobox } from 'downshift';
import classNames from 'classnames';

import { BaseFormControl, VariantType } from '@entur/form';

import { NormalizedDropdownItemType } from '../useNormalizedItems';
import { DropdownList } from './components/DropdownList';

import { itemToString, lowerCaseFilterTest } from './utils';
import { FieldAppend } from './components/FieldComponents';

import './Dropdown.scss';

export type SearchableDropdownProps = {
  /** Tilgjengelige valg i dropdown-en */
  items: NormalizedDropdownItemType[];
  /** Valgt element. Bruk null for ingen verdi. */
  selectedItem: NormalizedDropdownItemType | null;
  /** Callback for når brukeren endrer valg */
  onChange: (value: NormalizedDropdownItemType | null) => void;
  /** Beskrivende tekst som forklarer feltet */
  label: string;
  /** Placeholder-tekst når ingenting er satt */
  placeholder?: string;
  /** Vis knapp for å nullstille Dropdown-en skal vises
   * @default false
   */
  clearable?: boolean;
  /** Vis listen med valg skal vises på fokus av inputfeltet
   * @default false
   */
  openOnFocus?: boolean;
  /** Gjør dropdown-en til å kun kunne leses
   * @default false
   */
  readonly?: boolean;
  /** Hvilken valideringsvariant som gjelder */
  variant?: VariantType;
  /** Valideringsmelding, brukes sammen med `variant` */
  feedback?: string;
  className?: string;
  style?: { [key: string]: any };
  /** Style som kun påføres listeelementet */
  listStyle?: { [key: string]: any };
  [key: string]: any;
};

// TODO Husk å @deprecate searchable-prop-en til Dropdown når denne komponenten skal ha official release
// TODO Husk å generelt legge inn støtte for typeof value === string

export const SearchableDropdownBeta = ({
  items,
  selectedItem: value,
  onChange,
  label,
  placeholder,
  clearable = false,
  openOnFocus = false,
  selectOnBlur = false,
  readonly = false,
  feedback,
  variant = 'info',
  className,
  listStyle,
  ...rest
}: SearchableDropdownProps) => {
  const [filteredItems, setFilteredItems] = React.useState(items);
  const [hideSelectedItem, setHideSelectedItem] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const stateReducer = React.useCallback((_, { type, changes }) => {
    switch (type) {
      case useCombobox.stateChangeTypes.ItemClick:
      case useCombobox.stateChangeTypes.InputKeyDownEnter:
      case useCombobox.stateChangeTypes.InputBlur:
      case useCombobox.stateChangeTypes.ControlledPropUpdatedSelectedItem:
        return {
          ...changes,
          // reset input value to show placeholder on focus
          inputValue: '',
        };
      default:
        return changes;
    }
  }, []);

  const {
    isOpen,
    openMenu,
    closeMenu,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    selectedItem,
    inputValue,
    setInputValue,
  } = useCombobox({
    items: filteredItems,
    selectedItem: value,
    itemToString,
    stateReducer,
    onInputValueChange({ inputValue }) {
      if (inputValue === ' ') {
        const wasOpen = isOpen;
        setInputValue('');
        if (!wasOpen) closeMenu();
      } else {
        setFilteredItems(
          items.filter(item => lowerCaseFilterTest(item, inputValue)),
        );
      }
    },
    onStateChange({ type, selectedItem: clickedItem }) {
      switch (type) {
        // @ts-expect-error This falltrough is wanted
        case useCombobox.stateChangeTypes.InputBlur:
          if (!selectOnBlur) break;
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          onChange(clickedItem ?? null);
      }
    },
    ...rest,
  });

  return (
    <div className="eds-dropdown__wrapper">
      <BaseFormControl
        append={
          <FieldAppend
            selectedItems={[selectedItem]}
            isOpen={isOpen}
            clearable={clearable}
            loading={false}
            loadingText={''}
            readOnly={readonly}
            onClear={() => {
              onChange(null);
              setInputValue('');
            }}
            getToggleButtonProps={getToggleButtonProps}
          />
        }
        className={classNames('eds-dropdown', className)}
        label={label}
        isFilled={selectedItem || inputValue !== ''}
        feedback={feedback}
        variant={variant}
        readOnly={readonly}
        labelProps={getLabelProps()}
        {...getComboboxProps()}
        {...rest}
      >
        {!hideSelectedItem && selectedItem && !inputValue && (
          <span className="eds-dropdown__selected-item__wrapper">
            <span
              className="eds-dropdown__selected-item"
              onClick={() => inputRef.current?.focus()}
            >
              {selectedItem.label}
            </span>
          </span>
        )}
        <input
          placeholder={selectedItem?.label ?? placeholder}
          className="eds-dropdown__input eds-form-control"
          {...getInputProps({
            onFocus: () => {
              if (!isOpen && openOnFocus) openMenu();
              setHideSelectedItem(true);
            },
            onBlur: () => {
              setHideSelectedItem(false);
            },
            ref: inputRef,
          })}
        />
      </BaseFormControl>
      <DropdownList
        selectedItems={selectedItem !== null ? [selectedItem] : []}
        isOpen={isOpen}
        listItems={filteredItems}
        highlightedIndex={highlightedIndex}
        listStyle={listStyle}
        getMenuProps={getMenuProps}
        getItemProps={getItemProps}
      />
    </div>
  );
};
