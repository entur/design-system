import React, { ReactNode, useRef } from 'react';

import {
  DateFieldStateOptions,
  useDateFieldState,
} from '@react-stately/datepicker';
import { useDateField } from '@react-aria/datepicker';
import { I18nProvider, useLocale } from '@react-aria/i18n';
import classNames from 'classnames';

import type {
  DateValue,
  AriaDatePickerProps,
  MappedDateValue,
} from '@react-types/datepicker';

import { BaseFormControl, BaseFormControlProps } from '@entur/form';
import { ConditionalWrapper, useRandomId, VariantType } from '@entur/utils';

import { FieldSegment } from '../shared/FieldSegment';
import {
  createCalendar,
  ForcedReturnType,
  handleOnChange,
  lastMillisecondOfDay,
} from '../shared/utils';

import './DateField.scss';

/** @deprecated use variant="information" instead */
const info = 'info';
/** @deprecated use variant="negative" instead */
const error = 'error';

export type DateFieldProps<DateType extends DateValue> = Omit<
  AriaDatePickerProps<DateType>,
  | 'value'
  | 'onChange'
  | 'label'
  | 'hideTimeZone'
  | 'placeholder'
  | 'placeholderValue'
  | 'defaultValue'
  | 'minValue'
  | 'maxValue'
> &
  Partial<Omit<BaseFormControlProps, 'children' | 'label'>> & {
    /** Den valgte tiden. Tid i '@internationalized/date'-pakkens format */
    selectedDate: DateType | null;
    /** Kalles når dato endres. Tid i '@internationalized/date'-pakkens format */
    onChange?: (value: MappedDateValue<DateType> | null) => void;
    /** Ledetekst til DateField */
    label: string;
    /** BCP47-språkkoden til locale-en du ønsker å bruke.
     * @default Brukerenhetens selvvalgte locale
     */
    locale?: string;
    /** Viser den gjeldende tidssonen hvis en er valgt
     * @default false
     */
    showTimeZone?: boolean;
    /** Velg minste enhet som skal vises i datovelgeren. Hvis du vil vise tid vil "minute"
     * viser minutt og ikke sekund, mens "second" viser sekunder også.
     * @default "day"
     */
    granularity?: AriaDatePickerProps<DateType>['granularity'];
    /** Viser tidspunkt i tillegg til dato.
     * OBS: selectedDate må være av typen CalendarDateTime eller ZonedDateTime
     */
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
    /** Funksjon som tar inn en dato og sier om den er utilgjengelig.
     * Eks. (date) => isWeekend(date, 'no-NO') == helgedager er ikke tilgjengelig */
    isDateUnavailable?: (date: DateValue) => boolean;
    /** Tvinger typen på onChange til den gitte typen.
     * Dette er nyttig når utgangsverdien din er 'null', men du ønsker at
     * DatePicker alltid skal returnere f.eks ZonedDateTime.
     *
     * Som standard returnerer onChange DateValue basert på selectedDate,
     * eller CalendarDate hvis selectedDate er 'null'.
     *
     * @default undefined
     */
    forcedReturnType?: ForcedReturnType;
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
    fieldProps?: DateFieldProps<DateType>;
    dateFieldRef?: React.Ref<HTMLDivElement>;
    disabled?: boolean;
    /** Ekstra klassenavn */
    className?: string;
    style?: React.CSSProperties;
  };

export const DateField = <DateType extends DateValue>({
  selectedDate,
  onChange,
  label,
  locale: customLocale,
  showTimeZone,
  showTime,
  granularity = showTime ? 'minute' : 'day',
  disabled,
  isDisabled,
  variant,
  feedback,
  validationVariant = 'negative',
  validationFeedback = 'Ugyldig dato',
  labelTooltip,
  minDate,
  maxDate,
  forcedReturnType,
  style,
  className,
  labelProps: parentLabelProps,
  append,
  prepend,
  dateFieldRef: ref,
  ...rest
}: DateFieldProps<DateType>) => {
  const { locale } = useLocale();

  const _props: DateFieldStateOptions<DateType> = {
    ...rest,
    locale: customLocale ?? locale,
    createCalendar,
    value: selectedDate,
    onChange: value =>
      handleOnChange<DateType>({
        value,
        selectedDate,
        forcedReturnType,
        onChange,
      }),
    hideTimeZone: !showTimeZone,
    granularity,
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
  };

  const state = useDateFieldState(_props);

  const dateFieldRef = useRef(null);
  const { labelProps, fieldProps } = useDateField(_props, state, dateFieldRef);

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
        variant={variant ?? (state.isInvalid ? validationVariant : undefined)}
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
