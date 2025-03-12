import React, { ReactNode, useRef } from 'react';

import {
  DatePickerStateOptions,
  useDatePickerState,
} from '@react-stately/datepicker';
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

import type { BaseFormControlProps } from '@entur/form';
import type { VariantType } from '@entur/utils';

import { DateField, DateFieldProps } from './DateField';
import { Calendar } from './Calendar';
import { CalendarButton } from '../shared/CalendarButton';
import { convertValueToType, lastMillisecondOfDay } from '../shared/utils';

import './DatePicker.scss';

/** @deprecated use variant="information" instead */
const info = 'info';
/** @deprecated use variant="negative" instead */
const error = 'error';

export type DatePickerProps<DateType extends DateValue> = Omit<
  DateFieldProps<DateType>,
  'labelProps' | 'fieldProps' | 'groupProps' | 'dateFieldRef'
> & {
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
};

export const DatePicker = <DateType extends DateValue>({
  selectedDate,
  onChange,
  label,
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
  append,
  prepend,
  granularity,
  ...rest
}: DatePickerProps<DateType>) => {
  const CALENDAR_MODAL_MAX_SCREEN_WIDTH = modalTreshold;
  const datePickerRef = useRef<HTMLDivElement | null>(null);
  const calendarRef = useRef<HTMLDivElement | null>(null);

  const { width } = useWindowDimensions();

  const handleOnChange = (value: MappedDateValue<DateType> | null) => {
    if (forcedReturnType !== undefined || !selectedDate) {
      return onChange(
        convertValueToType({
          value,
          type: forcedReturnType ?? 'ZonedDateTime',
          timezone:
            value !== null && 'timezone' in value
              ? (value.timezone as string)
              : undefined,
        }) as MappedDateValue<DateType> | null,
      );
    }

    onChange(value);
  };

  const _props: DatePickerStateOptions<DateType> = {
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
    granularity: granularity ?? showTime ? 'minute' : 'day',
    isDisabled: disabled,
  };

  const state = useDatePickerState(_props);
  const {
    groupProps,
    labelProps,
    fieldProps,
    buttonProps,
    dialogProps,
    calendarProps,
  } = useDatePicker(_props, state, datePickerRef);

  // calculations for floating-UI popover position
  const { refs, floatingStyles, update } = useFloating({
    whileElementsMounted: (ref, float, update) =>
      autoUpdate(ref, float, update, { elementResize: false }),
    placement: 'bottom-start',
    middleware: [
      offset(space.extraSmall2),
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

  const isModal =
    typeof width !== 'undefined' &&
    width <= CALENDAR_MODAL_MAX_SCREEN_WIDTH &&
    !disableModal;

  const popoverCalendar = (
    <div
      style={{ ...floatingStyles, zIndex: zIndexes.popover }}
      ref={refs.setFloating}
    >
      <FocusLock disabled={!state.isOpen || isModal} returnFocus>
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

  console.log(label, 'gran field', granularity, state.granularity);

  return (
    <ConditionalWrapper
      condition={locale !== undefined}
      wrapper={(child: ReactNode) => (
        <I18nProvider locale={locale}>{child}</I18nProvider>
      )}
    >
      <DateField
        append={
          !disabled && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {append}
              <CalendarButton
                {...buttonProps}
                onPress={() => {
                  state.setOpen(!state.isOpen);
                  update();
                }}
                className="eds-datepicker__open-calendar-button"
              >
                <CalendarIcon />
              </CalendarButton>
            </div>
          )
        }
        prepend={prepend}
        className={classNames('eds-datepicker', className, {
          'eds-datepicker--disabled': disabled,
        })}
        disabled={disabled}
        feedback={feedback}
        fieldProps={fieldProps}
        groupProps={groupProps}
        label={label}
        labelProps={labelProps}
        labelTooltip={labelTooltip}
        maxDate={maxDate}
        minDate={minDate}
        onChange={handleOnChange}
        dateFieldRef={node => {
          refs.setReference(node);
          datePickerRef.current = node;
        }}
        selectedDate={selectedDate}
        showTime={showTime}
        showTimeZone={showTimeZone}
        granularity={granularity ? state.granularity : undefined}
        style={style}
        validationFeedback={validationFeedback}
        validationVariant={validationVariant}
        variant={variant}
        {...fieldProps}
      />
      {isModal ? modalCalendar : popoverCalendar}
    </ConditionalWrapper>
  );
};
