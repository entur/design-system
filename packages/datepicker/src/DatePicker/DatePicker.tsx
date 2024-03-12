import React, { ReactNode, useRef } from 'react';

import { useDatePickerState } from '@react-stately/datepicker';
import { useDatePicker } from '@react-aria/datepicker';
import { I18nProvider } from '@react-aria/i18n';
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
} from '@floating-ui/react-dom';
import FocusLock from 'react-focus-lock';
import classNames from 'classnames';

import { CalendarDate, DateValue } from '@internationalized/date';
import type {
  AriaDatePickerProps,
  MappedDateValue,
} from '@react-types/datepicker';

import {
  ConditionalWrapper,
  useOnClickOutside,
  useOnEscape,
  useWindowDimensions,
} from '@entur/utils';
import { space, zIndexes } from '@entur/tokens';
import { CalendarIcon } from '@entur/icons';
import { Modal } from '@entur/modal';

import type { VariantType } from '@entur/form';

import { DateField } from './DateField';
import { Calendar } from './Calendar';
import { CalendarButton } from '../shared/CalendarButton';
import { convertValueToType, lastMillisecondOfDay } from '../shared/utils';

import './DatePicker.scss';

export type DatePickerProps<DateType extends DateValue> = {
  /** Den valgte datoen. Dato i '@internationalized/date'-pakkens format */
  selectedDate: DateType | null;
  /** Kalles når tiden endres. Dato i '@internationalized/date'-pakkens format */
  onChange: (value: MappedDateValue<DateType> | null) => void;
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
  /** Slå på visning av ukenummere i kalenderen. Overskriften for ukenummer-kolonnen
   * kan endres med prop-en 'weekNumberHeader'
   * @default false */
  showWeekNumbers?: boolean;
  /** Overskrift som vises for ukenummer-kolonnen. Vises kun hvis 'showWeekNumbers' er true.
   * @default '#' */
  weekNumberHeader?: string;
  /** Hvis true vil kalenderen alltid vises i en popover når den åpnes
   *  @default false
   */
  disableModal?: boolean;
  /** Maxbredden til viewport-en for at modal skal vises
   *  @default 1000
   */
  modalTreshold?: number;
  labelTooltip?: React.ReactNode;
  /** Skjermlesertest som forklarer navigasjon i kalenderen. Oversettes automatisk for engelsk locale, men ikke andre språk.
   * @default 'Bruk piltastene til å navigere mellom datoer'
   */
  navigationDescription?: string;
  /** Tvinger typen på onChange til den gitte typen.
   * Dette er nyttig når utgangsverdien din er 'null', men du ønsker at
   * DatePicker alltid skal returnere f.eks ZonedDateTime.
   *
   * Som standard returnerer onChange DateValue basert på selectedDate,
   * eller CalendarDate hvis selectedDate er 'null'.
   *
   * @default undefined
   */
  forcedReturnType?: 'CalendarDate' | 'CalendarDateTime' | 'ZonedDateTime';
  /** Brukes for å legge til klassenavn på spesifikke datoer i kalenderen.
   *  Tar inn en dato og skal returnere klassenavnet som skal legges til den datoen.
   *  @default undefined
   *  @example (date) => isWeekend(date, 'no-NO') ? 'weekend' : ''
   *
   *  OBS: hvis stylingen er meningsbærende bør du bruke ariaLabelForDate i tillegg for å beskrive
   *  meningen til skjermlesere o.l.
   */
  classNameForDate?: (date: CalendarDate) => string;
  /** Legger til teksten som returneres på datoen i kalenderen sin aria-label.
   *  Bør brukes sammen med classNameForDate hvis styling-endringene gjort der er meningsbærende.
   *  @default undefined
   *  @example (date) => isWeekend(date, 'no-NO') ? 'helgedag' : ''
   */
  ariaLabelForDate?: (date: CalendarDate) => string;
  /** Ekstra klassenavn */
  className?: string;
  style?: React.CSSProperties;
} & Omit<
  AriaDatePickerProps<DateType>,
  | 'value'
  | 'onChange'
  | 'label'
  | 'hideTimeZone'
  | 'placeholder'
  | 'minValue'
  | 'maxValue'
>;

export const DatePicker = <DateType extends DateValue>({
  selectedDate,
  onChange,
  locale,
  disabled,
  showTime,
  showTimeZone = false,
  classNameForDate,
  className,
  style,
  variant,
  feedback,
  validationVariant,
  validationFeedback,
  showWeekNumbers,
  weekNumberHeader,
  disableModal = false,
  labelTooltip,
  navigationDescription,
  minDate,
  maxDate,
  modalTreshold = 1000,
  forcedReturnType,
  ariaLabelForDate,
  ...rest
}: DatePickerProps<DateType>) => {
  const CALENDAR_MODAL_MAX_SCREEN_WIDTH = modalTreshold;
  const datePickerRef = useRef<HTMLDivElement | null>(null);
  const calendarRef = useRef<HTMLDivElement | null>(null);
  const dateFieldRef = useRef<HTMLDivElement | null>(null);

  const { width } = useWindowDimensions();

  const handleOnChange = (value: MappedDateValue<DateType> | null) => {
    if (forcedReturnType !== undefined) {
      return onChange(
        convertValueToType({
          value,
          type: forcedReturnType,
          timezone:
            value !== null && 'timezone' in value
              ? (value.timezone as string)
              : undefined,
        }) as MappedDateValue<DateType> | null,
      );
    }

    onChange(value);
  };

  const state = useDatePickerState({
    ...rest,
    minValue: minDate,
    // this weird logic makes sure the entire day is included if no time is provided in maxDate
    maxValue:
      'hour' in (maxDate ?? {})
        ? maxDate
        : maxDate !== undefined
        ? lastMillisecondOfDay(maxDate)
        : undefined,
    value: selectedDate,
    onChange: handleOnChange,
    granularity: showTime ? 'minute' : rest.granularity,
    isDisabled: disabled,
  });
  const {
    groupProps,
    labelProps,
    fieldProps,
    buttonProps,
    dialogProps,
    calendarProps,
  } = useDatePicker({ ...rest }, state, datePickerRef);

  // calculations for floating-UI popover position
  const { x, y, reference, floating, strategy } = useFloating({
    whileElementsMounted: autoUpdate,
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

  useOnEscape(calendarRef, () => {
    state.setOpen(false);
  });

  const calendarSharedProps = {
    ...dialogProps,
    ...calendarProps,
    disabled,
    navigationDescription,
    onSelectedCellClick: () => state.setOpen(false),
    selectedDate,
    onChange: handleOnChange,
    minDate,
    maxDate,
    calendarRef,
    classNameForDate,
    ariaLabelForDate,
    showWeekNumbers,
    weekNumberHeader,
  };

  const useModal =
    typeof width !== 'undefined' &&
    width <= CALENDAR_MODAL_MAX_SCREEN_WIDTH &&
    !disableModal;

  const popoverCalendar = (
    <div
      // styling for floating-UI popover
      style={{
        position: strategy,
        top: y ?? 0,
        left: x ?? 0,
        zIndex: zIndexes.popover,
      }}
      ref={node => {
        floating(node);
      }}
    >
      <FocusLock disabled={!state.isOpen || useModal} returnFocus>
        {state.isOpen && <Calendar {...calendarSharedProps} />}
      </FocusLock>
    </div>
  );

  const modalCalendar = (
    <Modal
      size="small"
      title=""
      open={state.isOpen}
      onDismiss={() => state.setOpen(false)}
      className="eds-datepicker__calendar-modal"
    >
      <Calendar {...calendarSharedProps} />
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
          id={undefined}
          className="eds-datepicker__datefield__wrapper"
        >
          <DateField
            {...fieldProps}
            selectedDate={selectedDate}
            onChange={handleOnChange}
            label={rest.label}
            labelProps={labelProps}
            disabled={disabled}
            minDate={minDate}
            maxDate={maxDate}
            showTime={showTime}
            showTimeZone={showTimeZone}
            ref={dateFieldRef}
            variant={variant}
            feedback={feedback}
            validationVariant={validationVariant}
            validationFeedback={validationFeedback}
            labelTooltip={labelTooltip}
            className={classNames('eds-datepicker__datefield', {
              'eds-datepicker__datefield--disabled': disabled,
            })}
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
          {useModal ? modalCalendar : popoverCalendar}
        </div>
      </div>
    </ConditionalWrapper>
  );
};
