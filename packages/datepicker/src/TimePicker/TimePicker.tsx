import React, { useRef } from 'react';
import classNames from 'classnames';
import { useTimeField } from '@react-aria/datepicker';
import { I18nProvider, useLocale } from '@react-aria/i18n';
import { useTimeFieldState } from '@react-stately/datepicker';

import type {
  TimePickerProps as ReactAriaTimePickerProps,
  TimeValue,
} from '@react-types/datepicker';

import { BaseFormControl, VariantType } from '@entur/form';
import { useRandomId, mergeRefs } from '@entur/utils';

import { TimeSegment } from './TimeSegment';
import { TimePickerArrowButton } from './TimePickerArrowButton';

import './TimePicker.scss';

export type TimePickerProps = {
  /** Den valgte tiden. Tid i '@internationalized/date'-pakkens format */
  selectedTime?: TimeValue;
  /** Kalles når tiden endres. Tid i '@internationalized/date'-pakkens format */
  onChange: (value: TimeValue) => void;
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
  /** Varselmelding, som vil komme under TimePicker */
  feedback?: string;
  /** Valideringsvariant */
  variant?: VariantType;
  labelTooltip?: React.ReactNode;
  disabled?: boolean;
  /** Ekstra klassenavn */
  className?: string;
  style?: React.CSSProperties;
} & Omit<
  ReactAriaTimePickerProps<TimeValue>,
  'onChange' | 'label' | 'hideTimeZone' | 'placeholder'
>;

export const TimePicker = React.forwardRef<HTMLDivElement, TimePickerProps>(
  (
    {
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
      children,
      ...rest
    },
    ref,
  ) => {
    let { locale } = useLocale();
    if (customLocale) locale = customLocale;

    const state = useTimeFieldState({
      onChange,
      label,
      locale,
      value: selectedTime,
      hideTimeZone: !showTimeZone,
      ...rest,
    });
    const timeFieldRef = useRef(null);
    const { labelProps, fieldProps } = useTimeField(rest, state, timeFieldRef);
    const id = useRandomId('timepicker');

    const addMinutesToSelectedTime = (minutes: number) => {
      state.value &&
        state.setValue(
          state.value &&
            state.value.add({
              minutes: minutes,
            }),
        );
    };

    const isAmPm = state.segments.some(
      segment => segment.text === 'AM' || segment.text === 'PM',
    );

    return (
      <I18nProvider locale={locale}>
        <div
          className={classNames(className, 'eds-timepicker__wrapper')}
          style={style}
        >
          <TimePickerArrowButton
            direction="left"
            disabled={disabled}
            aria-label={`Trekk fra ${minuteIncrementForArrowButtons} minutter`}
            onClick={() =>
              addMinutesToSelectedTime(minuteIncrementForArrowButtons * -1)
            }
          />
          <BaseFormControl
            className={'eds-timepicker'}
            labelId={id}
            label={label}
            labelProps={{ ...labelProps }}
            ref={mergeRefs(timeFieldRef, ref)}
            disabled={disabled}
            disableLabelAnimation
            labelTooltip={labelTooltip}
            {...fieldProps}
            variant={variant}
            feedback={feedback}
          >
            {state.segments.map((segment, i) => (
              <TimeSegment
                segment={segment}
                state={state}
                isAmPm={isAmPm}
                index={i}
                key={i}
              />
            ))}
          </BaseFormControl>
          <TimePickerArrowButton
            direction="right"
            disabled={disabled}
            aria-label={`Legg til ${minuteIncrementForArrowButtons} minutter`}
            onClick={() =>
              addMinutesToSelectedTime(minuteIncrementForArrowButtons)
            }
          />
        </div>
      </I18nProvider>
    );
  },
);
