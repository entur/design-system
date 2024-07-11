import React, { ReactNode, useRef } from 'react';

import { useDateFieldState } from '@react-stately/datepicker';
import { useDateField } from '@react-aria/datepicker';
import { I18nProvider, useLocale } from '@react-aria/i18n';
import classNames from 'classnames';

import type {
  SpectrumDateFieldProps,
  DateValue,
  AriaDatePickerProps,
  MappedDateValue,
} from '@react-types/datepicker';

import { BaseFormControl, BaseFormControlProps } from '@entur/form';
import { ConditionalWrapper, useRandomId, VariantType } from '@entur/utils';

import { FieldSegment } from '../shared/FieldSegment';
import { createCalendar, lastMillisecondOfDay } from '../shared/utils';

import './DateField.scss';

/** @deprecated use variant="information" instead */
const info = 'info';
/** @deprecated use variant="negative" instead */
const error = 'error';

export type DateFieldProps<DateType extends DateValue> = {
  /** Den valgte tiden. Tid i '@internationalized/date'-pakkens format */
  selectedDate: DateType | null;
  /** Kalles når tiden endres. Tid i '@internationalized/date'-pakkens format */
  onChange: (value: MappedDateValue<DateType> | null) => void;
  /** Label til TimePicker */
  label: string;
  /** BCP47-språkkoden til locale-en du ønsker å bruke.
   * @default Brukerenhetens selvvalgte locale
   */
  locale?: string;
  /** Viser den gjeldende tidssonen hvis en er valgt
   * @default false
   */
  showTimeZone?: boolean;
  showTime?: boolean;
  /** Tidligste gyldige datovalg.
   * Eks: today(getLocalTimeZone()) == i dag i lokal tidssone.
   *
   * OBS: Hvis du bruker dato med tid vil tidspunktet også tas hensyn til.
   * Gyldig fra og med den tiden som legges inn som minDate.
   * Dato uten tid vil være gyldig hele minDate-dagen */
  minDate?: DateValue;
  /** Seneste gyldige datovalg.
   * Eks: today(getLocalTimeZone()).add({days: 1}) == i morgen i lokal tidssone
   *
   * OBS: Hvis du bruker dato med tid vil tidspunktet også tas hensyn til.
   * Gyldig til og med den tiden som legges inn som maxDate.
   * Dato uten tid vil være gyldig hele maxDate-dagen */
  maxDate?: DateValue;
  /** Varselmelding, som vil komme under TimePicker */
  feedback?: string;
  /** Valideringsvariant*/
  variant?: VariantType | typeof error | typeof info;
  /** Varselmelding som forteller om ugyldig dato
   * @default "Ugyldig dato"
   */
  validationFeedback?: string;
  /** Valideringsvariant for melding om ugyldig dato
   * @default "negative"
   */
  validationVariant?: VariantType | typeof error | typeof info;
  labelTooltip?: React.ReactNode;
  labelProps?: React.DOMAttributes<Element>;
  fieldProps?: AriaDatePickerProps<DateValue>;
  groupProps?: React.DOMAttributes<Element>;
  dateFieldRef?: React.Ref<HTMLDivElement>;
  disabled?: boolean;
  /** Ekstra klassenavn */
  className?: string;
  style?: React.CSSProperties;
} & Omit<
  SpectrumDateFieldProps<DateValue>,
  | 'value'
  | 'onChange'
  | 'label'
  | 'hideTimeZone'
  | 'placeholder'
  | 'minValue'
  | 'maxValue'
> &
  Omit<Partial<BaseFormControlProps>, 'children'>;

export const DateField = <DateType extends DateValue>({
  selectedDate,
  onChange,
  label,
  locale: customLocale,
  showTimeZone,
  showTime,
  granularity = 'day',
  disabled,
  isDisabled,
  variant,
  feedback,
  validationVariant = 'negative',
  validationFeedback = 'Ugyldig dato',
  labelTooltip,
  minDate,
  maxDate,
  style,
  className,
  labelProps: parentLabelProps,
  fieldProps: parentFieldProps,
  groupProps: parentGroupProps,
  append,
  prepend,
  dateFieldRef: ref,
  ...rest
}: DateFieldProps<DateType>) => {
  const { locale } = useLocale();

  const state = useDateFieldState({
    ...rest,
    locale: customLocale ?? locale,
    createCalendar,
    value: selectedDate,
    //@ts-expect-error incorrect type in package
    onChange,
    hideTimeZone: !showTimeZone,
    granularity: showTime ? 'minute' : granularity,
    minValue: minDate,
    // this weird logic makes sure the entire day is included if no time is provided in maxDate
    maxValue:
      'hour' in (maxDate ?? {})
        ? maxDate
        : maxDate !== undefined
        ? lastMillisecondOfDay(maxDate)
        : undefined,
    isDisabled: isDisabled || disabled,
    shouldForceLeadingZeros: true,
  });

  const dateFieldRef = useRef(null);
  const { labelProps, fieldProps } = useDateField(
    { ...parentFieldProps, ...rest, label: label },
    state,
    dateFieldRef,
  );

  const id = useRandomId('datefield');

  return (
    <ConditionalWrapper
      condition={customLocale !== undefined}
      wrapper={(child: ReactNode) => (
        <I18nProvider locale={customLocale}>{child}</I18nProvider>
      )}
    >
      <BaseFormControl
        append={append}
        ariaAlertOnFeedback
        className={classNames('eds-datefield', className, {
          'eds-datefield--has-tooltip': labelTooltip !== undefined,
        })}
        disabled={isDisabled || disabled}
        disableLabelAnimation
        feedback={
          feedback ??
          (state.validationState === 'invalid' ? validationFeedback : undefined)
        }
        label={label}
        labelId={id}
        labelProps={parentLabelProps ?? labelProps}
        labelTooltip={labelTooltip}
        prepend={prepend}
        ref={ref}
        style={style}
        variant={
          variant ??
          (state.validationState === 'invalid' ? validationVariant : undefined)
        }
        {...parentGroupProps}
      >
        <span
          ref={dateFieldRef}
          {...fieldProps}
          style={{ display: 'contents' }}
        >
          {state.segments.map((segment, i) => (
            <FieldSegment segment={segment} state={state} key={i} />
          ))}
        </span>
      </BaseFormControl>
    </ConditionalWrapper>
  );
};
