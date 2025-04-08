/* eslint-disable  no-warning-comments */
import React, { useCallback, useEffect, useRef, useState } from 'react';
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
  /** Tekst for skjermleser som beskriver statusen til et element som valgt
   * @default ", valgt element, trykk for å fjerne"
   */
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
      selectOnBlur = false,
      selectOnTab = false,
      style,
      variant = 'info',
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

    const resetInputState = ({
      changes,
    }: {
      changes: Partial<UseComboboxState<NormalizedDropdownItemType<ValueType>>>;
    }) => {
      updateListItems({ inputValue: EMPTY_INPUT });
      return {
        ...changes,
        inputValue: EMPTY_INPUT,
      };
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
        state: UseComboboxState<NormalizedDropdownItemType<ValueType>>,
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
          case useCombobox.stateChangeTypes.InputBlur:
            return resetInputState({ changes });
          case useCombobox.stateChangeTypes.ControlledPropUpdatedSelectedItem:
            if (changes.selectedItem !== null && !inputHasFocus)
              setShowSelectedItem(true);
            return resetInputState({ changes });
          // remove leading whitespace, select element with spacebar on empty input
          case useCombobox.stateChangeTypes.InputChange: {
            setLastHighlightedIndex(0);
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
                    highlightedIndex: 0,
                  };

                if (changes.highlightedIndex !== undefined) {
                  return {
                    ...changes,
                    inputValue: sanitizedInputValue,
                    selectedItem: listItems[changes.highlightedIndex],
                    highlightedIndex: 0,
                  };
                }
              }
            }

            return { ...changes, highlightedIndex: 0 };
          }
          default:
            return changes;
        }
      },
      [fetchItems, filterListItems, inputHasFocus, resetInputState],
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
    } = useCombobox({
      defaultHighlightedIndex: lastHighlightedIndex,
      items: listItems,
      itemToString,
      selectedItem: value,
      stateReducer,
      onInputValueChange(changes) {
        updateListItems({ inputValue: changes.inputValue });
      },
      onStateChange({ selectedItem: newSelectedItem }) {
        if (newSelectedItem === undefined) return;
        onChange(newSelectedItem);
      },
      // Accessibility
      getA11yStatusMessage: options =>
        getA11yStatusMessage({ ...options, resultCount: listItems.length }),
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
      onChange(null);
      setInputValue(EMPTY_INPUT);
      inputRef.current?.focus();
      updateListItems({ inputValue });
      setShowSelectedItem(false);
    };

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
        labelId={getLabelProps().id}
        labelProps={getLabelProps()}
        labelTooltip={labelTooltip}
        onBlur={() => setInputValue('')}
        onClick={(e: React.MouseEvent) => {
          if (e.target === e.currentTarget) {
            getInputProps()?.onClick?.(e);
          }
        }}
        prepend={prepend}
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
            selectedItems={selectedItem !== null ? [selectedItem] : []}
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
          aria-hidden="true"
          onClick={getInputProps()?.onClick}
        >
          {showSelectedItem ? selectedItem?.label : ''}
        </span>
        <input
          className={classNames('eds-dropdown__input eds-form-control', {
            'eds-dropdown__input--hidden': showSelectedItem,
          })}
          {...getInputProps({
            onBlur() {
              if (selectedItem !== null) setShowSelectedItem(true);
            },
            onFocus() {
              setShowSelectedItem(false);
            },
            onKeyDown(e) {
              if (
                isOpen &&
                (selectOnTab || selectOnBlur) &&
                e.key === 'Tab' &&
                highlightedIndex !== undefined
              )
                onChange(listItems[highlightedIndex]);
            },
            disabled: disabled,
            readOnly: readOnly,
            placeholder: selectedItem?.label ?? placeholder,
            ref: mergeRefs(inputRef, ref),
          })}
        />
        <DropdownFieldAppendix
          {...getToggleButtonProps({
            'aria-busy': !(loading ?? resolvedItemsLoading)
              ? undefined
              : 'true',
          })}
          ariaLabelCloseList={ariaLabelCloseList}
          ariaLabelOpenList={ariaLabelOpenList}
          clearable={clearable}
          onClear={handleOnClear}
          focusable={true}
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
