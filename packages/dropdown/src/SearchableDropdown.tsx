/* eslint-disable  no-warning-comments */
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  UseComboboxState,
  UseComboboxStateChangeOptions,
  useCombobox,
} from 'downshift';
import classNames from 'classnames';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  size,
} from '@floating-ui/react-dom';

import { BaseFormControl } from '@entur/form';
import { space } from '@entur/tokens';
import { mergeRefs } from '@entur/utils';

import { DropdownList } from './components/DropdownList';
import { DropdownFieldAppendix } from './components/FieldComponents';

import { DropdownProps } from './Dropdown';
import { useResolvedItems } from './useResolvedItems';
import {
  clamp,
  EMPTY_INPUT,
  getA11yStatusMessage,
  isFunctionWithQueryArgument,
  itemToString,
  lowerCaseFilterTest,
  noFilter,
  resetInputState,
} from './utils';

import { NormalizedDropdownItemType } from './types';

import './Dropdown.scss';

export type SearchableDropdownProps<ValueType> = DropdownProps<ValueType> & {
  /** Filtreringen som brukes når man skriver inn tekst i inputfeltet
   * @default Regex-test som sjekker om item.label inneholder input-teksten
   */
  itemFilter?: (
    item: NormalizedDropdownItemType<ValueType>,
    inputValue: string | undefined,
  ) => boolean;
  /** Antall millisekunder man venter etter tekstinput før det gjøres kall for å oppdatere items
   * Denne er kun relevant hvis du sender inn en funksjon som items.
   */
  debounceTimeout?: number;
  /** Tekst som kommer opp når det ikke er noe treff på filtreringsøket
   * @default "Ingen treff for søket"
   */
  noMatchesText?: string;
  /** Callback som kalles når brukeren går ut av input-feltet */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** Callback når komponenten klikkes */
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  /** Callback når en tast trykkes */
  onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  /** Callback når input-feltet får fokus */
  onFocus?: (event: React.FocusEvent<HTMLDivElement>) => void;
};

export const SearchableDropdown = React.forwardRef(
  <ValueType extends NonNullable<any>>(
    {
      ariaLabelChosenSingular,
      ariaLabelCloseList = 'Lukk liste med valg',
      ariaLabelOpenList = 'Åpne liste med valg',
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
      loading,
      loadingText = 'Laster resultater …',
      noMatchesText = 'Ingen tilgjengelige valg …',
      onChange = () => undefined,
      placeholder,
      prepend,
      readOnly = false,
      selectedItem: value,
      selectOnTab = false,
      style,
      variant = 'info',
      onBlur,
      onClick,
      onKeyDown,
      onFocus,
      ...rest
    }: SearchableDropdownProps<ValueType>,
    ref: React.ForwardedRef<HTMLInputElement>,
  ) => {
    const [showSelectedItem, setShowSelectedItem] = useState(value !== null);
    const [lastHighlightedIndex, setLastHighlightedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const {
      items: normalizedItems,
      loading: resolvedItemsLoading,
      fetchItems,
    } = useResolvedItems(initialItems, debounceTimeout);

    const [listItems, setListItems] = useState(normalizedItems);

    const filterListItems = ({ inputValue }: { inputValue: string }) =>
      setListItems(
        normalizedItems.filter(item => itemFilter(item, inputValue)),
      );

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

    const stateReducer = useCallback(
      (
        state: UseComboboxState<NormalizedDropdownItemType<ValueType>>,
        {
          type,
          changes,
        }: UseComboboxStateChangeOptions<NormalizedDropdownItemType<ValueType>>,
      ) => {
        switch (type) {
          // empty input to show selected item and reset dropdown list on item selection
          case useCombobox.stateChangeTypes.ItemClick:
          case useCombobox.stateChangeTypes.InputKeyDownEnter: {
            return resetInputState<ValueType>(changes);
          }
          case useCombobox.stateChangeTypes.InputBlur: {
            // We dont want to change selection on blur so we keep previous selectedItem
            return resetInputState<ValueType>({
              ...changes,
              selectedItem: state.selectedItem,
            });
          }
          case useCombobox.stateChangeTypes.InputKeyDownEscape: {
            return {
              ...changes,
              selectedItem:
                clearable && !state.isOpen ? null : state.selectedItem,
            };
          }
          case useCombobox.stateChangeTypes.ControlledPropUpdatedSelectedItem: {
            return { ...changes, inputValue: state.inputValue };
          }
          // remove leading whitespace, select element with spacebar on empty input
          case useCombobox.stateChangeTypes.InputChange: {
            const isSpacePressedOnEmptyInput = changes.inputValue === ' ';

            if (!isSpacePressedOnEmptyInput)
              return { ...changes, highlightedIndex: 0 };

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
      [listItems, EMPTY_INPUT, clearable],
    );

    const {
      isOpen,
      getToggleButtonProps,
      getLabelProps,
      getMenuProps,
      getInputProps,
      highlightedIndex,
      getItemProps,
      selectedItem,
      inputValue,
      setInputValue,
      selectItem,
      reset,
    } = useCombobox({
      defaultHighlightedIndex: lastHighlightedIndex,
      items: listItems,
      itemToString,
      selectedItem: value,
      stateReducer,
      onInputValueChange(changes) {
        updateListItems({ inputValue: changes.inputValue });
      },
      onSelectedItemChange({ selectedItem: newSelectedItem }) {
        onChange(newSelectedItem);
      },
      onHighlightedIndexChange: ({ highlightedIndex }) => {
        if (highlightedIndex >= 0) setLastHighlightedIndex(highlightedIndex);
      },
      // Accessibility
      getA11yStatusMessage: options =>
        getA11yStatusMessage({ ...options, resultCount: listItems.length }),
    });

    useEffect(() => {
      // sync internal state on initial render
      if (value !== null && !inputHasFocus) {
        setShowSelectedItem(true);
        updateListItems({ inputValue: EMPTY_INPUT });
        setInputValue(EMPTY_INPUT);
      }
    }, [value]);

    const handleOnClear = () => {
      inputRef.current?.focus();
      reset();
    };

    // calculations for floating-UI popover position
    const { refs, floatingStyles, update } = useFloating({
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

    const labelProps = getLabelProps();
    const toggleButtonProps = getToggleButtonProps({
      'aria-busy': !(loading ?? resolvedItemsLoading) ? undefined : 'true',
    });
    const menuProps = getMenuProps({
      refKey: 'innerRef',
      ref: refs.setFloating,
      style: listStyle,
    });
    const inputProps = getInputProps({
      onKeyDown(e: React.KeyboardEvent) {
        if (isOpen && e.key === 'Tab') {
          const highlitedItem = listItems[highlightedIndex];
          if (selectOnTab && highlitedItem) {
            selectItem(highlitedItem);
            setShowSelectedItem(true);
          }
        }
      },
      onBlur(e) {
        if (selectedItem !== null) setShowSelectedItem(true);
        onBlur?.(e);
      },
      onFocus(e) {
        if (!readOnly) setShowSelectedItem(false);
        onFocus?.(e);
      },
      disabled: disabled,
      readOnly: readOnly,
      placeholder: selectedItem?.label ?? placeholder,
      tabIndex: disabled || readOnly ? -1 : undefined,
      ref: mergeRefs(inputRef, ref),
    });

    return (
      <BaseFormControl
        className={classNames(
          'eds-dropdown',
          'eds-dropdown--searchable',
          className,
          { 'eds-dropdown--has-tooltip': labelTooltip !== undefined },
        )}
        disabled={disabled}
        disableLabelAnimation={disableLabelAnimation}
        feedback={feedback}
        isFilled={selectedItem !== null || inputValue !== EMPTY_INPUT}
        label={label}
        labelId={labelProps.id}
        labelProps={labelProps}
        labelTooltip={labelTooltip}
        onClick={(e: React.MouseEvent<HTMLElement>) => {
          if (e.target === e.currentTarget) inputProps?.onClick?.(e);
          onClick?.(e);
        }}
        onKeyDown={onKeyDown}
        prepend={prepend}
        readOnly={readOnly}
        ref={refs.setReference}
        style={style}
        tabIndex={disabled || readOnly ? -1 : undefined}
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
            selectedItems={selectedItem !== null ? [selectedItem] : []}
            readOnly={readOnly}
            {...menuProps}
          />
        }
        {...rest}
        // Append is not supported as of now
        append={undefined}
      >
        <span
          className={classNames('eds-dropdown--searchable__selected-item', {
            'eds-dropdown--searchable__selected-item--hidden':
              !showSelectedItem,
          })}
          onClick={event => {
            if (!disabled && !readOnly) {
              inputRef.current?.focus();
              inputProps?.onClick?.(event);
            }
          }}
          tabIndex={readOnly ? 0 : -1}
        >
          {showSelectedItem ? selectedItem?.label : ''}
        </span>
        <input
          className={classNames('eds-dropdown__input eds-form-control', {
            'eds-dropdown__input--hidden': showSelectedItem,
          })}
          {...inputProps}
        />
        <DropdownFieldAppendix
          {...toggleButtonProps}
          ariaLabelCloseList={ariaLabelCloseList}
          ariaLabelOpenList={ariaLabelOpenList}
          clearable={clearable}
          disabled={disabled || readOnly}
          onClear={handleOnClear}
          focusable={false}
          labelClearSelected={labelClearSelectedItem}
          isOpen={isOpen}
          itemIsSelected={selectedItem !== null}
          loadingText={loadingText}
          loading={loading ?? resolvedItemsLoading}
        />
      </BaseFormControl>
    );
  },
);
