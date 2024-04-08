import React from 'react';
import { BaseFormControl } from '@entur/form';
import { DownArrowIcon } from '@entur/icons';
import { LoadingDots } from '@entur/loader';
import { useRandomId, VariantType } from '@entur/utils';

import { useResolvedItems } from './useResolvedItems';
import {
  NormalizedDropdownItemType,
  PotentiallyAsyncDropdownItemType,
} from './types';

import './Dropdown.scss';

/** @deprecated use variant="information" instead */
const info = 'info';
/** @deprecated use variant="negative" instead */
const error = 'error';

export type NativeDropdownProps<ValueType> = {
  /** Ekstra klassenavn */
  className?: string;
  /**
   * For å deaktivere dropdow-nen
   * @default false
   **/
  disabled?: boolean;
  /** Valideringsmelding, brukes sammen med `variant` */
  feedback?: string;
  /** Alle valg for dropdown-en å ha */
  items: PotentiallyAsyncDropdownItemType<ValueType>;
  /** Beskrivende tekst som forklarer feltet */
  label: string;
  /** En callback for endringer av value
   * Obs: merk at parameter her denne ikke er samme som i en HTML select.
   * Bruk { target } hvis du trenger info om select-elementet som ble trykket på
   */
  onChange?: ({
    value,
    selectedItem,
    target,
  }: {
    value: string;
    selectedItem: NormalizedDropdownItemType<ValueType> | null;
    target: EventTarget & HTMLSelectElement;
  }) => void;
  /** Tekst eller ikon som kommer før dropdown-en */
  prepend?: React.ReactNode;
  /**
   * Setter dropdown-en i read-only modus
   * @default false
   **/
  readOnly?: boolean;
  /** Den valgte verdien som NormalizedDropdownItemType
   * (Brukes når komponenten er 'controlled')
   */
  selectedItem?: NormalizedDropdownItemType<ValueType> | null;
  /** Den valgte verdien som sting
   * (Brukes når komponenten er 'controlled)
   */
  value?: string;
  /** Hvilken valideringsvariant som gjelder*/
  variant?: VariantType | typeof error | typeof info;
  /** Plasserer labelen statisk på toppen av inputfeltet
   * @default false
   */
  disableLabelAnimation?: boolean;
  [key: string]: any;
};

export const NativeDropdown = <ValueType extends string | number>({
  className,
  disabled = false,
  disableLabelAnimation,
  feedback,
  items,
  label,
  loadingText,
  onChange,
  prepend,
  readOnly = false,
  selectedItem,
  style,
  value,
  variant,
  ...rest
}: NativeDropdownProps<ValueType>) => {
  const { items: normalizedItems, loading } =
    useResolvedItems<ValueType>(items);
  const nativeDropdownId = useRandomId('eds-dropdown-native');

  return (
    <BaseFormControl
      disabled={disabled}
      readOnly={readOnly}
      prepend={prepend}
      append={
        <FieldAppend
          hidden={disabled || readOnly}
          loading={loading}
          loadingText={loadingText}
        />
      }
      className={className}
      style={style}
      label={label}
      labelId={nativeDropdownId}
      variant={variant}
      feedback={feedback}
      disableLabelAnimation={disableLabelAnimation}
      isFilled={true}
    >
      <select
        aria-invalid={variant === 'negative' || variant === error}
        aria-labelledby={nativeDropdownId}
        aria-busy={loading}
        className="eds-form-control eds-dropdown--native"
        disabled={disabled || readOnly}
        onChange={event => {
          onChange?.({
            value: event.target.value,
            selectedItem:
              normalizedItems.find(item => item.value === event.target.value) ??
              null,
            target: event.target,
          });
        }}
        value={value ?? selectedItem?.value ?? undefined}
        {...rest}
      >
        {normalizedItems.map(item => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </BaseFormControl>
  );
};

const FieldAppend = ({
  loading,
  loadingText,
  hidden,
}: {
  loading: boolean;
  loadingText?: string;
  hidden: boolean;
}) => {
  if (loading) {
    return (
      <div className="eds-dropdown-native__loading-dots">
        <LoadingDots aria-label={loadingText} />
      </div>
    );
  }
  if (hidden) {
    return <></>;
  }
  return <DownArrowIcon inline />;
};
