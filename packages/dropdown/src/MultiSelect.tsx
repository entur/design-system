import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import {
  UseComboboxState,
  UseComboboxStateChangeOptions,
  useCombobox,
  useMultipleSelection,
} from 'downshift';
import {
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useFloating,
} from '@floating-ui/react-dom';

import { VisuallyHidden } from '@entur/a11y';
import { BaseFormControl } from '@entur/form';
import { space } from '@entur/tokens';
import { mergeRefs } from '@entur/utils';

import {
  DropdownFieldAppendix,
  SelectedItemTag,
} from './components/FieldComponents';
import { DropdownList } from './components/DropdownList';

import { useResolvedItems } from './useResolvedItems';
import { DropdownProps } from './Dropdown';
import {
  EMPTY_INPUT,
  clamp,
  getA11yStatusMessage,
  isFunctionWithQueryArgument,
  itemToKey,
  itemToString,
  lowerCaseFilterTest,
  noFilter,
  resetInputState,
  useMultiselectUtils,
} from './utils';

import { NormalizedDropdownItemType } from './types';
import { useFloatingRef } from './useFloatingRef';
import { useShadowDomEnvironment } from './useShadowDomEnvironment';

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
  /** Callback som kalles når brukeren går ut av input-feltet */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** Callback når komponenten klikkes */
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  /** Callback når en tast trykkes */
  onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  /** Callback når input-feltet får fokus */
  onFocus?: (event: React.FocusEvent<HTMLDivElement>) => void;
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
      onBlur,
      onClick,
      onKeyDown,
      onFocus,
      ...rest
    }: MultiSelectProps<ValueType>,
    ref: React.ForwardedRef<HTMLInputElement>,
  ) => {
    const [lastHighlightedIndex, setLastHighlightedIndex] = React.useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const environment = useShadowDomEnvironment(inputRef);

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
    const selectAllUniqueId = `select-all${useId()}`;
    const selectAll: NormalizedDropdownItemType<string> = React.useMemo(
      () => ({
        value: selectAllUniqueId,
        label: labelSelectAll,
      }),
      [labelSelectAll],
    );

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

    const filterListItems = React.useCallback(
      ({ inputValue }: { inputValue: string }) =>
        setListItems([
          ...(!hideSelectAll ? [selectAll] : []),
          ...normalizedItems.filter(item => itemFilter(item, inputValue)),
        ]),
      [hideSelectAll, selectAll, normalizedItems, itemFilter],
    );

    const updateListItems = React.useCallback(
      ({ inputValue }: { inputValue?: string }) => {
        const shouldRefetchItems = isFunctionWithQueryArgument(initialItems);
        if (shouldRefetchItems) fetchItems(inputValue ?? EMPTY_INPUT);

        filterListItems({ inputValue: inputValue ?? EMPTY_INPUT });
      },
      [filterListItems, initialItems, fetchItems],
    );

    React.useEffect(() => {
      filterListItems({ inputValue });
    }, [normalizedItems]); // oxlint-disable-line react-hooks/exhaustive-deps

    const {
      hasSelectedItems,
      handleListItemClicked,
      selectAllCheckboxState,
      clickedItemIsInSelectedItems,
      clickedItemIsSelectAll,
    } = useMultiselectUtils<ValueType>({
      listItems,
      selectAll,
      selectedItems,
    });

    const {
      getSelectedItemProps,
      getDropdownProps,
      reset,
      removeSelectedItem,
      setSelectedItems,
    } = useMultipleSelection({
      selectedItems,
      // @ts-expect-error prop missing from library types
      itemToString,
      itemToKey,
      ...(environment && { environment }),
      onSelectedItemsChange({ selectedItems: newSelectedItems }) {
        onChange(newSelectedItems);
      },
    });

    const stateReducer = React.useCallback(
      (
        state: UseComboboxState<NormalizedDropdownItemType<ValueType | string>>,
        {
          type,
          changes,
        }: UseComboboxStateChangeOptions<
          NormalizedDropdownItemType<ValueType | string>
        >,
      ) => {
        switch (type) {
          // keep menu open and edit input value on item selection
          case useCombobox.stateChangeTypes.InputKeyDownEnter:
          case useCombobox.stateChangeTypes.ItemClick: {
            return {
              ...changes,
              isOpen: true,
              inputValue: clearInputOnSelect ? EMPTY_INPUT : state.inputValue,
            };
          }
          // reset input value when closing dropdown with Escape
          case useCombobox.stateChangeTypes.InputKeyDownEscape: {
            return resetInputState<ValueType | string>(changes);
          }
          // reset input value on blur, and preserve current selection
          // to prevent downshift's default blur behavior from changing it
          case useCombobox.stateChangeTypes.InputBlur: {
            return resetInputState<ValueType | string>({
              ...changes,
              selectedItem: state.selectedItem,
            });
          }
          // edit input value when selected items is updated outside component
          case useCombobox.stateChangeTypes.ControlledPropUpdatedSelectedItem: {
            return { ...changes, inputValue: state.inputValue };
          }
          // remove leading whitespace, select item with spacebar if input is empty and filter list items
          case useCombobox.stateChangeTypes.InputChange: {
            const isSpacePressedOnEmptyInput = changes.inputValue === ' ';

            if (!isSpacePressedOnEmptyInput)
              return { ...changes, highlightedIndex: hideSelectAll ? 0 : 1 };

            const sanitizedInputValue = (changes.inputValue ?? '').replace(
              /^\s+/,
              EMPTY_INPUT,
            );

            if (!state.isOpen)
              return {
                ...changes,
                inputValue: sanitizedInputValue,
                isOpen: true,
              };

            const i = changes.highlightedIndex ?? -1;
            if (i >= 0 && i < listItems.length)
              return {
                ...changes,
                inputValue: sanitizedInputValue,
                selectedItem: listItems[i],
              };

            return { ...changes, inputValue: sanitizedInputValue };
          }
          default:
            return changes;
        }
      },
      [hideSelectAll, listItems, clearInputOnSelect],
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
    } = useCombobox({
      defaultHighlightedIndex: lastHighlightedIndex, // after selection, highlight previously selected item.
      items: listItems,
      itemToString,
      selectedItem: null,
      stateReducer,
      ...(environment && { environment }),
      onInputValueChange(changes) {
        updateListItems({ inputValue: changes.inputValue });
      },
      onSelectedItemChange({ selectedItem: clickedItem }) {
        // clickedItem means item chosen either via mouse or keyboard
        if (!clickedItem) return;

        handleListItemClicked({
          clickedItem,
          onChange: setSelectedItems,
        });
      },
      onHighlightedIndexChange: ({ highlightedIndex }) => {
        if (highlightedIndex >= 0) setLastHighlightedIndex(highlightedIndex);
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
    const { refs, floatingStyles, update } = useFloating<HTMLDivElement>({
      open: isOpen,
      placement: 'bottom-start',
      middleware: [
        offset(space.extraSmall2),
        shift({ padding: space.extraSmall }),
        size({
          apply({ elements, availableHeight }) {
            elements.floating.style.setProperty(
              '--list-max-height',
              `${clamp(10 * 16, availableHeight, 20 * 16)}px`,
            );
          },
        }),
        flip({ fallbackStrategy: 'initialPlacement' }),
      ],
    });

    const setFloatingMenu = useFloatingRef(refs.setFloating);

    // Update floating-ui position on scroll etc. Floating-ui's autoupdate is usually used inside
    // the useFloating hook but this requires the floating element to be conditionally rendered.
    // Downshift doesn't work correctly when conditionally rendered since props and refs aren't correctly
    // spread to the component. We therefor use this useLayoutEffect to update position. See https://floating-ui.com/docs/autoupdate#usage
    useLayoutEffect(() => {
      if (isOpen && refs.reference.current && refs.floating.current) {
        return autoUpdate(
          refs.reference.current,
          refs.floating.current,
          update,
        );
      }
    }, [isOpen, refs.reference, refs.floating, update]);

    const handleOnClear = () => {
      inputRef.current?.focus();
      reset();
    };

    const dropdownProps = getDropdownProps({
      preventKeyAction: isOpen,
      value: inputValue ?? EMPTY_INPUT,
      ref: mergeRefs(inputRef, ref),
    });
    const inputProps = getInputProps({
      onKeyDown: (e: React.KeyboardEvent) => {
        if (selectOnTab && isOpen && e.key === 'Tab') {
          const highlitedItem = listItems[highlightedIndex];
          if (!highlitedItem) return;

          // Skip tab selection for select all or if item already is selected
          const shouldSkipTabSelection =
            clickedItemIsSelectAll(highlitedItem) ||
            (!clickedItemIsSelectAll(highlitedItem) &&
              clickedItemIsInSelectedItems(highlitedItem));

          if (shouldSkipTabSelection) return;

          handleListItemClicked({
            clickedItem: highlitedItem,
            onChange: setSelectedItems,
          });
        }
      },
      onBlur,
      onFocus,
      ...dropdownProps,
      className: 'eds-dropdown__input eds-form-control',
      disabled: readOnly || disabled,
      placeholder: placeholder,
      tabIndex: disabled || readOnly ? -1 : undefined,
    });
    const labelProps = getLabelProps();
    const menuProps = getMenuProps({
      'aria-multiselectable': true,
      refKey: 'innerRef',
      ref: setFloatingMenu,
      style: listStyle,
    });
    const toggleButtonProps = getToggleButtonProps({
      'aria-busy': !(loading ?? resolvedItemsLoading) ? undefined : 'true',
    });

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
        labelId={labelProps.id}
        labelProps={labelProps}
        labelTooltip={labelTooltip}
        onClick={(e: React.MouseEvent<HTMLElement>) => {
          if (e.target === e.currentTarget) inputProps?.onClick?.(e);
          onClick?.(e);
        }}
        onKeyDown={onKeyDown}
        readOnly={readOnly}
        // A plain ref, not one downshift rebuilds every render, so it can go
        // straight to floating-ui. useFloatingRef covers the refs that can't.
        ref={refs.setReference}
        style={style}
        variant={variant}
        after={
          <DropdownList
            ariaLabelChosenSingular={ariaLabelChosenSingular}
            ariaLabelSelectedItem={ariaLabelSelectedItem}
            floatingStyles={floatingStyles}
            getItemProps={getItemProps}
            highlightedIndex={highlightedIndex}
            isOpen={isOpen}
            listItems={listItems}
            loading={loading ?? resolvedItemsLoading}
            loadingText={loadingText}
            noMatchesText={noMatchesText}
            selectAllCheckboxState={selectAllCheckboxState}
            selectAllItem={selectAll}
            selectedItems={selectedItems}
            readOnly={readOnly}
            {...menuProps}
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
            <VisuallyHidden onClick={() => inputRef.current?.focus()}>
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
                  removeSelectedItem(selectedItem);
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
            {...inputProps}
            aria-invalid={variant === 'negative' || variant === 'error'}
          />
        </div>
        <DropdownFieldAppendix
          {...toggleButtonProps}
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
