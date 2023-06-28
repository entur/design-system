import React from 'react';
import { useSelect } from 'downshift';
import classNames from 'classnames';

import { BaseFormControl, VariantType } from '@entur/form';

import { DropdownList } from './components/DropdownList';
import { FieldAppend } from './components/FieldComponents';

import { NormalizedDropdownItemType } from './useNormalizedItems';
import {
  PotentiallyAsyncDropdownItemType,
  useResolvedItems,
} from './useResolvedItems';
import { itemToString } from './utils';

import './Dropdown.scss';

export type DropdownBetaProps = {
  /** Tilgjengelige valg i dropdown-en */
  items: PotentiallyAsyncDropdownItemType;
  /** Valgt verdi. Bruk null for ingen verdi. */
  selectedItem: NormalizedDropdownItemType | null;
  /** Beskrivende tekst som forklarer feltet */
  label: string;
  /** Tooltip for labelen */
  labelTooltip?: string;
  /** Hvilken valideringsvariant som gjelder */
  variant?: VariantType;
  /** Valideringsmelding, brukes sammen med `variant` */
  feedback?: string;
  /** Tekst eller ikon som kommer før dropdown-en */
  prepend?: React.ReactNode;
  /** Deaktiver dropdown-en */
  disabled?: boolean;
  /** Setter dropdown-en i read-only modus */
  readOnly?: boolean;
  /** Placeholder-tekst når ingenting er satt */
  placeholder?: string;
  /** En tekst som beskriver hva som skjer når man venter på items */
  loadingText?: string;
  /** Callback når brukeren endrer valg */
  onChange?: (selectedItem: NormalizedDropdownItemType | null) => void;
  /** Lar brukeren velge ved å "tab-e" seg ut av komponenten */
  selectOnBlur?: boolean;
  // /** Om man skal vise items ved fokusering av input-feltet, før man skriver inn noe */
  // openOnFocus?: boolean;
  /** Om man skal ha mulighet for å nullstille Dropdown-en
   * @default false
   */
  clearable?: boolean;
  /** Ekstra klassenavn */
  className?: string;
  /** Styling som sendes ned til Dropdown-lista */
  listStyle?: { [key: string]: any };
  /** Styling for Dropdown-en */
  style?: { [key: string]: any };
  /** Plasserer labelen statisk på toppen av inputfeltet
   * @default false
   */
  disableLabelAnimation?: boolean;
};

export const DropdownBeta = ({
  className,
  clearable = false,
  disabled = false,
  disableLabelAnimation,
  feedback,
  items: initialItems,
  label,
  labelTooltip,
  listStyle,
  loadingText,
  onChange,
  // openOnFocus = false, // Not implemented yet
  placeholder,
  prepend,
  readOnly = false,
  selectedItem,
  selectOnBlur = false,
  style,
  variant = 'info',
  ...rest
}: DropdownBetaProps) => {
  const { items: normalizedItems, loading } = useResolvedItems(initialItems);
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
    selectedItem,
    onStateChange({ type, selectedItem: clickedItem }) {
      switch (type) {
        // @ts-expect-error This falltrough is wanted
        case useSelect.stateChangeTypes.InputBlur:
          if (!selectOnBlur) break;
        case useSelect.stateChangeTypes.MenuKeyDownEnter: // eslint-disable-line no-fallthrough
        case useSelect.stateChangeTypes.ItemClick:
          onChange?.(clickedItem !== undefined ? clickedItem : null);
      }
    },
    itemToString,
  });

  return (
    <div className="eds-dropdown__wrapper">
      <BaseFormControl
        append={
          <FieldAppend
            clearable={true}
            labelClearSelectedItems="Fjern valgt"
            focusable
            getToggleButtonProps={getToggleButtonProps}
            isOpen={isOpen}
            loading={loading}
            loadingText={loadingText}
            onClear={() => {
              onChange?.(null);
            }}
            disabled={readOnly || disabled}
            selectedItems={[selectedItem]}
          />
        }
        className={classNames('eds-dropdown', className, {
          'eds-dropdown--not-filled': !isFilled,
        })}
        disabled={disabled}
        disableLabelAnimation={disableLabelAnimation}
        feedback={feedback}
        isFilled={isFilled}
        label={label}
        labelId={getLabelProps().id}
        labelProps={getLabelProps({
          'aria-hidden': true,
        })}
        labelTooltip={labelTooltip}
        prepend={prepend}
        readOnly={readOnly}
        style={style}
        variant={variant}
        {...rest}
      >
        <button
          className="eds-dropdown__selected-item-button"
          {...getToggleButtonProps()}
        >
          {selectedItem?.label ?? (
              <span
                className={classNames(
                  'eds-dropdown__selected-item-button__placeholder',
                  {
                    'eds-dropdown__selected-item-button__placeholder--readonly':
                      readOnly,
                  },
                )}
              >
                {placeholder}
              </span>
            ) ??
            ''}
        </button>
      </BaseFormControl>
      <DropdownList
        getItemProps={getItemProps}
        getMenuProps={getMenuProps}
        highlightedIndex={highlightedIndex}
        isOpen={isOpen}
        listItems={normalizedItems}
        listStyle={listStyle}
        loading={loading}
        loadingText={loadingText}
        selectedItems={selectedItem !== null ? [selectedItem] : []}
      />
    </div>
  );
};
