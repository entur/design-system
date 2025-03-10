import React, { useEffect, useRef, useState } from 'react';
import { Time, parseTime, toTime } from '@internationalized/date';
import { useTimeField } from '@react-aria/datepicker';
import { I18nProvider, useLocale } from '@react-aria/i18n';
import { useTimeFieldState } from '@react-stately/datepicker';
import classNames from 'classnames';

import type {
  TimeValue,
  AriaTimeFieldProps,
  MappedTimeValue,
} from '@react-types/datepicker';

import { BaseFormControlProps, TextField } from '@entur/form';
import { ClockIcon } from '@entur/icons';
import { mergeRefs, VariantType } from '@entur/utils';

import './SimpleTimePicker.scss';

enum inputResult {
  RESET_TIME,
  INVALID,
}

/** @deprecated use variant="information" instead */
const info = 'info';
/** @deprecated use variant="negative" instead */
const error = 'error';

export type SimpleTimePickerProps<TimeType extends TimeValue> = {
  /** Den valgte tiden. Tid i '@internationalized/date'-pakkens format */
  selectedTime: TimeType | null;
  /** Kalles når tiden endres. Tid i '@internationalized/date'-pakkens format */
  onChange?: (
    value: MappedTimeValue<TimeType> | null,
  ) => void | React.Dispatch<React.SetStateAction<TimeValue | null>>;
  /** Label til TimePicker */
  label: string;
  /** Viser sekund i tillegg til time og minutt
   * @default false
   */
  showSeconds?: boolean;
  /** Viser et klokkeikonet for å klarere indikere at dette
   * er en tidsvelger
   * @default false
   */
  showClockIcon?: boolean | 'right' | 'left';
  /** Velger hvor mye luft det skal være på sidene av klokkeslettet
   * @default 'default'
   */
  padding?: 'default' | 'large';
  /** Varselmelding, som vil komme under TimePicker */
  feedback?: string;
  /** Valideringsvariant*/
  variant?: VariantType | typeof error | typeof info;
  /** Tekst eller ikon som vises foran skjema-elementet */
  prepend?: React.ReactNode;
  /** Tekst eller ikon som vises etter skjema-elementet */
  append?: React.ReactNode;
  labelTooltip?: React.ReactNode;
  disabled?: boolean;
  readOnly?: boolean;
  inputRef?: React.ForwardedRef<HTMLInputElement>;
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
  | 'locale'
  | 'isReadOnly'
  | 'isDisabled'
  | 'locale'
> &
  Omit<Partial<BaseFormControlProps>, 'children'>;

export const SimpleTimePicker = <TimeType extends TimeValue>({
  append,
  className,
  disabled,
  feedback,
  showClockIcon = 'right',
  inputRef,
  label,
  labelTooltip,
  onChange,
  padding = 'default',
  prepend,
  readOnly,
  selectedTime,
  showSeconds,
  style,
  variant,
  ...rest
}: SimpleTimePickerProps<TimeType>) => {
  const [inputText, setInputText] = useState('');
  const timeFieldRef = useRef<HTMLInputElement>(null);
  const [lastValidSelectedTime, setLastValidSelectedTime] =
    useState<MappedTimeValue<TimeType> | null>(null);

  const { locale } = useLocale();

  const state = useTimeFieldState({
    onChange,
    label: label,
    locale,
    value: selectedTime,
    hideTimeZone: true,
    isDisabled: disabled,
    isReadOnly: readOnly,
    ...rest,
  });
  const { labelProps, fieldProps } = useTimeField<TimeType>(
    { ...rest, label: label },
    state,
    timeFieldRef,
  );

  useEffect(() => {
    updateInputWithSelectedTime();
    // @ts-expect-error TimeType and MappedTimeValue<TimeType> is actually the same
    if (selectedTime !== null) setLastValidSelectedTime(selectedTime);
  }, [selectedTime?.toString()]);

  const updateInputWithSelectedTime = () => {
    const selectedTimeString = getStringFromTimeValue(selectedTime);
    setInputText(selectedTimeString);

    const timeFieldIsFocused = document.activeElement === timeFieldRef?.current;
    if (selectedTimeString === '' && !timeFieldIsFocused)
      addPlaceholderToInput();
  };

  const getStringFromTimeValue = (timeValue: TimeValue | null) => {
    if (timeValue === null) return '';

    const timeObject = 'day' in timeValue ? toTime(timeValue) : timeValue;

    if (showSeconds) return timeObject.toString().slice(0, 8);

    return timeObject.toString().slice(0, 5);
  };

  const addPlaceholderToInput = () => {
    if (showSeconds) setInputText('–– : –– : ––');
    else setInputText('–– : ––');
  };

  const handleChangeTime = () => {
    const newTime = getValueForOnChangeFromInput();

    if (newTime === inputResult.INVALID) {
      return updateInputWithSelectedTime();
    }

    if (newTime?.toString() !== selectedTime?.toString()) onChange?.(newTime);
  };

  const getValueForOnChangeFromInput = () => {
    const formatedTimeString = formatTimeString(inputText);
    const newTimeObject = formatedTimeStringToTimeObject(formatedTimeString);

    if (newTimeObject === inputResult.INVALID) {
      return inputResult.INVALID;
    }
    if (newTimeObject === inputResult.RESET_TIME) {
      return null;
    }

    const updatedSelectedTime =
      getSelectedTimeWithTimeFromObject(newTimeObject);

    return updatedSelectedTime;
  };

  const formatTimeString = (timeString: string): string | inputResult => {
    if (timeString.length === 0) return inputResult.RESET_TIME;
    if (timeString.length < 3 || timeString.length > 8)
      return inputResult.INVALID;

    const numberOfColons = (timeString.match(new RegExp(':', 'g')) || [])
      .length;
    const stringLength = timeString.length;

    // targets 'd:dd:dd' and 'dd:dd:dd'
    if (numberOfColons === 2 && stringLength >= 7) {
      return timeString.padStart(8, '0');
    }

    // targets 'd:dd' and 'dd:dd'
    if (numberOfColons === 1) {
      return timeString.padStart(5, '0');
    }

    if (stringLength > 6) return inputResult.INVALID;

    const stringLengthIsEven = stringLength % 2 == 0;

    const hourString = stringLengthIsEven
      ? timeString.slice(0, 2)
      : timeString.slice(0, 1);
    const minuteString = stringLengthIsEven
      ? timeString.slice(2, 4)
      : timeString.slice(1, 3);
    const secondString = (() => {
      const stringSlice = stringLengthIsEven
        ? timeString.slice(4, 6)
        : timeString.slice(3, 5);
      if (stringSlice === '') return '00';
      return stringSlice;
    })();

    const timeStringWithColon =
      hourString.padStart(2, '0') +
      ':' +
      minuteString +
      (showSeconds ? ':' + secondString : '');

    return timeStringWithColon;
  };

  const formatedTimeStringToTimeObject = (
    formatedTimeString: string | inputResult,
  ): Time | inputResult => {
    if (formatedTimeString === inputResult.INVALID) return inputResult.INVALID;
    if (formatedTimeString === inputResult.RESET_TIME)
      return inputResult.RESET_TIME;

    const isNumberTest = /^\d+$/;
    const hourString = formatedTimeString.slice(0, 2);
    const minuteString = formatedTimeString.slice(3, 5);
    const secondString = formatedTimeString.slice(6, 8);
    if (
      hourString.match(isNumberTest) &&
      minuteString.match(isNumberTest) &&
      (secondString === '' || secondString.match(isNumberTest))
    ) {
      try {
        const timeObject = parseTime(formatedTimeString);
        return timeObject;
      } catch (e) {
        return inputResult.INVALID;
      }
    }

    return inputResult.INVALID;
  };

  const getSelectedTimeWithTimeFromObject = (
    newTime: Time,
  ): MappedTimeValue<TimeType> => {
    const selectedTimeWithUpdateTime = (
      lastValidSelectedTime ?? new Time()
    ).set({
      hour: newTime.hour,
      minute: newTime.minute,
      second: newTime.second,
    }) as MappedTimeValue<TimeType>;

    return selectedTimeWithUpdateTime;
  };

  const {
    onBlur,
    onClick,
    onDragStart,
    onFocus,
    onKeyDown,
    onKeyUp,
    onMouseDown,
    onPointerDown,
    onPointerUp,
    ...usedFieldProps
  } = fieldProps;

  return (
    <I18nProvider locale={locale}>
      <TextField
        append={
          append ||
          (showClockIcon === true || showClockIcon === 'right' ? (
            <ClockIcon onClick={() => timeFieldRef?.current?.focus()} inline />
          ) : undefined)
        }
        className={classNames('eds-simple-timepicker', {
          'eds-simple-timepicker--padding-large': padding === 'large',
          'eds-simple-timepicker--show-seconds': showSeconds,
          'eds-simple-timepicker--hide-clock': !showClockIcon,
          'eds-simple-timepicker--has-tooltip': labelTooltip !== undefined,
        })}
        disabled={disabled}
        disableLabelAnimation
        feedback={feedback}
        label={label}
        labelProps={labelProps}
        labelTooltip={labelTooltip}
        onBlur={() => {
          handleChangeTime();
          if (selectedTime === null) {
            addPlaceholderToInput();
          }
        }}
        onChange={e => setInputText(e.target.value)}
        onFocus={() => {
          if (selectedTime === null) {
            setInputText('');
          }
        }}
        onKeyDown={({ key }) => {
          if (key === 'Enter') handleChangeTime();
        }}
        placeholder={showSeconds ? '–– : –– : ––' : '–– : ––'}
        prepend={
          prepend ||
          (showClockIcon === 'left' ? (
            <ClockIcon onClick={() => timeFieldRef?.current?.focus()} />
          ) : undefined)
        }
        readOnly={readOnly}
        ref={mergeRefs(timeFieldRef, inputRef)}
        style={style}
        value={inputText}
        variant={variant}
        {...usedFieldProps}
      />
    </I18nProvider>
  );
};
