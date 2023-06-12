/* eslint-disable  no-warning-comments */
import React, { useRef, useState } from 'react';
import { UseComboboxStateChangeOptions, useCombobox } from 'downshift';
import classNames from 'classnames';

import { BaseFormControl, VariantType } from '@entur/form';

import { NormalizedDropdownItemType } from '../useNormalizedItems';
import {
  PotentiallyAsyncDropdownItemType,
  useResolvedItems,
} from '../useResolvedItems';
import { DropdownList } from './components/DropdownList';

import { itemToString, lowerCaseFilterTest } from './utils';
import { FieldAppend } from './components/FieldComponents';

import './Dropdown.scss';

export type SearchableDropdownProps = {
  /** Tilgjengelige valg i dropdown-en */
  items: PotentiallyAsyncDropdownItemType;
  /** Valgt element. Bruk null for ingen verdi.
   * Det er denne som skal oppdateres av onChange
   */
  selectedItem: NormalizedDropdownItemType | null;
  /** Callback for når brukeren endrer valg */
  onChange: (value: NormalizedDropdownItemType | null) => void;
  /** Filtreringen som blir brukt dersom man har en searchable Dropdown
   * @default Enkel tekstsammenligning
   */
  itemFilter?: (
    item: NormalizedDropdownItemType,
    inputValue: string | undefined,
  ) => boolean;
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
  /** Plasserer labelen statisk på toppen av inputfeltet
   * @default false
   */
  disableLabelAnimation?: boolean;
  /** Antall millisekunder man venter før man kaller en potensiell items-funksjon */
  debounceTimeout?: number;
  /** Gjør dropdown-en til å kun kunne leses
   * @default false
   */
  readonly?: boolean;
  selectOnBlur?: boolean;
  /** Hvilken valideringsvariant som gjelder */
  variant?: VariantType;
  /** Valideringsmelding, brukes sammen med `variant` */
  feedback?: string;
  className?: string;
  style?: { [key: string]: any };
  /** Style som kun påføres listeelementet */
  listStyle?: { [key: string]: any };
};

// TODO Husk å @deprecate searchable-prop-en til Dropdown når denne komponenten skal ha official release
// TODO Husk å generelt legge inn støtte for typeof value === string

export const SearchableDropdownBeta = ({
  className,
  clearable = false,
  debounceTimeout,
  // disabled = false,
  disableLabelAnimation = false,
  feedback,
  // highlightFirstItemOnOpen,
  itemFilter = lowerCaseFilterTest,
  items: initialItems,
  label,
  listStyle,
  // loadingText,
  onChange,
  openOnFocus = false,
  placeholder,
  // prepend,
  readonly = false,
  selectedItem: value,
  selectOnBlur = false,
  // selectOnTab = false,
  // style,
  variant = 'info',
  ...rest
}: SearchableDropdownProps) => {
  const [hideSelectedItem, setHideSelectedItem] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    items: normalizedItems,
    loading,
    fetchItems,
  } = useResolvedItems(initialItems, debounceTimeout);

  const [listItems, setListItems] = React.useState(normalizedItems);

  const filterListItems = ({ inputValue }: { inputValue: string }) =>
    setListItems(normalizedItems.filter(item => itemFilter(item, inputValue)));

  React.useEffect(() => {
    filterListItems({ inputValue });
  }, [normalizedItems]); // eslint-disable-line react-hooks/exhaustive-deps

  const stateReducer = React.useCallback(
    (
      _,
      {
        type,
        changes,
      }: UseComboboxStateChangeOptions<NormalizedDropdownItemType>,
    ) => {
      switch (type) {
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.InputBlur:
        case useCombobox.stateChangeTypes.ControlledPropUpdatedSelectedItem: {
          filterListItems({ inputValue: '' });
          return {
            ...changes,
            inputValue: '', // reset input value to show placeholder on focus
          };
        }
        case useCombobox.stateChangeTypes.InputChange: {
          const leadingWhitespaceTest = /^\s+/g;
          if (changes.inputValue?.match(leadingWhitespaceTest))
            setInputValue(
              changes.inputValue.replace(leadingWhitespaceTest, ''),
            );
          else {
            fetchItems(changes.inputValue ?? '');
            filterListItems({ inputValue: changes.inputValue ?? '' });
          }
          return changes;
        }
        default:
          return changes;
      }
    },
    [fetchItems, filterListItems], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const {
    isOpen,
    openMenu,
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
    items: listItems,
    selectedItem: value,
    itemToString,
    stateReducer,
    onStateChange({ type, selectedItem: clickedItem }) {
      switch (type) {
        // @ts-expect-error This falltrough is wanted
        case useCombobox.stateChangeTypes.InputBlur:
          if (!selectOnBlur) break;
        case useCombobox.stateChangeTypes.InputKeyDownEnter: // eslint-disable-line no-fallthrough
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
              inputRef.current?.focus();
              if (typeof initialItems === 'function')
                fetchItems(inputValue ?? '');
            }}
            getToggleButtonProps={getToggleButtonProps}
          />
        }
        disableLabelAnimation={disableLabelAnimation}
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
        listItems={listItems}
        highlightedIndex={highlightedIndex}
        listStyle={listStyle}
        getMenuProps={getMenuProps}
        getItemProps={getItemProps}
        loading={loading}
      />
    </div>
  );
};
