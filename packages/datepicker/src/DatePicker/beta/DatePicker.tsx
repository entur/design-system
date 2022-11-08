import React, { ReactNode, useEffect, useRef } from 'react';

import { useDatePickerState } from '@react-stately/datepicker';
import { useDatePicker } from '@react-aria/datepicker';
import { I18nProvider } from '@react-aria/i18n';
import { useFloating, offset, flip, shift } from '@floating-ui/react-dom';
import FocusLock from 'react-focus-lock';
import classNames from 'classnames';

import type { CalendarDate } from '@internationalized/date';
import type {
  DateValue,
  SpectrumDatePickerProps,
} from '@react-types/datepicker';

import {
  ConditionalWrapper,
  useOnClickOutside,
  useWindowDimensions,
} from '@entur/utils';
import { space, zIndexes } from '@entur/tokens';
import { CalendarIcon } from '@entur/icons';
import { Modal } from '@entur/modal';

import type { VariantType } from '@entur/form';

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
  /** Viser tidspunkt i tillegg til dato.
   * OBS: selectedDate må være av typen CalendarDateTime eller ZonedDateTime
   */
  showTime?: boolean;
  /** Tidligste gyldige datovalg.
   * Eks: today(getLocalTimeZone()) == i dag i lokal tidssone. */
  minDate?: CalendarDate;
  /** Seneste gyldige datovalg.
   * Eks: today(getLocalTimeZone()) == i dag i lokal tidssone
   *
   * OBS: Hvis du bruker dato med tid vil det være til, men ikke med denne datoen */
  maxDate?: CalendarDate;
  /** Funksjon som tar inn en dato og sier om den er utilgjengelig.
   * Eks. (date) => isWeekend(date, 'no-NO') == helgedager er ikke tilgjengelig */
  isDateUnavailable?: (date: DateValue) => boolean;
  /** Varselmelding, som vil komme under DatePicker sitt inputfelt */
  feedback?: string;
  /** Valideringsvariant */
  variant?: VariantType;
  /** Varselmelding som forteller om ugyldig dato
   * @default "Ugyldig dato"
   */
  validationFeedback?: string;
  /** Valideringsvariant for melding om ugyldig dato
   * @default "error"
   */
  validationVariant?: VariantType;
  disabled?: boolean;
  /** Hvis true vil kalenderen alltid vises i en popover når den åpnes
   *  @default false
   */
  disableModal?: boolean;
  labelTooltip?: React.ReactNode;
  /** Skjermlesertest som forklarer navigasjon i kalenderen. Oversettes automatisk for engelsk locale, men ikke andre språk.
   * @default 'Bruk piltastene til å navigere mellom datoer'
   */
  navigationDescription?: string;
  /** Ekstra klassenavn */
  className?: string;
  style?: React.CSSProperties;
} & Omit<
  SpectrumDatePickerProps<DateValue>,
  | 'value'
  | 'onChange'
  | 'label'
  | 'hideTimeZone'
  | 'placeholder'
  | 'minValue'
  | 'maxValue'
>;

export const DatePickerBeta = ({
  selectedDate: value,
  onChange,
  locale,
  disabled: isDisabled,
  showTime,
  showTimeZone = false,
  className,
  style,
  variant,
  feedback,
  validationVariant,
  validationFeedback,
  disableModal = false,
  labelTooltip,
  navigationDescription,
  minDate: minValue,
  maxDate: maxValue,
  ...rest
}: DatePickerProps) => {
  const CALENDAR_MODAL_MAX_SCREEN_WIDTH = 1000;
  const datePickerRef = useRef<HTMLDivElement | null>(null);
  const calendarRef = useRef<HTMLDivElement | null>(null);
  const dateFieldRef = useRef<HTMLDivElement | null>(null);

  const { width } = useWindowDimensions();

  const state = useDatePickerState({
    ...rest,
    minValue,
    maxValue,
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
  } = useDatePicker(
    { isDisabled, minValue, maxValue, ...rest },
    state,
    datePickerRef,
  );

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
    <>
      {state.isOpen && (
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
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
              zIndex: zIndexes.popover,
            }}
          />
        </FocusLock>
      )}
    </>
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
            showTime={showTime}
            showTimeZone={showTimeZone}
            ref={dateFieldRef}
            variant={variant}
            feedback={feedback}
            validationVariant={validationVariant}
            validationFeedback={validationFeedback}
            labelTooltip={labelTooltip}
            className={classNames('eds-datepicker__datefield', {
              'eds-datepicker__datefield--disabled': fieldProps.isDisabled,
            })}
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
