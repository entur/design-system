import React, { useRef } from 'react';
import classNames from 'classnames';
import { useTimeField } from '@react-aria/datepicker';
import { I18nProvider, useLocale } from '@react-aria/i18n';
import { useTimeFieldState } from '@react-stately/datepicker';
import { now } from '@internationalized/date';

import type {
  TimeValue,
  AriaTimeFieldProps,
  MappedTimeValue,
} from '@react-types/datepicker';

import { VisuallyHidden } from '@entur/a11y';
import { BaseFormControl } from '@entur/form';
import { useRandomId, mergeRefs, VariantType } from '@entur/utils';

import { FieldSegment } from '../shared/FieldSegment';
import { TimePickerArrowButton } from './TimePickerArrowButton';
import { convertValueToType, focusSegment, modulo } from '../shared/utils';

import './TimePicker.scss';

/** @deprecated use variant="information" instead */
const info = 'info';
/** @deprecated use variant="negative" instead */
const error = 'error';

export type TimePickerProps<TimeType extends TimeValue> = {
  /** Den valgte tiden. Tid i '@internationalized/date'-pakkens format */
  selectedTime: TimeType | null;
  /** Kalles når tiden endres. Tid i '@internationalized/date'-pakkens format */
  onChange: (value: MappedTimeValue<TimeType> | null) => void;
  /** Label til TimePicker */
  label: string;
  /** Minutter som legges til eller trekkes fra ved klikk på pilene i TimePicker.
   *  Rundes av til nærmeste hele 'minuteIncrement' som går opp i 60.
   *
   *  OBS: Støtter kun verdier <= 60 og multiplum av 60.
   *  @default 30
   */
  minuteIncrementForArrowButtons?: number;
  /** BCP47-språkkoden til locale-en du ønsker å bruke.
   * @default Brukerenhetens selvvalgte locale
   */
  locale?: string;
  /** Viser den gjeldende tidssonen hvis en er valgt
   * @default false
   */
  showTimeZone?: boolean;
  /** Viser sekunder i tillegg til minutter og timer
   * @default false
   */
  showSeconds?: boolean;
  /** Aria-label for venstrepil-knappen som trekker fra tid
   * @default `Trekk fra ${minuteIncrementForArrowButtons} minutter`
   */
  leftArrowButtonAriaLabel?: string;
  /** Aria-label for høyrepil-knappen som legger til tid
   * @default `Legg til ${minuteIncrementForArrowButtons} minutter`
   */
  rightArrowButtonAriaLabel?: string;
  /** Varselmelding, som vil komme under TimePicker */
  feedback?: string;
  /** Valideringsvariant info og error er deprecated bruk information og negative istedenfor*/
  variant?: VariantType | typeof error | typeof info;
  labelTooltip?: React.ReactNode;
  disabled?: boolean;
  inputRef?: React.ForwardedRef<HTMLDivElement>;
  /** Tvinger typen på onChange til den gitte typen.
   * Dette er nyttig når utgangsverdien din er 'null', men du ønsker at
   * TimePicker alltid skal returnere f.eks Time.
   *
   * Som standard returnerer onChange TimeValue basert på selectedTime,
   * eller ZonedDateTime hvis selectedTime er 'null'.
   *
   * @default undefined
   */
  forcedReturnType?: 'Time' | 'CalendarDateTime' | 'ZonedDateTime';
  forcedTimeZone?: string;
  /** Ekstra klassenavn */
  className?: string;
  style?: React.CSSProperties;
} & Omit<
  AriaTimeFieldProps<TimeType>,
  | 'value'
  | 'onChange'
  | 'label'
  | 'hideTimeZone'
  | 'placeholder'
  | 'minValue'
  | 'maxValue'
>;

export const TimePicker = <TimeType extends TimeValue>({
  selectedTime,
  onChange,
  disabled,
  className,
  style,
  label,
  labelTooltip,
  feedback,
  granularity,
  variant,
  locale: customLocale,
  showTimeZone,
  showSeconds = false,
  minuteIncrementForArrowButtons = 30,
  leftArrowButtonAriaLabel = `Trekk fra ${minuteIncrementForArrowButtons} minutter`,
  rightArrowButtonAriaLabel = `Legg til ${minuteIncrementForArrowButtons} minutter`,
  inputRef,
  forcedReturnType,
  forcedTimeZone,
  ...rest
}: TimePickerProps<TimeType>) => {
  let { locale } = useLocale();
  if (customLocale) locale = customLocale;
  const timePickerId = useRandomId('eds-timepicker');

  const timeZone =
    forcedTimeZone ??
    (selectedTime !== null && 'timezone' in selectedTime
      ? (selectedTime.timezone as string)
      : 'Europe/Oslo');

  const handleOnChange = (value: MappedTimeValue<TimeType> | null) => {
    if (forcedReturnType !== undefined) {
      return onChange(
        convertValueToType({
          value,
          type: forcedReturnType,
          timezone: timeZone,
        }) as MappedTimeValue<TimeType> | null,
      );
    }

    onChange(value);
  };

  const state = useTimeFieldState({
    onChange: handleOnChange,
    label: label,
    locale,
    value: selectedTime,
    granularity: granularity ?? showSeconds ? 'second' : 'minute',
    hideTimeZone: !showTimeZone,
    isDisabled: disabled,
    shouldForceLeadingZeros: true,
    ...rest,
  });
  const timeFieldRef = useRef<HTMLDivElement>(null);
  const { labelProps, fieldProps } = useTimeField<TimeType>(
    { ...rest, label: label },
    state,
    timeFieldRef,
  );
  const id = useRandomId('timepicker');

  const getCurrentTime = () => {
    const getCurrentTimeWithCorrectType = convertValueToType({
      value: now(timeZone),
      type: forcedReturnType ?? 'ZonedDateTime',
    }) as MappedTimeValue<TimeType>;
    return getCurrentTimeWithCorrectType;
  };

  const handleOnClickArrowButton = (operation: 'add' | 'subtract') => {
    if (selectedTime === null) return handleOnChange(getCurrentTime());
    switch (operation) {
      case 'add':
        return handleOnChange(
          selectedTime.add({
            minutes:
              minuteIncrementForArrowButtons -
              modulo(selectedTime.minute, minuteIncrementForArrowButtons),
          }) as MappedTimeValue<TimeType>,
        );
      case 'subtract':
        return handleOnChange(
          selectedTime.subtract({
            minutes:
              modulo(selectedTime.minute - 1, minuteIncrementForArrowButtons) +
              1,
          }) as MappedTimeValue<TimeType>,
        );
    }
  };

  return (
    <I18nProvider locale={locale}>
      <div className={classNames(className, 'eds-timepicker__wrapper')}>
        <BaseFormControl
          style={style}
          className={classNames('eds-timepicker', {
            'eds-timepicker--disabled': disabled,
          })}
          labelId={id}
          label={label}
          labelProps={{
            ...labelProps,
            'aria-describedby': timePickerId + 'description',
          }}
          ref={mergeRefs(timeFieldRef, inputRef)}
          disabled={disabled}
          disableLabelAnimation
          labelTooltip={labelTooltip}
          {...fieldProps}
          variant={variant}
          feedback={feedback}
          ariaAlertOnFeedback
          aria-describedby={timePickerId + 'description'}
          prepend={
            <TimePickerArrowButton
              direction="left"
              disabled={disabled}
              aria-label={leftArrowButtonAriaLabel}
              onClick={() => handleOnClickArrowButton('subtract')}
              onFocus={() => focusSegment(timeFieldRef, 'first')}
            />
          }
          append={
            <TimePickerArrowButton
              direction="right"
              disabled={disabled}
              aria-label={rightArrowButtonAriaLabel}
              onClick={() => handleOnClickArrowButton('add')}
              onFocus={() => focusSegment(timeFieldRef, 'last')}
            />
          }
        >
          {state.segments.map((segment, i) => (
            <FieldSegment
              segment={segment}
              state={state}
              key={i}
              aria-describedby={timePickerId + 'description'}
            />
          ))}
        </BaseFormControl>
        <VisuallyHidden id={timePickerId + 'description'}>
          {selectedTime !== null
            ? 'valgt tid: ' +
              selectedTime.hour.toString().padStart(2, '0') +
              ':' +
              selectedTime.minute.toString().padStart(2, '0') +
              (showSeconds
                ? ':' + selectedTime.second.toString().padStart(2, '0')
                : '')
            : ''}
        </VisuallyHidden>
      </div>
    </I18nProvider>
  );
};
