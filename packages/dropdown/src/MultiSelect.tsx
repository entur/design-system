import React, { useRef, useState } from 'react';
import classNames from 'classnames';
import {
  useMultipleSelection,
  useCombobox,
  UseComboboxStateChangeOptions,
  A11yStatusMessageOptions,
} from 'downshift';

import { VisuallyHidden } from '@entur/a11y';
import { BaseFormControl, VariantType } from '@entur/form';
import { useRandomId } from '@entur/utils';

import { FieldAppend, SelectedItemTag } from './components/FieldComponents';
import { DropdownList } from './components/DropdownList';

import { NormalizedDropdownItemType } from './useNormalizedItems';
import {
  PotentiallyAsyncDropdownItemType,
  useResolvedItems,
} from './useResolvedItems';
import {
  EMPTY_INPUT,
  getA11yRemovalMessage,
  getA11ySelectionMessage,
  getA11yStatusMessage,
  isVoiceOverClick,
  itemToString,
  lowerCaseFilterTest,
  useMultiselectUtils,
} from './utils';

import './Dropdown.scss';

export type MultiSelectProps = {
  /** Tilgjengelige valg i MultiSelect */
  items: PotentiallyAsyncDropdownItemType;
  /** Elementer som er valgt blant 'items'. Bruk tom liste for ingen valgte
   */
  selectedItems: NormalizedDropdownItemType[];
  /** Callback med alle valgte verdier.
   *  Bruk denne til å oppdatere selectedItems-listen */
  onChange?: (selectedItems: NormalizedDropdownItemType[]) => void;
  /** Filtreringen som brukes når man skriver inn tekst i inputfeltet
   * @default Regex-test som sjekker om item.label inneholder input-teksten
   */
  itemFilter?: (
    item: NormalizedDropdownItemType,
    inputValue: string | undefined,
  ) => boolean;
  /** Beskrivende tekst som forklarer feltet */
  label?: string;
  /** Hvilken valideringsvariant som gjelder */
  variant?: VariantType;
  /** Valideringsmelding, brukes sammen med `variant` */
  feedback?: string;
  /** Om dropdown-en er deaktivert */
  disabled?: boolean;
  /** Om dropdown-en er i read-only modus */
  readOnly?: boolean;
  /** Om en knapp for å fjerne alle valg skal vises
   * @default true
   */
  clearable?: boolean;
  /** Placeholder-tekst når ingenting er satt */
  placeholder?: string;
  /** En tekst som beskriver hva som skjer når man venter på items
   * @default "Laster inn …"
   */
  loadingText?: string;
  /** Tekst som kommer opp når det ikke er noe treff på filtreringsøket
   * @default "Ingen treff for søket"
   */
  noMatchesText?: string;
  /** Skjuler «Velg alle» fra listen med valg
   * @default false
   */
  hideSelectAll?: boolean;
  /** Antall millisekunder man venter før man kaller en potensiell items-funksjon
   * @default 250
   */
  debounceTimeout?: number;
  /** Maks antall individuelle valgt-element-tags i MultiSelect-en før de blir til en samle-tag
   * @default 10
   */
  maxTags?: number;
  /** Tekst eller ikon som kommer før MultiSelect */
  prepend?: React.ReactNode;
  /** Resetter input etter at et element er valgt i listen
   * @default false
   */
  clearInputOnSelect?: boolean;
  /** Lar brukeren velge ved å "tab-e" seg ut av komponenten */
  selectOnBlur?: boolean;
  style?: React.CSSProperties;
  /** Styling som sendes ned til MultiSelect-lista */
  listStyle?: { [key: string]: any };
  /** Ekstra klassenavn */
  className?: string;
  /** Teksten som vises for «Velg alle»-elementet i listen
   * @default "Velg alle"
   */
  labelSelectAll?: string;
  /** Teksten som vises for «Velg alle»-elementet i listen
   * @default "Alle valgt"
   */
  labelAllItemsSelected?: string;
  /** Skjermleser-tekst som for å fjerne alle valg
   * @default "Fjern valgte"
   */
  labelClearAllItems?: string;
  /** Tekst for skjemleser på knapper for å fjerne valgt element
   * @default "trykk for å fjerne valg"
   */
  ariaLabelRemoveSelected?: string;
  /** Tekst for skjemleser for å indikere at et element er valgt
   * @default "valgt"
   */
  ariaLabelChosenSingular?: string;
  /** Tekst for skjemleser for å indikere at et element er valgt
   * @default "valgte"
   */
  ariaLabelChosenPlural?: string;
  /** Tekst for skjemleser for knapp som lukker listen med valg
   * @default "Lukk liste med valg"
   */
  ariaLabelCloseList?: string;
  /** Tekst for skjemleser for knapp som åpner listen med valg
   * @default "Åpne liste med valg"
   */
  ariaLabelOpenList?: string;
  /** Tekst for skjemleser for å hoppe til input-feltet
   * @default `${selectedItems.length} valgte elementer, trykk for å hoppe til tekstfeltet`
   */
  ariaLabelJumpToInput?: string;
  /** Tekst for skjemleser for å indikere at et element i listen er valgt
   * @default ", valgt element, trykk for å fjerne"
   */
  ariaLabelSelectedItem?: string;
};

export const MultiSelect = ({
  className,
  clearable = true,
  clearInputOnSelect = false,
  debounceTimeout,
  disabled = false,
  feedback,
  hideSelectAll = false,
  itemFilter = lowerCaseFilterTest,
  items: initialItems,
  label,
  labelAllItemsSelected = 'Alle valgt',
  labelClearAllItems = 'Fjern valgte',
  labelSelectAll = 'Velg alle',
  listStyle,
  loadingText,
  maxTags = 10,
  noMatchesText,
  onChange = () => undefined,
  placeholder,
  readOnly = false,
  selectedItems,
  selectOnBlur = false,
  style,
  variant = 'info',
  ariaLabelChosenSingular = 'valgt',
  ariaLabelChosenPlural = 'valgte',
  ariaLabelCloseList,
  ariaLabelJumpToInput = `${selectedItems.length} valgte elementer, trykk for å hoppe til tekstfeltet`,
  ariaLabelOpenList,
  ariaLabelRemoveSelected = 'trykk for å fjerne valg',
  ariaLabelSelectedItem = ', valgt element, trykk for å fjerne',
  ...rest
}: MultiSelectProps) => {
  const [lastHighlightedIndex, setLastHighlightedIndex] = React.useState(0);
  const [lastRemovedItem, setLastRemovedItem] = React.useState<
    NormalizedDropdownItemType | undefined
  >(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    items: normalizedItems,
    loading,
    fetchItems,
  } = useResolvedItems(initialItems, debounceTimeout);

  const isAllNonAsyncItemsSelected =
    typeof initialItems !== 'function' &&
    selectedItems.length === normalizedItems.length;

  // special 'item' used as Select All entry in the dropdown list
  const selectAll: NormalizedDropdownItemType = {
    value: useRandomId('select-all'),
    label: labelSelectAll,
  };
  // special 'item' used as a replacement selected item tag for when
  // there are more selected element than maxTags
  const summarySelectedItems: NormalizedDropdownItemType = React.useMemo(
    () => ({
      value: EMPTY_INPUT,
      label: isAllNonAsyncItemsSelected
        ? labelAllItemsSelected
        : selectedItems.length + ' ' + ariaLabelChosenPlural,
    }),
    [
      isAllNonAsyncItemsSelected,
      selectedItems,
      labelAllItemsSelected,
      ariaLabelChosenPlural,
    ],
  );

  const [listItems, setListItems] = useState([
    ...(!hideSelectAll ? [selectAll] : []),
    ...normalizedItems,
  ]);

  const filterListItems = ({ inputValue }: { inputValue: string }) =>
    setListItems([
      ...(!hideSelectAll ? [selectAll] : []),
      ...normalizedItems.filter(item => itemFilter(item, inputValue)),
    ]);

  const updateListItems = ({ inputValue }: { inputValue?: string }) => {
    if (typeof initialItems === 'function')
      fetchItems(inputValue ?? EMPTY_INPUT); // fetch items only if user provides a function as items
    filterListItems({ inputValue: inputValue ?? EMPTY_INPUT });
  };

  React.useEffect(() => {
    filterListItems({ inputValue });
  }, [normalizedItems]); // eslint-disable-line react-hooks/exhaustive-deps

  const { hasSelectedItems, handleListItemClicked, selectAllCheckboxState } =
    useMultiselectUtils({
      listItems,
      selectAll,
      selectedItems,
    });

  const { getSelectedItemProps, getDropdownProps } = useMultipleSelection({
    selectedItems,
    itemToString,
    // Accessibility
    getA11yRemovalMessage: options =>
      getA11yRemovalMessage({
        ...options,
        selectAllItem: selectAll,
        removedItem: lastRemovedItem,
      }),
  });

  const stateReducer = React.useCallback(
    (
      _,
      {
        changes,
        type,
      }: UseComboboxStateChangeOptions<NormalizedDropdownItemType>,
    ) => {
      if (
        changes.highlightedIndex !== undefined &&
        changes?.highlightedIndex >= 0
      ) {
        setLastHighlightedIndex(changes?.highlightedIndex);
      }

      switch (type) {
        // keep menu open and edit input value on item selection
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick: {
          if (clearInputOnSelect) {
            updateListItems({ inputValue: EMPTY_INPUT });
          }
          return {
            ...changes,
            isOpen: true,
            inputValue: clearInputOnSelect
              ? EMPTY_INPUT
              : inputRef?.current?.value ?? EMPTY_INPUT,
          };
        }
        // edit input value when selected items is updated outside component
        case useCombobox.stateChangeTypes.ControlledPropUpdatedSelectedItem: {
          return {
            ...changes,
            inputValue: clearInputOnSelect
              ? EMPTY_INPUT
              : inputRef?.current?.value ?? EMPTY_INPUT,
          };
        }
        // remove leading whitespace, select item with spacebar if input is empty and filter list items
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
                handleListItemClicked({
                  clickedItem: listItems[changes.highlightedIndex],
                  onChange,
                  setLastRemovedItem,
                });
              }
            }
          } else {
            updateListItems({ inputValue: changes.inputValue });
          }

          return changes;
        }
        // reset input value when leaving input field
        case useCombobox.stateChangeTypes.InputBlur: {
          return {
            ...changes,
            inputValue: EMPTY_INPUT,
          };
        }
        default:
          return changes;
      }
    },
    [hideSelectAll, normalizedItems, filterListItems, initialItems], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const {
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
      // clickedItem means item chosen either via mouse or keyboard
      if (!clickedItem) return;

      switch (type) {
        // @ts-expect-error This falltrough is wanted
        case useCombobox.stateChangeTypes.InputBlur:
          if (!selectOnBlur) break;
        case useCombobox.stateChangeTypes.InputKeyDownEnter: // eslint-disable-line no-fallthrough
        case useCombobox.stateChangeTypes.ItemClick: {
          handleListItemClicked({ clickedItem, onChange, setLastRemovedItem });
        }
      }
    },
    // Accessibility
    getA11yStatusMessage: function <Item>(
      options: A11yStatusMessageOptions<Item>,
    ) {
      return getA11yStatusMessage<Item>({
        ...options,
        selectAllItemIncluded: !hideSelectAll,
      });
    },
    // The following A11y-helper does not work due to a bug (https://github.com/downshift-js/downshift/issues/1227)
    // but is left here for when it is fixed
    getA11ySelectionMessage: options =>
      getA11ySelectionMessage({ ...options, selectAllItem: selectAll }),
    ...rest,
  });

  const handleOnClear = () => {
    onChange([]);
    setInputValue(EMPTY_INPUT);
    inputRef.current?.focus();
    updateListItems({ inputValue });
  };

  return (
    <div
      className={classNames('eds-dropdown__wrapper', className)}
      style={style}
    >
      <BaseFormControl
        append={
          <FieldAppend
            ariaLabelCloseList={ariaLabelCloseList}
            ariaLabelOpenList={ariaLabelOpenList}
            selectedItems={selectedItems}
            isOpen={isOpen}
            clearable={clearable}
            labelClearSelectedItems={labelClearAllItems}
            focusable={false}
            loading={loading}
            loadingText={loadingText}
            disabled={readOnly || disabled}
            onClear={handleOnClear}
            getToggleButtonProps={getToggleButtonProps}
          />
        }
        className="eds-dropdown"
        disabled={disabled}
        feedback={feedback}
        isFilled={hasSelectedItems || inputValue !== EMPTY_INPUT}
        label={label}
        labelId={getLabelProps().id}
        labelProps={getLabelProps()}
        readOnly={readOnly}
        variant={variant}
        {...rest}
      >
        <div
          className={classNames('eds-dropdown__selected-items-and-input', {
            'eds-dropdown__selected-items-and-input--filled': hasSelectedItems,
          })}
          onClick={(e: React.MouseEvent) => {
            if (e.target === e.currentTarget) inputRef.current?.focus();
          }}
        >
          {selectedItems.length < maxTags ? (
            <>
              {selectedItems.length > 1 ? (
                <VisuallyHidden onClick={() => inputRef.current?.focus()}>
                  {ariaLabelJumpToInput}
                </VisuallyHidden>
              ) : (
                <></>
              )}
              {selectedItems.map((selectedItem, index) => (
                <SelectedItemTag
                  ariaLabelChosen={ariaLabelChosenSingular}
                  ariaLabelRemoveSelected={ariaLabelRemoveSelected}
                  disabled={disabled}
                  getSelectedItemProps={getSelectedItemProps}
                  index={index}
                  key={selectedItem.value}
                  readOnly={readOnly}
                  removeSelectedItem={() => {
                    handleListItemClicked({
                      clickedItem: selectedItem,
                      onChange,
                      setLastRemovedItem,
                    });
                    inputRef?.current?.focus();
                  }}
                  selectedItem={selectedItem}
                />
              ))}
            </>
          ) : (
            <SelectedItemTag
              ariaLabelRemoveSelected={labelClearAllItems}
              ariaLabelChosen=""
              disabled={disabled}
              readOnly={readOnly}
              removeSelectedItem={handleOnClear}
              selectedItem={summarySelectedItems}
            />
          )}
          <input
            placeholder={placeholder}
            className="eds-dropdown__input eds-form-control"
            disabled={readOnly || disabled}
            {...getInputProps(
              getDropdownProps({
                onClick: (e: React.MouseEvent) => {
                  if (!isOpen && isVoiceOverClick(e)) openMenu();
                },
                preventKeyAction: isOpen,
                ref: inputRef,
                value: inputValue ?? EMPTY_INPUT,
              }),
            )}
          />
        </div>
      </BaseFormControl>
      <DropdownList
        ariaLabelChosenSingular={ariaLabelChosenSingular}
        ariaLabelSelectedItem={ariaLabelSelectedItem}
        getItemProps={getItemProps}
        getMenuProps={getMenuProps}
        highlightedIndex={highlightedIndex}
        inputValue={inputValue}
        isOpen={isOpen}
        listItems={listItems}
        listStyle={listStyle}
        loading={loading}
        loadingText={loadingText}
        selectAllCheckboxState={selectAllCheckboxState}
        selectAllItem={selectAll}
        selectedItems={selectedItems}
      />
    </div>
  );
};
