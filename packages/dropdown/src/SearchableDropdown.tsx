/* eslint-disable  no-warning-comments */
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { UseComboboxStateChangeOptions, useCombobox } from 'downshift';
import classNames from 'classnames';
import { useFloating, autoUpdate, offset, flip } from '@floating-ui/react-dom';

import { BaseFormControl } from '@entur/form';
import { space } from '@entur/tokens';
import { VariantType } from '@entur/utils';

import { DropdownList } from './components/DropdownList';
import { FieldAppend } from './components/FieldComponents';

import { useResolvedItems } from './useResolvedItems';
import {
  EMPTY_INPUT,
  getA11yStatusMessage,
  isFunctionWithQueryArgument,
  itemToString,
  lowerCaseFilterTest,
  noFilter,
} from './utils';

import {
  NormalizedDropdownItemType,
  PotentiallyAsyncDropdownItemType,
} from './types';

import './Dropdown.scss';

/** @deprecated use variant="information" instead */
const info = 'info';
/** @deprecated use variant="negative" instead */
const error = 'error';

export type SearchableDropdownProps<ValueType> = {
  /** Tilgjengelige valg i dropdown-en */
  items: PotentiallyAsyncDropdownItemType<ValueType>;
  /** Valgt element. Bruk null for ingen verdi */
  selectedItem: NormalizedDropdownItemType<ValueType> | null;
  /** Callback ved valg som skal brukes til å oppdatere selectedItem */
  onChange?: (
    selectedItem: NormalizedDropdownItemType<ValueType> | null,
  ) => void | Dispatch<
    SetStateAction<NormalizedDropdownItemType<ValueType> | null>
  >;
  /** Filtreringen som brukes når man skriver inn tekst i inputfeltet
   * @default Regex-test som sjekker om item.label inneholder input-teksten
   */
  itemFilter?: (
    item: NormalizedDropdownItemType<ValueType>,
    inputValue: string | undefined,
  ) => boolean;
  /** Beskrivende tekst som forklarer feltet */
  label: string;
  /** Placeholder-tekst når ingenting er satt */
  placeholder?: string;
  /** Vis knapp for å nullstille Dropdown-en skal vises
   * @default true
   */
  clearable?: boolean;
  /** Plasserer labelen statisk på toppen av inputfeltet
   * @default false
   */
  disableLabelAnimation?: boolean;
  /** Antall millisekunder man venter etter tekstinput før det gjøres kall for å oppdatere items
   * Denne er kun relevant hvis du sender inn en funksjon som items.
   */
  debounceTimeout?: number;
  /** Deaktiver dropdown-en */
  disabled?: boolean;
  /** Lar brukeren velge ved å "tab-e" seg ut av komponenten */
  selectOnTab?: boolean;
  /**
   * @deprecated
   * Bruk selectOnTab i stedet
   *
   * Lar brukeren velge ved å "tab-e" seg ut av komponenten */
  selectOnBlur?: boolean;
  /** Tekst som kommer opp når det ikke er noe treff på filtreringsøket
   * @default "Ingen treff for søket"
   */
  noMatchesText?: string;
  /** Gjør dropdown-en til å kun kunne leses
   * @default false
   */
  readOnly?: boolean;
  /** Tekst eller ikon som kommer før dropdown-en */
  prepend?: React.ReactNode;
  /** En tekst som beskriver hva som skjer når man venter på items */
  loadingText?: string;
  /** Hvilken valideringsvariant som gjelder*/
  variant?: VariantType | typeof error | typeof info;
  /** Valideringsmelding, brukes sammen med `variant` */
  feedback?: string;
  className?: string;
  style?: { [key: string]: any };
  /** Style som kun påføres listeelementet */
  listStyle?: { [key: string]: any };
  /** Tekst som beskriver at man fjerner valget sitt
   * @default "fjern valgt"
   */
  labelClearSelectedItem?: string;
  /** En tooltip som gir ekstra info om inputfeltet */
  labelTooltip?: React.ReactNode;
  /** Tekst for skjemleser for knapp som lukker listen med valg
   * @default "Lukk liste med valg"
   */
  ariaLabelCloseList?: string;
  /** Tekst for skjemleser for knapp som åpner listen med valg
   * @default "Åpne liste med valg"
   */
  ariaLabelOpenList?: string;
  /** Ord for at et element er valgt i entall
   * eks. 'Element 1, _valgt_'
   * @default "valgt"
   */
  ariaLabelChosenSingular?: string;
  /** Tekst for skjermleser som beskriver statusen til et element som valgt
   * @default ", valgt element, trykk for å fjerne"
   */
  ariaLabelSelectedItem?: string;
};

export const SearchableDropdown = <ValueType extends NonNullable<any>>({
  ariaLabelChosenSingular,
  ariaLabelCloseList,
  ariaLabelOpenList,
  ariaLabelSelectedItem,
  className,
  clearable = true,
  debounceTimeout,
  disabled = false,
  disableLabelAnimation = false,
  feedback,
  items: initialItems,
  itemFilter = isFunctionWithQueryArgument(initialItems)
    ? noFilter
    : lowerCaseFilterTest,
  label,
  labelClearSelectedItem = 'fjern valgt',
  labelTooltip,
  listStyle,
  loadingText,
  noMatchesText,
  onChange = () => undefined,
  placeholder,
  prepend,
  readOnly = false,
  selectedItem: value,
  selectOnBlur = false,
  selectOnTab = false,
  style,
  variant = 'info',
  ...rest
}: SearchableDropdownProps<ValueType>) => {
  const [showSelectedItem, setShowSelectedItem] = useState(value !== null);
  const [lastHighlightedIndex, setLastHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    items: normalizedItems,
    loading,
    fetchItems,
  } = useResolvedItems(initialItems, debounceTimeout);

  const [listItems, setListItems] = useState(normalizedItems);

  const filterListItems = ({ inputValue }: { inputValue: string }) =>
    setListItems(normalizedItems.filter(item => itemFilter(item, inputValue)));

  const updateListItems = ({ inputValue }: { inputValue?: string }) => {
    const shouldRefetchItems = isFunctionWithQueryArgument(initialItems);
    if (shouldRefetchItems) fetchItems(inputValue ?? EMPTY_INPUT);

    filterListItems({ inputValue: inputValue ?? EMPTY_INPUT });
  };

  const inputHasFocus =
    typeof document !== 'undefined'
      ? inputRef?.current === document?.activeElement
      : false;

  useEffect(() => {
    filterListItems({ inputValue });
  }, [normalizedItems]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // sync internal state on initial render
    if (selectedItem !== null && !inputHasFocus) {
      setShowSelectedItem(true);
      updateListItems({ inputValue: EMPTY_INPUT });
      setInputValue(EMPTY_INPUT);
    }
  }, []);

  const stateReducer = useCallback(
    (
      _,
      {
        type,
        changes,
      }: UseComboboxStateChangeOptions<NormalizedDropdownItemType<ValueType>>,
    ) => {
      if (
        changes.highlightedIndex !== undefined &&
        changes?.highlightedIndex >= 0
      ) {
        setLastHighlightedIndex(changes?.highlightedIndex);
      }

      switch (type) {
        // empty input to show selected item and reset dropdown list on item selection
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.InputBlur: {
          updateListItems({ inputValue: EMPTY_INPUT });
          return {
            ...changes,
            inputValue: EMPTY_INPUT,
          };
        }
        case useCombobox.stateChangeTypes.ControlledPropUpdatedSelectedItem:
          if (changes.selectedItem !== null && !inputHasFocus)
            setShowSelectedItem(true);
          updateListItems({ inputValue: EMPTY_INPUT });
          return {
            ...changes,
            inputValue: EMPTY_INPUT,
          };
        // remove leading whitespace, select element with spacebar on empty input, and filter list based on input
        case useCombobox.stateChangeTypes.InputChange: {
          const leadingWhitespaceTest = /^\s+/g;
          const isSpacePressedOnEmptyInput = changes.inputValue === ' ';
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
            setHighlightedIndex(0);
            setLastHighlightedIndex(0);
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
    highlightedIndex,
    setHighlightedIndex,
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
    onStateChange({ type, selectedItem: newSelectedItem }) {
      switch (type) {
        // @ts-expect-error This falltrough is wanted
        case useCombobox.stateChangeTypes.InputBlur:
          if (!selectOnBlur) break;
        case useCombobox.stateChangeTypes.InputKeyDownEnter: // eslint-disable-line no-fallthrough
        case useCombobox.stateChangeTypes.ItemClick:
          if (newSelectedItem === undefined) return;
          onChange(newSelectedItem ?? null);
      }
    },
    // Accessibility
    getA11yStatusMessage: options =>
      getA11yStatusMessage({ ...options, resultCount: listItems.length }),
    ...rest,
  });

  const { refs, floatingStyles } = useFloating({
    whileElementsMounted: (ref, float, update) =>
      autoUpdate(ref, float, update),
    placement: 'bottom-start',
    open: isOpen,
    middleware: [offset(space.extraSmall2), flip()],
  });

  const handleOnClear = () => {
    onChange(null);
    setInputValue(EMPTY_INPUT);
    inputRef.current?.focus();
    updateListItems({ inputValue });
    setShowSelectedItem(false);
  };

  return (
    <BaseFormControl
      append={
        <FieldAppend
          ariaLabelCloseList={ariaLabelCloseList}
          ariaLabelOpenList={ariaLabelOpenList}
          clearable={clearable}
          labelClearSelectedItems={labelClearSelectedItem}
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
      className={classNames(
        'eds-dropdown',
        'eds-dropdown--searchable',
        className,
        {
          'eds-dropdown--has-tooltip': labelTooltip !== undefined,
        },
      )}
      disabled={disabled}
      disableLabelAnimation={disableLabelAnimation}
      feedback={feedback}
      isFilled={selectedItem !== null || inputValue !== EMPTY_INPUT}
      label={label}
      labelId={getLabelProps().id}
      labelProps={getLabelProps()}
      labelTooltip={labelTooltip}
      onClick={(e: React.MouseEvent) => {
        if (e.target === e.currentTarget) inputRef.current?.focus();
      }}
      prepend={prepend}
      readOnly={readOnly}
      ref={refs.setReference}
      style={style}
      variant={variant}
      {...rest}
    >
      <span
        className={classNames('eds-dropdown--searchable__selected-item', {
          'eds-dropdown--searchable__selected-item--hidden': !showSelectedItem,
        })}
        aria-hidden="true"
        onClick={() => {
          inputRef.current?.focus();
          openMenu();
        }}
      >
        {showSelectedItem ? selectedItem?.label : ''}
      </span>
      <input
        className={classNames('eds-dropdown__input eds-form-control', {
          'eds-dropdown__input--hidden': showSelectedItem,
        })}
        disabled={readOnly || disabled}
        placeholder={selectedItem?.label ?? placeholder}
        {...getInputProps({
          onBlur: () => {
            if (selectedItem !== null) setShowSelectedItem(true);
          },
          onFocus: () => {
            setShowSelectedItem(false);
          },
          onKeyDown: e => {
            if (selectOnTab && isOpen && e.key === 'Tab')
              onChange?.(listItems[highlightedIndex]);
          },
          ref: inputRef,
        })}
      />
      <DropdownList
        ariaLabelChosenSingular={ariaLabelChosenSingular}
        ariaLabelSelectedItem={ariaLabelSelectedItem}
        getItemProps={getItemProps}
        getMenuProps={getMenuProps}
        highlightedIndex={highlightedIndex}
        isOpen={isOpen}
        listItems={listItems}
        listStyle={{ ...floatingStyles, ...listStyle }}
        listRef={refs.setFloating}
        loading={loading}
        loadingText={loadingText}
        noMatchesText={noMatchesText}
        selectedItems={selectedItem !== null ? [selectedItem] : []}
      />
    </BaseFormControl>
  );
};
