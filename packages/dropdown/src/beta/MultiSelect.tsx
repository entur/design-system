import React, { useRef, useState } from 'react';
import classNames from 'classnames';
import {
  useMultipleSelection,
  useCombobox,
  UseComboboxStateChangeOptions,
} from 'downshift';

import { BaseFormControl, VariantType } from '@entur/form';
import { useRandomId } from '@entur/utils';

import { NormalizedDropdownItemType } from '../useNormalizedItems';
import {
  PotentiallyAsyncDropdownItemType,
  useResolvedItems,
} from '../useResolvedItems';
import { FieldAppend, SelectedItemTag } from './components/FieldComponents';
import { DropdownList } from './components/DropdownList';
import {
  itemToString,
  lowerCaseFilterTest,
  useMultiselectUtils,
} from './utils';

import './Dropdown.scss';

export type MultiSelectBetaProps = {
  /** Tilgjengelige valg i MultiSelect */
  items: PotentiallyAsyncDropdownItemType;
  /** Elementer som er valgt blant 'items'.
   *  Denne skal oppdateres av onChange.
   */
  selectedItems: NormalizedDropdownItemType[];
  /** Callback med alle valgte verdier.
   *  Bruk denne til å oppdatere selectedItems-listen */
  onChange: (selectedItems: NormalizedDropdownItemType[]) => void;
  /** Beskrivende tekst som forklarer feltet */
  label?: string;
  /** Hvilken valideringsvariant som gjelder */
  variant?: VariantType;
  /** Valideringsmelding, brukes sammen med `variant` */
  feedback?: string;
  /** Tekst eller ikon som kommer før MultiSelect */
  prepend?: React.ReactNode;
  /** Om dropdown-en er deaktivert */
  disabled?: boolean;
  /** Om dropdown-en er i read-only modus */
  readOnly?: boolean;
  /** Placeholder-tekst når ingenting er satt */
  placeholder?: string;
  /** En tekst som beskriver hva som skjer når man venter på items */
  loadingText?: string;
  /** Om man skal vise items ved fokusering av input-feltet, før man skriver inn noe
   * @default false
   */
  openOnFocus?: boolean;
  /** Skjuler «Velg alle» fra listen med valg
   * @default false
   */
  hideSelectAll?: boolean;
  /** Teksten som vises for «Velg alle»-elementet i listen
   * @default "Velg alle"
   */
  selectAllLabel?: string;
  /** Teksten som vises for «Velg alle»-elementet i listen
   * @default "Alle valgt"
   */
  allItemsSelectedLabel?: string;
  /** Skjermleser-tekst som for å fjerne alle valg
   * @default "Fjern valgte"
   */
  removeAllItemsAriaLabel?: string;
  /** Ekstra klassenavn */
  className?: string;
  /** Tekst for skjemleser på knapper for å fjerne valgt element
   * @default "trykk for å fjerne valg"
   */
  ariaLabelRemoveSelected?: string;
  /** Styling som sendes ned til MultiSelect-lista */
  listStyle?: { [key: string]: any };
  /** Antall millisekunder man venter før man kaller en potensiell items-funksjon
   * @default 250
   */
  debounceTimeout?: number;
  maxTags?: number;
  /** Om en knapp for å fjerne alle valg skal vises
   * @default false
   */
  clearable?: boolean;
  selectOnBlur?: boolean;
  readonly?: boolean;
  loading?: boolean;
  style?: React.CSSProperties;
};

export const MultiSelectBeta = ({
  ariaLabelRemoveSelected = 'trykk for å fjerne valg',
  className,
  clearable = false,
  debounceTimeout,
  feedback,
  hideSelectAll = false,
  items: initialItems,
  label,
  listStyle,
  maxTags = 10,
  onChange,
  openOnFocus = false,
  placeholder,
  readonly = false,
  selectAllLabel = 'Velg alle',
  allItemsSelectedLabel = 'Alle valgt',
  removeAllItemsAriaLabel = 'Fjern valgte',
  selectedItems,
  selectOnBlur = false,
  style,
  variant = 'info',
  ...rest
}: MultiSelectBetaProps) => {
  const [lastHighlightedIndex, setLastHighlightedIndex] = React.useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    items: normalizedItems,
    loading,
    fetchItems,
  } = useResolvedItems(initialItems);

  const isAllNonAsyncItemsSelected =
    typeof initialItems !== 'function' &&
    selectedItems.length === normalizedItems.length;

  const selectAll: NormalizedDropdownItemType = {
    value: useRandomId('select-all'),
    label: selectAllLabel,
  };
  const summarySelectedItems: NormalizedDropdownItemType = React.useMemo(
    () => ({
      value: '',
      label: isAllNonAsyncItemsSelected
        ? allItemsSelectedLabel
        : selectedItems.length + ' valgte',
    }),
    [isAllNonAsyncItemsSelected, selectedItems, normalizedItems],
  );

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
  }, [normalizedItems]); // eslint-disable-line react-hooks/exhaustive-deps
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
    [hideSelectAll, normalizedItems, filterListItems, initialItems], // eslint-disable-line react-hooks/exhaustive-deps
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
      // clickedItem means item chosen either via mouse or keyboard
      if (!clickedItem) return;

      switch (type) {
        // @ts-expect-error This falltrough is wanted
        case useCombobox.stateChangeTypes.InputBlur:
          if (!selectOnBlur) break;
        case useCombobox.stateChangeTypes.InputKeyDownEnter: // eslint-disable-line no-fallthrough
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

  const handleOnClear = () => {
    onChange([]);
    setInputValue('');
    inputRef.current?.focus();
    if (typeof initialItems === 'function') fetchItems(inputValue ?? '');
  };

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
            clearSelectedItemsLabel={removeAllItemsAriaLabel}
            loading={loading}
            loadingText={''}
            readOnly={readonly}
            onClear={handleOnClear}
            getToggleButtonProps={getToggleButtonProps}
          />
        }
        className={classNames('eds-dropdown', className)}
        label={label}
        isFilled={hasSelectedItems || inputValue !== ''}
        feedback={feedback}
        variant={variant}
        readOnly={readonly}
        style={style}
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
            if (e.target === e.currentTarget) inputRef.current?.focus();
          }}
        >
          {selectedItems.length < maxTags ? (
            selectedItems.map((selectedItem, index) => (
              <SelectedItemTag
                index={index}
                key={selectedItem.value}
                getSelectedItemProps={getSelectedItemProps}
                selectedItem={selectedItem}
                removeSelectedItem={removeSelectedItem}
                ariaLabelRemoveSelected={ariaLabelRemoveSelected}
              />
            ))
          ) : (
            <SelectedItemTag
              selectedItem={summarySelectedItems}
              removeSelectedItem={handleOnClear}
              ariaLabelRemoveSelected={removeAllItemsAriaLabel}
            />
          )}
          <input
            placeholder={placeholder}
            className="eds-dropdown__input eds-form-control"
            role="combobox" // eslint-disable-line jsx-a11y/role-has-required-aria-props
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
