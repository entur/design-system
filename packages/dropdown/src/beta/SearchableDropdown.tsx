/* eslint-disable  no-warning-comments */
import React, { useRef, useState } from 'react';
import { UseComboboxStateChangeOptions, useCombobox } from 'downshift';
import classNames from 'classnames';

import { BaseFormControl, VariantType } from '@entur/form';

import { DropdownList } from './components/DropdownList';
import { FieldAppend } from './components/FieldComponents';

import { NormalizedDropdownItemType } from './useNormalizedItems';
import {
  PotentiallyAsyncDropdownItemType,
  useResolvedItems,
} from './useResolvedItems';
import { EMPTY_INPUT, itemToString, lowerCaseFilterTest } from './utils';

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
  /** Deaktiver dropdown-en */
  disabled?: boolean;
  /** Gjør dropdown-en til å kun kunne leses
   * @default false
   */
  readOnly?: boolean;
  /** Tekst eller ikon som kommer før dropdown-en */
  prepend?: React.ReactNode;
  /** En tekst som beskriver hva som skjer når man venter på items */
  loadingText?: string;
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

export const SearchableDropdownBeta = ({
  className,
  clearable = false,
  debounceTimeout,
  disabled = false,
  disableLabelAnimation = false,
  feedback,
  itemFilter = lowerCaseFilterTest,
  items: initialItems,
  label,
  listStyle,
  loadingText,
  onChange,
  openOnFocus = false,
  placeholder,
  prepend,
  readOnly = false,
  selectedItem: value,
  selectOnBlur = false,
  style,
  variant = 'info',
  ...rest
}: SearchableDropdownProps) => {
  const [hideSelectedItem, setHideSelectedItem] = useState(false);
  const [lastHighlightedIndex, setLastHighlightedIndex] = React.useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    items: normalizedItems,
    loading,
    fetchItems,
  } = useResolvedItems(initialItems, debounceTimeout);

  const [listItems, setListItems] = React.useState(normalizedItems);

  const filterListItems = ({ inputValue }: { inputValue: string }) =>
    setListItems(normalizedItems.filter(item => itemFilter(item, inputValue)));

  const updateListItems = ({ inputValue }: { inputValue?: string }) => {
    if (typeof initialItems === 'function')
      fetchItems(inputValue ?? EMPTY_INPUT); // fetch items only if user provides a function as items
    filterListItems({ inputValue: inputValue ?? EMPTY_INPUT });
  };

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
      if (
        changes.highlightedIndex !== undefined &&
        changes?.highlightedIndex >= 0
      ) {
        setLastHighlightedIndex(changes?.highlightedIndex);
      }

      switch (type) {
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.InputBlur:
        case useCombobox.stateChangeTypes.ControlledPropUpdatedSelectedItem: {
          filterListItems({ inputValue: EMPTY_INPUT });
          return {
            ...changes,
            inputValue: EMPTY_INPUT, // reset input value to show placeholder on focus
          };
        }
        case useCombobox.stateChangeTypes.InputChange: {
          const leadingWhitespaceTest = /^\s+/g;
          const isSpacePressedOnEmptyInput = changes.inputValue == ' ';
          if (changes.inputValue?.match(leadingWhitespaceTest)) {
            setInputValue(
              changes.inputValue.replace(leadingWhitespaceTest, EMPTY_INPUT),
            );

            if (isSpacePressedOnEmptyInput) {
              openMenu();

              if (isOpen && changes.highlightedIndex !== undefined) {
                onChange(listItems[changes.highlightedIndex]);
              }
            }
          } else {
            updateListItems({ inputValue: changes.inputValue });
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
    defaultHighlightedIndex: lastHighlightedIndex,
    items: listItems,
    itemToString,
    selectedItem: value,
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

  const handleOnClear = () => {
    onChange(null);
    setInputValue(EMPTY_INPUT);
    inputRef.current?.focus();
    updateListItems({ inputValue });
  };

  return (
    <div className="eds-dropdown__wrapper">
      <BaseFormControl
        append={
          <FieldAppend
            clearable={clearable}
            clearSelectedItemsLabel="Fjern valgt"
            disabled={readOnly || disabled}
            focusable={false}
            getToggleButtonProps={getToggleButtonProps}
            isOpen={isOpen}
            loading={loading}
            loadingText={loadingText}
            onClear={handleOnClear}
            selectedItems={[selectedItem]}
          />
        }
        className={classNames('eds-dropdown', className)}
        disabled={disabled}
        disableLabelAnimation={disableLabelAnimation}
        feedback={feedback}
        isFilled={selectedItem || inputValue !== EMPTY_INPUT}
        label={label}
        labelProps={getLabelProps()}
        prepend={prepend}
        readOnly={readOnly}
        style={style}
        variant={variant}
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
          className="eds-dropdown__input eds-form-control"
          disabled={readOnly || disabled}
          placeholder={selectedItem?.label ?? placeholder}
          {...getInputProps({
            onBlur: () => {
              setHideSelectedItem(false);
            },
            onFocus: () => {
              if (!isOpen && openOnFocus) openMenu();
              setHideSelectedItem(true);
            },
            ref: inputRef,
          })}
        />
      </BaseFormControl>
      <DropdownList
        isOpen={isOpen}
        listItems={listItems}
        listStyle={listStyle}
        loading={loading}
        loadingText={loadingText}
        getItemProps={getItemProps}
        getMenuProps={getMenuProps}
        highlightedIndex={highlightedIndex}
        selectedItems={selectedItem !== null ? [selectedItem] : []}
      />
    </div>
  );
};
