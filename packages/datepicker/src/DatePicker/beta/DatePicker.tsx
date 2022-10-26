import React, { ReactNode, useEffect, useRef } from 'react';

import { useDatePickerState } from '@react-stately/datepicker';
import { useDatePicker } from '@react-aria/datepicker';
import { I18nProvider } from '@react-aria/i18n';
import { useFloating, offset, flip, shift } from '@floating-ui/react-dom';
import FocusLock from 'react-focus-lock';
import classNames from 'classnames';

import type { DateValue } from '@react-types/datepicker';

import {
  ConditionalWrapper,
  useOnClickOutside,
  useWindowDimensions,
} from '@entur/utils';
import { space } from '@entur/tokens';
import { CalendarIcon } from '@entur/icons';
import { VariantType } from '@entur/form';
import { Modal } from '@entur/modal';

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
  /** Hvis true vil kalenderen alltid vises i en popover når den åpnes
   *  @default false
   */
  disableModal?: boolean;
  /** Ekstra klassenavn */
  className?: string;
  style?: React.CSSProperties;
  /** Skjermlesertest som forklarer navigasjon i kalenderen. Oversettes automatisk for engelsk locale, men ikke andre språk.
   * @default 'Bruk piltastene til å navigere mellom datoer'
   */
  navigationDescription?: string;
  [key: string]: any;
};

export const DatePickerBeta = ({
  selectedDate: value,
  onChange,
  locale,
  disabled: isDisabled,
  className,
  style,
  variant,
  feedback,
  disableModal = false,
  navigationDescription,
  ...rest
}: DatePickerProps) => {
  const CALENDAR_MODAL_MAX_SCREEN_WIDTH = 1000;
  const datePickerRef = useRef<HTMLDivElement | null>(null);
  const calendarRef = useRef<HTMLDivElement | null>(null);
  const dateFieldRef = useRef<HTMLDivElement | null>(null);

  const { width } = useWindowDimensions();

  const state = useDatePickerState({
    ...rest,
    value,
    onChange,
  });
  const {
    groupProps,
    labelProps,
    fieldProps,
    buttonProps,
    dialogProps,
    calendarProps,
  } = useDatePicker({ isDisabled, ...rest }, state, datePickerRef);

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') state.setOpen(false);
    };
    calendarRef.current?.addEventListener('keydown', keyDownHandler);
    return () =>
      calendarRef.current?.removeEventListener('keydown', keyDownHandler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // calculations for floating-UI popover position
  const { x, y, reference, floating, strategy } = useFloating({
    placement: 'bottom-start',
    middleware: [
      offset(space.extraSmall),
      flip(),
      shift({ padding: space.extraSmall }),
    ],
  });

  useOnClickOutside([calendarRef], () => {
    state.setOpen(false);
  });

  const handleCalendarButtonOnClick = (calendarIsOpen: boolean) => {
    if (!calendarIsOpen) {
      state.setOpen(true);
      setFocusToRelevantDate();
    } else {
      state.setOpen(false);
    }
  };

  const setFocusToRelevantDate = () => {
    const gridCellPrefix = 'eds-datepicker__calendar__grid__cell';

    const selectedCell = calendarRef.current?.getElementsByClassName(
      gridCellPrefix + '--selected',
    )[0] as HTMLElement | undefined;
    const todayCell = calendarRef.current?.getElementsByClassName(
      gridCellPrefix + '--today',
    )[0] as HTMLElement | undefined;

    if (selectedCell) selectedCell.focus();
    else if (todayCell) todayCell.focus();
  };

  const popoverCalendar = (
    <FocusLock disabled={!state.isOpen} returnFocus>
      <Calendar
        {...dialogProps}
        {...calendarProps}
        onChange={(dateValue: DateValue) => {
          onChange(dateValue);
          state.setOpen(false);
        }}
        disabled={calendarProps.isDisabled}
        ref={node => {
          calendarRef.current = node;
          floating(node);
        }}
        navigationDescription={navigationDescription}
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
  );

  const modalCalendar = (
    <Modal
      size={'small'}
      title=""
      open={state.isOpen}
      onDismiss={() => state.setOpen(false)}
      closeOnClickOutside
      className="eds-datepicker__calendar-modal"
    >
      <Calendar
        {...dialogProps}
        {...calendarProps}
        onChange={(dateValue: DateValue) => {
          onChange(dateValue);
          state.setOpen(false);
        }}
        disabled={calendarProps.isDisabled}
        ref={calendarRef}
        navigationDescription={navigationDescription}
      />
    </Modal>
  );

  return (
    <ConditionalWrapper
      condition={locale !== undefined}
      wrapper={(child: ReactNode) => (
        <I18nProvider locale={locale}>{child}</I18nProvider>
      )}
    >
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
            selectedDate={state.value}
            label={rest.label}
            labelProps={labelProps}
            ref={dateFieldRef}
            className={classNames('eds-datepicker__datefield', {
              'eds-datepicker__datefield--disabled': fieldProps.isDisabled,
            })}
            variant={variant}
            feedback={feedback}
          />
          {!fieldProps.isDisabled && (
            <CalendarButton
              {...buttonProps}
              onPress={() => handleCalendarButtonOnClick(state.isOpen)}
              className="eds-datepicker__open-calendar-button"
            >
              <CalendarIcon />
            </CalendarButton>
          )}
          {width > CALENDAR_MODAL_MAX_SCREEN_WIDTH || disableModal
            ? popoverCalendar
            : modalCalendar}
        </div>
      </div>
    </ConditionalWrapper>
  );
};
