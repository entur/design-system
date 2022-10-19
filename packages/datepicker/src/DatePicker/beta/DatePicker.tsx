import React, { useEffect, useRef } from 'react';

import { useDatePickerState } from '@react-stately/datepicker';
import { useDatePicker } from '@react-aria/datepicker';
import { useLocale } from '@react-aria/i18n';
import { useFloating, offset, flip, shift } from '@floating-ui/react-dom';
import FocusLock from 'react-focus-lock';
import classNames from 'classnames';

import type { DateValue } from '@react-types/datepicker';

import { useOnClickOutside } from '@entur/utils';
import { space } from '@entur/tokens';
import { CalendarIcon } from '@entur/icons';
import { VariantType } from '@entur/form';

import { DateField } from './DateField';
import { Calendar } from './Calendar';
import { CalendarButton } from '../../shared/CalendarButton';

import './DatePicker.scss';

type DatePickerProps = {
  /** Den valgte datoen. Dato i '@internationalized/date'-pakkens format */
  selectedDate: DateValue;
  /** Kalles når tiden endres. Dato i '@internationalized/date'-pakkens format */
  onChange: (date: DateValue) => void;
  /** Ledetekst for inputfeltet til DatePicker */
  label: string;
  /** BCP47-språkkoden til locale-en du ønsker å bruke.
   * @default Brukerenhetens selvvalgte locale
   */
  locale?: string;
  /** Viser den gjeldende tidssonen hvis en er valgt (krever at tid også vises)
   * @default false
   */
  showTimeZone?: boolean;
  /** Viser tidspunkt i tillegg til dato hvis det er tilgjengelig */
  showTime?: boolean;
  /** Varselmelding, som vil komme under DatePicker sitt inputfelt */
  feedback?: string;
  /** Valideringsvariant */
  variant?: VariantType;
  disabled?: boolean;
  /** Ekstra klassenavn */
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any;
};

export const DatePickerBeta = ({
  selectedDate: value,
  onChange,
  label,
  locale: customLocale,
  showTimeZone,
  showTime,
  disabled,
  className,
  style,
  variant,
  feedback,
  ...rest
}: DatePickerProps) => {
  let { locale } = useLocale();
  if (customLocale) locale = customLocale;

  const datePickerRef = useRef<HTMLDivElement | null>(null);
  const calendarRef = useRef<HTMLDivElement | null>(null);
  const dateFieldRef = useRef<HTMLDivElement | null>(null);

  // TODO SE PÅ OM VERDIER I USE...STATE BURDE VÆRE I USE... I STEDET
  const state = useDatePickerState({
    value,
    onChange,
    label,
    ...rest,
  });
  const {
    groupProps,
    labelProps,
    fieldProps,
    buttonProps,
    dialogProps,
    calendarProps,
  } = useDatePicker(
    { value, label: label, isDisabled: disabled, ...rest },
    state,
    datePickerRef,
  );

  // calculations for floating-UI popover position
  const { x, y, reference, floating, strategy } = useFloating({
    placement: 'bottom-start',
    middleware: [
      offset(space.extraSmall),
      flip(),
      shift({ padding: space.extraSmall }),
    ],
  });

  // set focus to selected date or today if available on open calendar
  useEffect(() => {
    const gridCellPrefix = 'eds-datepicker__calendar__grid__cell';

    const selectedCell = calendarRef.current?.getElementsByClassName(
      gridCellPrefix + '--selected',
    )[0] as HTMLElement | undefined;
    const todayCell = calendarRef.current?.getElementsByClassName(
      gridCellPrefix + '--today',
    )[0] as HTMLElement | undefined;

    if (selectedCell) selectedCell.focus();
    else if (todayCell) todayCell.focus();
  }, [state.isOpen]);

  useOnClickOutside([calendarRef], () => {
    state.setOpen(false);
  });

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') state.setOpen(false);
    };
    calendarRef.current?.addEventListener('keydown', keyDownHandler);
    return () =>
      calendarRef.current?.removeEventListener('keydown', keyDownHandler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={classNames('eds-datepicker', className)}>
      <div
        {...groupProps}
        ref={node => {
          datePickerRef.current = node;
          reference(node);
        }}
        className="eds-datepicker__datefield__wrapper"
      >
        <DateField
          {...fieldProps}
          selectedDate={value}
          onChange={onChange}
          label={label}
          labelProps={labelProps}
          locale={locale}
          showTimeZone={showTimeZone}
          showTime={showTime}
          ref={dateFieldRef}
          disabled={disabled}
          className={classNames('eds-datepicker__datefield', {
            'eds-datepicker__datefield--disabled': disabled,
          })}
          variant={variant}
          feedback={feedback}
        />
        {!disabled && (
          <CalendarButton
            {...buttonProps}
            onPress={() => state.setOpen(!state.isOpen)}
            className="eds-datepicker__open-calendar-button"
          >
            <CalendarIcon />
          </CalendarButton>
        )}
      </div>
      <FocusLock disabled={!state.isOpen} returnFocus>
        <Calendar
          {...dialogProps}
          {...calendarProps}
          selectedDate={value}
          onChange={(dateValue: DateValue) => {
            onChange(dateValue);
            state.setOpen(false);
          }}
          locale={locale}
          disabled={disabled}
          ref={node => {
            calendarRef.current = node;
            floating(node);
          }}
          // styling for floating-UI popover
          style={{
            display: state.isOpen ? 'block' : 'none',
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
            zIndex: 10,
          }}
        />
      </FocusLock>
    </div>
  );
};
