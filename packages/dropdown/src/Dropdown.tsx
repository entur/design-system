import React, { Dispatch, SetStateAction, useEffect } from 'react';
import classNames from 'classnames';
import { useSelect } from 'downshift';
import {
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useFloating,
} from '@floating-ui/react-dom';

import { BaseFormControl } from '@entur/form';
import { space } from '@entur/tokens';
import { mergeRefs, VariantType } from '@entur/utils';

import { DropdownList } from './components/DropdownList';
import { DropdownFieldAppendix } from './components/FieldComponents';
import { useResolvedItems } from './useResolvedItems';
import { clamp, itemToString } from './utils';

import {
  NormalizedDropdownItemType,
  PotentiallyAsyncDropdownItemType,
} from './types';

import './Dropdown.scss';

/** @deprecated use variant="information" instead */
const info = 'info';
/** @deprecated use variant="negative" instead */
const error = 'error';

export type DropdownProps<ValueType> = {
  /** Tilgjengelige valg i dropdown-en */
  items: PotentiallyAsyncDropdownItemType<ValueType>;
  /** Valgt verdi. Bruk null for ingen verdi. */
  selectedItem: NormalizedDropdownItemType<ValueType> | null;
  /** Callback ved valg som skal oppdatere selectedItem */
  onChange?: (
    selectedItem: NormalizedDropdownItemType<ValueType> | null,
  ) => void | Dispatch<
    SetStateAction<NormalizedDropdownItemType<ValueType> | null>
  >;
  /** Beskrivende tekst som forklarer feltet */
  label: string;
  /** Placeholder-tekst når ingenting er satt */
  placeholder?: string;
  /** Om man skal ha mulighet for å nullstille Dropdown-en
   * @default false
   */
  clearable?: boolean;
  /** Lar brukeren velge ved å "tab-e" seg ut av komponenten */
  selectOnTab?: boolean;
  /**
   * @deprecated
   * Bruk selectOnTab i stedet
   *
   * Lar brukeren velge ved å "tab-e" seg ut av komponenten */
  selectOnBlur?: boolean;
  /** Deaktiver dropdown-en */
  disabled?: boolean;
  /** Setter dropdown-en i read-only modus */
  readOnly?: boolean;
  /** Hvilken valideringsvariant som gjelder */
  variant?: VariantType | typeof error | typeof info;
  /** Valideringsmelding, brukes sammen med `variant` */
  feedback?: string;
  /** Tekst eller ikon som kommer først i dropdown-feltet */
  prepend?: React.ReactNode;
  /** */
  loading?: boolean;
  /** En tekst som beskriver hva som skjer når man venter på items
   * @default 'Laster inn …'
   */
  loadingText?: string;
  /** Tekst som kommer opp når det ikke er noe elementer å vise
   * @default "Ingen tilgjengelige valg …"
   */
  noMatchesText?: string;
  /** Om man skal ha mulighet for å nullstille Dropdown-en
   * @default "fjern valgt"
   */
  labelClearSelectedItem?: string;
  /** En tooltip som gir ekstra info om inputfeltet */
  labelTooltip?: React.ReactNode;
  /** Plasserer labelen statisk på toppen av inputfeltet
   * @default false
   */
  disableLabelAnimation?: boolean;
  /** Ekstra klassenavn */
  className?: string;
  /** Styling som sendes ned til Dropdown-lista */
  listStyle?: { [key: string]: any };
  /** Styling for Dropdown-en */
  style?: { [key: string]: any };
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
   * @default 'valgt'
   */
  ariaLabelChosenSingular?: string;
  /** Tekst for skjermleser som beskriver statusen til et element som valgt
   * @default ', valgt element, trykk for å fjerne'
   */
  ariaLabelSelectedItem?: string;
};

export const Dropdown = React.forwardRef(
  <ValueType extends NonNullable<any>>(
    {
      ariaLabelChosenSingular,
      ariaLabelCloseList = 'Lukk liste med valg',
      ariaLabelOpenList = 'Åpne liste med valg',
      ariaLabelSelectedItem,
      className,
      clearable = false,
      disabled = false,
      disableLabelAnimation,
      feedback,
      items: initialItems,
      label,
      labelClearSelectedItem = 'fjern valgt',
      labelTooltip,
      listStyle,
      loading,
      loadingText = 'Laster resultater …',
      noMatchesText = 'Ingen tilgjengelige valg …',
      onChange,
      placeholder,
      prepend,
      readOnly = false,
      selectedItem,
      selectOnBlur = false,
      selectOnTab = false,
      style,
      variant = 'information',
      ...rest
    }: DropdownProps<ValueType>,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) => {
    const { items: normalizedItems, loading: resolvedItemsLoading } =
      useResolvedItems(initialItems);
    const isFilled = selectedItem !== null || placeholder !== undefined;
    const {
      isOpen,
      getItemProps,
      getLabelProps,
      getMenuProps,
      getToggleButtonProps,
      highlightedIndex,
    } = useSelect({
      items: normalizedItems,
      defaultHighlightedIndex: selectedItem ? undefined : 0,
      selectedItem,
      onStateChange({ type, selectedItem: newSelectedItem }) {
        switch (type) {
          case useSelect.stateChangeTypes.ToggleButtonBlur:
            if (!selectOnBlur) return;
        }
        if (newSelectedItem === undefined) return;
        onChange?.(newSelectedItem ?? null);
      },
      itemToString,
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

    return (
      <BaseFormControl
        className={classNames('eds-dropdown', className, {
          'eds-dropdown--has-tooltip': labelTooltip !== undefined,
        })}
        disableLabelAnimation={disableLabelAnimation}
        feedback={feedback}
        isFilled={isFilled}
        labelProps={getLabelProps()}
        labelTooltip={labelTooltip}
        prepend={prepend}
        style={style}
        variant={variant}
        {...getToggleButtonProps({
          ref: mergeRefs(ref, refs.setReference),
          'aria-disabled': disabled,
          'aria-label': disabled ? 'Disabled dropdown' : '',
          disabled: disabled,
          readOnly: readOnly,
          label: label,
          labelId: getLabelProps()?.id,
          children: undefined,
          tabIndex: disabled || readOnly ? -1 : 0,
          onKeyDown(e) {
            if (
              isOpen &&
              (selectOnTab || selectOnBlur) &&
              e.key === 'Tab' &&
              highlightedIndex !== undefined
            )
              onChange?.(normalizedItems[highlightedIndex]);
          },
        })}
        after={
          <DropdownList
            ariaLabelChosenSingular={ariaLabelChosenSingular}
            ariaLabelSelectedItem={ariaLabelSelectedItem}
            floatingStyles={floatingStyles}
            getItemProps={getItemProps}
            getMenuProps={getMenuProps}
            highlightedIndex={highlightedIndex}
            isOpen={isOpen}
            listItems={normalizedItems}
            noMatchesText={noMatchesText}
            style={listStyle}
            setListRef={refs.setFloating}
            loading={loading ?? resolvedItemsLoading}
            loadingText={loadingText}
            selectedItems={selectedItem !== null ? [selectedItem] : []}
          />
        }
        {...rest}
        // Append is not supported as of now
        append={undefined}
      >
        <div className="eds-dropdown__selected-item">
          {selectedItem?.label ?? (
            <div
              className={classNames(
                'eds-dropdown__selected-item__placeholder',
                {
                  'eds-dropdown__selected-item__placeholder--readonly':
                    readOnly,
                },
              )}
            >
              {placeholder}
            </div>
          )}
        </div>
        <DropdownFieldAppendix
          aria-busy={!(loading ?? resolvedItemsLoading) ? undefined : 'true'}
          aria-expanded={isOpen}
          clearable={clearable}
          onClear={() => onChange?.(null)}
          disabled={disabled || readOnly}
          focusable={false}
          labelClearSelected={labelClearSelectedItem}
          isOpen={isOpen}
          itemIsSelected={selectedItem !== null}
          ariaLabelCloseList={ariaLabelCloseList}
          ariaLabelOpenList={ariaLabelOpenList}
          loading={false}
          loadingText={undefined}
        />
      </BaseFormControl>
    );
  },
);
