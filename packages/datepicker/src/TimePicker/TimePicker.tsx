import React, { useRef } from 'react';
import classNames from 'classnames';
import { useTimeField } from '@react-aria/datepicker';
import { I18nProvider, useLocale } from '@react-aria/i18n';
import { useTimeFieldState } from '@react-stately/datepicker';
import { getLocalTimeZone, now } from '@internationalized/date';

import type {
  TimeValue,
  AriaTimeFieldProps,
  MappedTimeValue,
} from '@react-types/datepicker';

import { BaseFormControl, VariantType } from '@entur/form';
import { useRandomId, mergeRefs } from '@entur/utils';

import { FieldSegment } from '../shared/FieldSegment';
import { TimePickerArrowButton } from './TimePickerArrowButton';

import './TimePicker.scss';

export type TimePickerProps<TimeType extends TimeValue> = {
  /** Den valgte tiden. Tid i '@internationalized/date'-pakkens format */
  selectedTime: TimeType | null;
  /** Kalles når tiden endres. Tid i '@internationalized/date'-pakkens format */
  onChange: (value: MappedTimeValue<TimeType> | null) => void;
  /** Label til TimePicker */
  label: string;
  /** Minutter som legges til eller trekkes fra ved klikk på pilene i TimePicker
   * @default 30
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
  /** Valideringsvariant */
  variant?: VariantType;
  labelTooltip?: React.ReactNode;
  disabled?: boolean;
  inputRef?: React.ForwardedRef<HTMLDivElement>;
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
  variant,
  locale: customLocale,
  showTimeZone,
  minuteIncrementForArrowButtons = 30,
  leftArrowButtonAriaLabel = `Trekk fra ${minuteIncrementForArrowButtons} minutter`,
  rightArrowButtonAriaLabel = `Legg til ${minuteIncrementForArrowButtons} minutter`,
  inputRef,
  ...rest
}: TimePickerProps<TimeType>) => {
  let { locale } = useLocale();
  if (customLocale) locale = customLocale;

  const state = useTimeFieldState({
    // @ts-expect-error Time should be assignable to MappedTime<TimeType>
    onChange,
    label: label,
    locale,
    value: selectedTime === null ? undefined : selectedTime,
    hideTimeZone: !showTimeZone,
    isDisabled: disabled,
    ...rest,
  });
  const timeFieldRef = useRef(null);
  const { labelProps, fieldProps } = useTimeField<TimeType>(
    { ...rest, label: label },
    state,
    timeFieldRef,
  );
  const id = useRandomId('timepicker');

  const handleOnClickArrowButton = (minutes: number) => {
    if (someSegmentIsUndefined) {
      setTimeToNearestMinuteIncrement();
    } else {
      addMinutesToSelectedTime(minutes);
    }
  };

  const someSegmentIsUndefined = state.segments.some(
    segment => segment.text === '––',
  );

  const setTimeToNearestMinuteIncrement = () => {
    const currentTime = now(getLocalTimeZone());
    const roundedMinute =
      Math.floor(currentTime.minute / minuteIncrementForArrowButtons) *
      minuteIncrementForArrowButtons;
    const newTime = currentTime.set({ minute: roundedMinute });
    // @ts-expect-error Since this function is used when selectedTime is null,
    // we can't guarantee newTime matching the type of selectedTime in the future.
    // This might lead to a type issue.
    onChange(newTime);
  };

  const addMinutesToSelectedTime = (minutes: number) => {
    state.value &&
      state.setValue(
        state.value?.add({
          minutes: minutes,
        }),
      );
  };

  return (
    <I18nProvider locale={locale}>
      <div className={classNames(className, 'eds-timepicker__wrapper')}>
        <TimePickerArrowButton
          direction="left"
          disabled={disabled}
          aria-label={leftArrowButtonAriaLabel}
          onClick={() =>
            handleOnClickArrowButton(minuteIncrementForArrowButtons * -1)
          }
        />
        <BaseFormControl
          style={style}
          className={'eds-timepicker'}
          labelId={id}
          label={label}
          labelProps={{ ...labelProps }}
          ref={mergeRefs(timeFieldRef, inputRef)}
          disabled={disabled}
          disableLabelAnimation
          labelTooltip={labelTooltip}
          {...fieldProps}
          variant={variant}
          feedback={feedback}
        >
          {state.segments.map((segment, i) => (
            <FieldSegment segment={segment} state={state} key={i} />
          ))}
        </BaseFormControl>
        <TimePickerArrowButton
          direction="right"
          disabled={disabled}
          aria-label={rightArrowButtonAriaLabel}
          onClick={() =>
            handleOnClickArrowButton(minuteIncrementForArrowButtons)
          }
        />
      </div>
    </I18nProvider>
  );
};
