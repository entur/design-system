import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import {
  useMultipleSelection,
  useCombobox,
  UseComboboxStateChangeOptions,
  UseComboboxState,
} from 'downshift';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  size,
} from '@floating-ui/react-dom';

import { VisuallyHidden } from '@entur/a11y';
import { BaseFormControl } from '@entur/form';
import { space } from '@entur/tokens';
import { mergeRefs, useRandomId } from '@entur/utils';

import {
  DropdownFieldAppendix,
  SelectedItemTag,
} from './components/FieldComponents';
import { DropdownList } from './components/DropdownList';

import { useResolvedItems } from './useResolvedItems';
import { DropdownProps } from './Dropdown';
import {
  clamp,
  EMPTY_INPUT,
  getA11yStatusMessage,
  isFunctionWithQueryArgument,
  itemToKey,
  itemToString,
  lowerCaseFilterTest,
  noFilter,
  useMultiselectUtils,
} from './utils';

import { NormalizedDropdownItemType } from './types';

import './Dropdown.scss';

export type MultiSelectProps<ValueType> = Omit<
  DropdownProps<ValueType>,
  'selectedItem' | 'onChange'
> & {
  /** Elementer som er valgt blant 'items'. Bruk tom liste for ingen valgte
   */
  selectedItems: NormalizedDropdownItemType<ValueType>[];
  /** Callback med alle valgte verdier.
   *  Bruk denne til å oppdatere selectedItems-listen */
  onChange?: (
    selectedItems: NormalizedDropdownItemType<ValueType>[],
  ) => void | Dispatch<SetStateAction<NormalizedDropdownItemType<ValueType>[]>>;
  /** Filtreringen som brukes når man skriver inn tekst i inputfeltet
   * @default Regex-test som sjekker om item.label inneholder input-teksten
   */
  itemFilter?: (
    item: NormalizedDropdownItemType<ValueType>,
    inputValue: string | undefined,
  ) => boolean;
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
  maxChips?: number;
  /** Resetter input etter at et element er valgt i listen
   * @default false
   */
  clearInputOnSelect?: boolean;
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
   * @default "valgte"
   */
  ariaLabelChosenPlural?: string;
  /** Tekst for skjemleser for å hoppe til input-feltet
   * @default `${selectedItems.length} valgte elementer, trykk for å hoppe til tekstfeltet`
   */
  ariaLabelJumpToInput?: string;
  /** Send din egen key til DropdownList items */
  itemKeyFn?: (
    item: NormalizedDropdownItemType<ValueType | string>,
    index: number,
  ) => string;
  /** Send din egen key til DropdownList iconitems */
  iconKeyFn?: (
    icon: React.ComponentType<any>,
    item: NormalizedDropdownItemType<ValueType | string>,
  ) => string;
};

export const MultiSelect = React.forwardRef(
  <ValueType extends NonNullable<any>>(
    {
      className,
      clearable = true,
      clearInputOnSelect = false,
      debounceTimeout,
      disabled = false,
      disableLabelAnimation,
      feedback,
      hideSelectAll = false,
      items: initialItems,
      itemFilter = isFunctionWithQueryArgument(initialItems)
        ? noFilter
        : lowerCaseFilterTest,
      label,
      labelAllItemsSelected = 'Alle valgt',
      labelClearAllItems = 'Fjern valgte',
      labelSelectAll = 'Velg alle',
      labelTooltip,
      listStyle,
      loading,
      loadingText = 'Laster resultater …',
      maxChips = 10,
      noMatchesText,
      onChange = () => undefined,
      placeholder,
      readOnly = false,
      selectedItems = [],
      selectOnBlur = false,
      selectOnTab = false,
      style,
      variant = 'information',
      ariaLabelChosenSingular,
      ariaLabelChosenPlural = 'valgte',
      ariaLabelCloseList = 'Lukk liste med valg',
      ariaLabelJumpToInput = `${selectedItems.length} valgte elementer, trykk for å hoppe til tekstfeltet`,
      ariaLabelOpenList = 'Åpne liste med valg',
      ariaLabelRemoveSelected = 'trykk for å fjerne valg',
      ariaLabelSelectedItem,
      iconKeyFn,
      itemKeyFn,
      ...rest
    }: MultiSelectProps<ValueType>,
    ref: React.ForwardedRef<HTMLInputElement>,
  ) => {
    const [lastHighlightedIndex, setLastHighlightedIndex] = React.useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      //@ts-expect-error this is done to aid developers debug wrong prop usage
      if (rest.selectedItem !== undefined)
        console.warn(
          "Incorrect 'selectedItem' prop found, did you mean to use 'selectedItems?",
        );
      //@ts-expect-error selectedItem should not actually exist in rest
    }, [rest.selectedItem]);

    const {
      items: normalizedItems,
      loading: resolvedItemsLoading,
      fetchItems,
    } = useResolvedItems(initialItems, debounceTimeout);

    const isAllNonAsyncItemsSelected =
      typeof initialItems !== 'function' &&
      selectedItems.length === normalizedItems.length;

    // special 'item' used as Select All entry in the dropdown list
    const selectAll: NormalizedDropdownItemType<string> = {
      value: useRandomId('select-all'),
      label: labelSelectAll,
    };
    // special 'item' used as a replacement selected item tag for when
    // there are more selected element than maxChips
    const summarySelectedItems: NormalizedDropdownItemType<string> =
      React.useMemo(
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
      const shouldRefetchItems = isFunctionWithQueryArgument(initialItems);
      if (shouldRefetchItems) fetchItems(inputValue ?? EMPTY_INPUT);

      filterListItems({ inputValue: inputValue ?? EMPTY_INPUT });
    };

    React.useEffect(() => {
      filterListItems({ inputValue });
    }, [normalizedItems]); // eslint-disable-line react-hooks/exhaustive-deps

    const { hasSelectedItems, handleListItemClicked, selectAllCheckboxState } =
      useMultiselectUtils<ValueType>({
        listItems,
        selectAll,
        selectedItems,
      });

    const { getSelectedItemProps, getDropdownProps } = useMultipleSelection({
      selectedItems,
      // @ts-expect-error prop missing from library types
      itemToString,
      itemToKey,
      onStateChange({ selectedItems: newSelectedItems }) {
        if (newSelectedItems !== undefined) onChange(newSelectedItems);
      },
    });

    const stateReducer = React.useCallback(
      (
        state: UseComboboxState<NormalizedDropdownItemType<ValueType | string>>,
        {
          changes,
          type,
        }: UseComboboxStateChangeOptions<
          NormalizedDropdownItemType<ValueType | string>
        >,
      ) => {
        if (
          changes.highlightedIndex !== undefined &&
          changes?.highlightedIndex >= 0
        ) {
          setLastHighlightedIndex(changes?.highlightedIndex);
        }

        switch (type) {
          // reset input value when leaving input field
          case useCombobox.stateChangeTypes.InputBlur:
            if (state.isOpen) inputRef.current?.focus();
            return {
              ...changes,
              inputValue: EMPTY_INPUT,
            };
          // keep menu open and edit input value on item selection
          case useCombobox.stateChangeTypes.InputKeyDownEnter:
          case useCombobox.stateChangeTypes.ItemClick: {
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
              inputValue: inputRef?.current?.value ?? EMPTY_INPUT,
            };
          }
          // remove leading whitespace, select item with spacebar if input is empty and filter list items
          case useCombobox.stateChangeTypes.InputChange: {
            const leadingWhitespaceTest = /^\s+/g;
            const isSpacePressedOnEmptyInput = changes.inputValue === ' ';
            if (changes.inputValue?.match(leadingWhitespaceTest)) {
              const sanitizedInputValue = changes.inputValue.replace(
                leadingWhitespaceTest,
                EMPTY_INPUT,
              );
              if (isSpacePressedOnEmptyInput) {
                if (!state.isOpen)
                  return {
                    ...changes,
                    inputValue: sanitizedInputValue,
                    isOpen: true,
                  };

                if (changes.highlightedIndex !== undefined) {
                  return {
                    ...changes,
                    inputValue: sanitizedInputValue,
                    selectedItem: listItems[changes.highlightedIndex],
                  };
                }
              }
            }

            return changes;
          }
          default:
            return changes;
        }
      },
      [hideSelectAll, normalizedItems, filterListItems, initialItems],
    );

    const {
      getInputProps,
      getItemProps,
      getLabelProps,
      getMenuProps,
      getToggleButtonProps,
      highlightedIndex,
      setHighlightedIndex,
      inputValue,
      isOpen,
      setInputValue,
    } = useCombobox({
      defaultHighlightedIndex: lastHighlightedIndex, // after selection, highlight previously selected item.
      items: listItems,
      itemToString,
      selectedItem: null,
      stateReducer,
      onInputValueChange(changes) {
        updateListItems({ inputValue: changes.inputValue });
        // set highlighted item to first item after search
        setHighlightedIndex(hideSelectAll ? 0 : 1);
        setLastHighlightedIndex(hideSelectAll ? 0 : 1);
      },
      onStateChange({ selectedItem: clickedItem }) {
        // clickedItem means item chosen either via mouse or keyboard
        if (!clickedItem) return;

        handleListItemClicked({
          clickedItem,
          onChange,
        });
      },
      // Accessibility
      getA11yStatusMessage: options =>
        getA11yStatusMessage({
          ...options,
          selectAllItemIncluded: !hideSelectAll,
          resultCount: listItems.length,
        }),
      ...rest,
    });

    // calculations for floating-UI popover position
    const { refs, floatingStyles, update } = useFloating({
      open: isOpen,
      placement: 'bottom-start',
      middleware: [
        offset(space.extraSmall2),
        shift({ padding: space.extraSmall }),
        size({
          apply({ rects, elements, availableHeight }) {
            Object.assign(elements.floating.style, {
              width: `${rects.reference.width}px`,
              // Floating will flip when smaller than 10*16 px
              // and never exceed 20*16 px.
              maxHeight: `${clamp(10 * 16, availableHeight, 20 * 16)}px`,
            });
          },
        }),
        flip({ fallbackStrategy: 'initialPlacement' }),
      ],
    });

    // Update floating-ui position on scroll etc. Floating-ui's autoupdate is usually used inside
    // the useFloating hook but this requires the floating element to be conditionally rendered.
    // Downshift doesn't work correctly when conditionally rendered since props and refs aren't correctly
    // spread to the component. We therefor use this useEffect to update position. See https://floating-ui.com/docs/autoupdate#usage
    useEffect(() => {
      if (isOpen && refs.reference.current && refs.floating.current) {
        return autoUpdate(
          refs.reference.current,
          refs.floating.current,
          update,
        );
      }
    }, [isOpen, refs.reference, refs.floating, update]);

    const handleOnClear = () => {
      onChange([]);
      setInputValue(EMPTY_INPUT);
      inputRef.current?.focus();
      updateListItems({ inputValue });
    };

    return (
      <BaseFormControl
        className={classNames(
          'eds-dropdown',
          'eds-dropdown--multiselect',
          className,
          { 'eds-dropdown--has-tooltip': labelTooltip !== undefined },
        )}
        disabled={disabled}
        disableLabelAnimation={disableLabelAnimation}
        feedback={feedback}
        isFilled={hasSelectedItems || inputValue !== EMPTY_INPUT}
        label={label}
        labelId={getLabelProps().id}
        labelProps={getLabelProps()}
        labelTooltip={labelTooltip}
        onBlur={() => setInputValue('')}
        onClick={(e: React.MouseEvent) => {
          if (e.target === e.currentTarget) {
            getInputProps()?.onClick?.(e);
          }
        }}
        readOnly={readOnly}
        ref={refs.setReference}
        style={style}
        variant={variant}
        after={
          <DropdownList
            ariaLabelChosenSingular={ariaLabelChosenSingular}
            ariaLabelSelectedItem={ariaLabelSelectedItem}
            floatingStyles={floatingStyles}
            getItemProps={getItemProps}
            getMenuProps={getMenuProps}
            highlightedIndex={highlightedIndex}
            isOpen={isOpen}
            listItems={listItems}
            style={listStyle}
            setListRef={refs.setFloating}
            loading={loading ?? resolvedItemsLoading}
            loadingText={loadingText}
            noMatchesText={noMatchesText}
            selectAllCheckboxState={selectAllCheckboxState}
            selectAllItem={selectAll}
            selectedItems={selectedItems}
            iconKeyFn={iconKeyFn}
            itemKeyFn={itemKeyFn}
          />
        }
        {...rest}
      >
        <div
          className={classNames(
            'eds-dropdown--multiselect__selected-items-and-input',
            {
              'eds-dropdown--multiselect__selected-items-and-input--filled':
                hasSelectedItems,
            },
          )}
        >
          {selectedItems.length > 1 ? (
            <VisuallyHidden onClick={inputRef.current?.focus}>
              {ariaLabelJumpToInput}
            </VisuallyHidden>
          ) : null}
          {selectedItems.length <= maxChips ? (
            selectedItems.map((selectedItem, index) => (
              <SelectedItemTag
                ariaLabelChosen={ariaLabelChosenSingular}
                ariaLabelRemoveSelected={ariaLabelRemoveSelected}
                disabled={disabled}
                getSelectedItemProps={getSelectedItemProps}
                index={index}
                key={
                  selectedItem?.label +
                  (typeof selectedItem?.value === 'string'
                    ? selectedItem.value
                    : '')
                }
                readOnly={readOnly}
                removeSelectedItem={() => {
                  handleListItemClicked({
                    clickedItem: selectedItem,
                    onChange,
                  });
                  inputRef?.current?.focus();
                }}
                selectedItem={selectedItem}
              />
            ))
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
            {...getInputProps({
              onKeyDown: (e: React.KeyboardEvent) => {
                if (selectOnTab && isOpen && e.key === 'Tab') {
                  const highlitedItem = listItems[highlightedIndex];
                  // we don't want to clear selection with tab
                  if (highlitedItem) {
                    handleListItemClicked({
                      clickedItem: highlitedItem,
                      onChange,
                    });
                  }
                }
              },
              ...getDropdownProps({
                preventKeyAction: isOpen,
                value: inputValue ?? EMPTY_INPUT,
                ref: mergeRefs(inputRef, ref),
              }),
              className: 'eds-dropdown__input eds-form-control',
              disabled: readOnly || disabled,
              placeholder: placeholder,
              tabIndex: disabled || readOnly ? -1 : undefined,
            })}
          />
        </div>
        <DropdownFieldAppendix
          {...getToggleButtonProps({
            'aria-busy': !(loading ?? resolvedItemsLoading)
              ? undefined
              : 'true',
          })}
          ariaLabelCloseList={ariaLabelCloseList}
          ariaLabelOpenList={ariaLabelOpenList}
          clearable={clearable}
          disabled={disabled || readOnly}
          onClear={handleOnClear}
          focusable={false}
          labelClearSelected={labelClearAllItems}
          isOpen={isOpen}
          itemIsSelected={selectedItems.length > 0}
          loadingText={loadingText}
          loading={loading ?? resolvedItemsLoading}
        />
      </BaseFormControl>
    );
  },
);
