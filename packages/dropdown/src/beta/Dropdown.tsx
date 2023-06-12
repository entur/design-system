/* eslint-disable  no-warning-comments */
import React from 'react';
import { useSelect } from 'downshift';
import classNames from 'classnames';

import { BaseFormControl, VariantType } from '@entur/form';

import { NormalizedDropdownItemType } from '../useNormalizedItems';
import {
  PotentiallyAsyncDropdownItemType,
  useResolvedItems,
} from '../useResolvedItems';
import { DropdownList } from './components/DropdownList';

import { itemToString } from './utils';
import { FieldAppend } from './components/FieldComponents';

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
  selectOnTab?: boolean;
  /** Om man skal vise items ved fokusering av input-feltet, før man skriver inn noe */
  openOnFocus?: boolean;
  /** Antall millisekunder man venter før man kaller en potensiell items-funksjon */
  debounceTimeout?: number;
  /** Om man skal ha mulighet for å nullstille Dropdown-en
   * @default false
   */
  clearable?: boolean;
  /** Ekstra klassenavn */
  className?: string;
  /** Marker første valgmulighet automatisk */
  highlightFirstItemOnOpen?: boolean;
  /** Styling som sendes ned til Dropdown-lista */
  listStyle?: { [key: string]: any };
  /** Plasserer labelen statisk på toppen av inputfeltet
   * @default false
   */
  disableLabelAnimation?: boolean;
  /** Alle ekstra props videresendes til Downshift */
  [key: string]: any;
};

export const DropdownBeta = ({
  className,
  clearable = false,
  debounceTimeout,
  // disabled,
  // disableLabelAnimation,
  feedback,
  items: initialItems,
  label,
  listStyle,
  // loadingText,
  onChange,
  openOnFocus = false,
  placeholder,
  // prepend,
  readonly = false,
  // searchable,
  selectedItem,
  selectOnBlur = false,
  selectOnTab = false,
  // value,
  variant = 'info',
  ...rest
}: DropdownBetaProps) => {
  const { items: normalizedItems, loading } = useResolvedItems(
    initialItems,
    debounceTimeout,
  );

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
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
            selectedItems={[selectedItem]}
            isOpen={isOpen}
            clearable={true}
            loading={loading}
            loadingText={''}
            readOnly={readonly}
            onClear={() => {
              onChange?.(null);
            }}
            getToggleButtonProps={getToggleButtonProps}
            clearSelectedItemsLabel="Fjern valgt"
            ariaLabelClearItems={`${selectedItem?.label} valgt, trykk for å fjerne valget`}
            focusable
          />
        }
        className={classNames('eds-dropdown', className, {
          'eds-dropdown--not-filled': selectedItem === null,
        })}
        label={label}
        labelId={getLabelProps().id}
        labelProps={getLabelProps()}
        disableLabelAnimation
        isFilled={selectedItem !== null}
        feedback={feedback}
        variant={variant}
        readOnly={readonly}
        {...rest}
      >
        <div
          className="eds-dropdown__selected-item-button"
          {...getToggleButtonProps()}
        >
          {selectedItem?.label ?? ''}
        </div>
      </BaseFormControl>
      <DropdownList
        selectedItems={selectedItem !== null ? [selectedItem] : []}
        isOpen={isOpen}
        listItems={normalizedItems}
        highlightedIndex={highlightedIndex}
        listStyle={listStyle}
        getMenuProps={getMenuProps}
        getItemProps={getItemProps}
        loading={loading}
      />
    </div>
  );
};
