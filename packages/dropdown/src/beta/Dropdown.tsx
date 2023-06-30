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
  /** Callback som skal oppdatere selectedItem */
  onChange?: (selectedItem: NormalizedDropdownItemType | null) => void;
  /** Beskrivende tekst som forklarer feltet */
  label: string;
  /** Placeholder-tekst når ingenting er satt */
  placeholder?: string;
  /** Om man skal ha mulighet for å nullstille Dropdown-en
   * @default true
   */
  clearable?: boolean;
  /** Lar brukeren velge ved å "tab-e" seg ut av komponenten */
  selectOnBlur?: boolean;
  /** Deaktiver dropdown-en */
  disabled?: boolean;
  /** Setter dropdown-en i read-only modus */
  readOnly?: boolean;
  /** Hvilken valideringsvariant som gjelder */
  variant?: VariantType;
  /** Valideringsmelding, brukes sammen med `variant` */
  feedback?: string;
  /** Tekst eller ikon som kommer før dropdown-en */
  prepend?: React.ReactNode;
  /** En tekst som beskriver hva som skjer når man venter på items */
  loadingText?: string;
  /** Om man skal ha mulighet for å nullstille Dropdown-en
   * @default "fjern valgt"
   */
  labelClearSelectedItem?: string;
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
};

export const DropdownBeta = ({
  ariaLabelCloseList,
  ariaLabelOpenList,
  className,
  clearable = true,
  disabled = false,
  disableLabelAnimation,
  feedback,
  items: initialItems,
  label,
  labelClearSelectedItem = 'fjern valgt',
  listStyle,
  loadingText,
  onChange,
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
    defaultHighlightedIndex: selectedItem ? undefined : 0,
    selectedItem,
    onStateChange({ type, selectedItem: clickedItem }) {
      switch (type) {
        // @ts-expect-error This falltrough is wanted
        case useSelect.stateChangeTypes.InputBlur:
          if (!selectOnBlur) break;
        case useSelect.stateChangeTypes.ToggleButtonKeyDownEnter: // eslint-disable-line no-fallthrough
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
            ariaHiddenToggleButton={true}
            ariaLabelCloseList={ariaLabelCloseList}
            ariaLabelOpenList={ariaLabelOpenList}
            clearable={true}
            labelClearSelectedItems={labelClearSelectedItem}
            focusable={false}
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
        labelProps={getLabelProps()}
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
