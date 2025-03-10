import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { useSelect } from 'downshift';
import { autoUpdate, flip, offset, useFloating } from '@floating-ui/react-dom';

import { BaseFormControl } from '@entur/form';
import { space } from '@entur/tokens';
import { VariantType } from '@entur/utils';

import { DropdownList } from './components/DropdownList';
import { FieldAppend } from './components/FieldComponents';
import { useResolvedItems } from './useResolvedItems';
import { itemToString } from './utils';

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
  /** Tekst eller ikon som kommer før dropdown-en */
  prepend?: React.ReactNode;
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

export const Dropdown = <ValueType extends NonNullable<any>>({
  ariaLabelChosenSingular,
  ariaLabelCloseList,
  ariaLabelOpenList,
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
  loadingText,
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
}: DropdownProps<ValueType>) => {
  const { items: normalizedItems, loading } = useResolvedItems(initialItems);
  const toggleButtonRef = useRef<HTMLDivElement>(null);
  const isFilled = selectedItem !== null || placeholder !== undefined;
  const {
    isOpen,
    openMenu,
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
        // @ts-expect-error This falltrough is wanted
        case useSelect.stateChangeTypes.ToggleButtonBlur:
          if (!selectOnBlur) break;
        case useSelect.stateChangeTypes.ToggleButtonKeyDownEnter: // eslint-disable-line no-fallthrough
        case useSelect.stateChangeTypes.ToggleButtonKeyDownSpaceButton:
        case useSelect.stateChangeTypes.ItemClick: {
          if (newSelectedItem === undefined) return;
          onChange?.(newSelectedItem ?? null);
        }
      }
    },
    itemToString,
  });

  const { refs, floatingStyles, elements, update } = useFloating({
    placement: 'bottom-start',
    open: isOpen,
    middleware: [offset(space.extraSmall2), flip()],
  });

  // Since we use CSS instead of conditional rendering when hiding dropdownlist
  // we can't use the whileElementsMounted option and need to handle
  // cleanup ourselves. See https://floating-ui.com/docs/autoupdate
  useEffect(() => {
    if (isOpen && elements.reference && elements.floating) {
      const cleanup = autoUpdate(elements.reference, elements.floating, update);
      return cleanup;
    }
  }, [isOpen, elements, update]);

  return (
    <BaseFormControl
      append={
        <FieldAppend
          ariaHiddenToggleButton={true}
          ariaLabelCloseList={ariaLabelCloseList}
          ariaLabelOpenList={ariaLabelOpenList}
          clearable={clearable}
          labelClearSelectedItems={labelClearSelectedItem}
          focusable={false}
          getToggleButtonProps={getToggleButtonProps}
          isOpen={isOpen}
          loading={loading}
          loadingText={loadingText}
          onClear={() => {
            onChange?.(null);
            toggleButtonRef.current?.focus();
          }}
          disabled={readOnly || disabled}
          selectedItems={[selectedItem]}
        />
      }
      className={classNames('eds-dropdown', className, {
        'eds-dropdown--has-tooltip': labelTooltip !== undefined,
      })}
      disabled={disabled}
      disableLabelAnimation={disableLabelAnimation}
      feedback={feedback}
      isFilled={isFilled}
      label={label}
      labelId={getLabelProps().id}
      labelProps={getLabelProps()}
      labelTooltip={labelTooltip}
      onClick={(e: React.MouseEvent) => {
        if (e.target === e.currentTarget) openMenu();
      }}
      prepend={prepend}
      readOnly={readOnly}
      ref={refs.setReference}
      style={style}
      variant={variant}
      {...rest}
    >
      <div
        className="eds-dropdown__selected-item"
        {...getToggleButtonProps({
          id: undefined,
          onKeyDown: e => {
            if (selectOnTab && isOpen && e.key === 'Tab') {
              // we don't want to clear selection with tab
              const highlitedItem = normalizedItems[highlightedIndex];
              if (highlitedItem) {
                onChange?.(highlitedItem);
              }
            }
          },
          ref: toggleButtonRef,
          'aria-disabled': disabled,
          'aria-label': disabled ? 'Disabled dropdown' : '',
          disabled: disabled,
          tabIndex: disabled ? -1 : 0,
        })}
      >
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
          ) ??
          ''}
      </div>
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
        loading={loading}
        loadingText={loadingText}
        selectedItems={selectedItem !== null ? [selectedItem] : []}
      />
    </BaseFormControl>
  );
};
