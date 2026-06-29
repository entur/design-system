import React, { useEffect } from 'react';

import { I18nProvider, useLocale } from '@react-aria/i18n';
import { AriaCalendarProps, useCalendar } from '@react-aria/calendar';
import {
  CalendarStateOptions,
  useCalendarState,
} from '@react-stately/calendar';
import { CalendarDate, DateDuration, DateValue } from '@internationalized/date';
import { MappedDateValue } from '@react-types/datepicker';

import {
  createCalendar,
  getAdjustedMaxDate,
  handleOnChange,
} from '../shared/utils';
import { CalendarBase } from './CalendarBase';
import { CalendarCell } from './CalendarCell';
import { DateFieldProps } from './DateField';

import './Calendar.scss';

type ExtendedCalendarProps<DateType extends DateValue> = Omit<
  AriaCalendarProps<DateType>,
  | keyof BaseCalendarProps<DateType>
  | 'value'
  | 'label'
  | 'hideTimeZone'
  | 'placeholder'
  | 'placeholderValue'
  | 'defaultValue'
  | 'minValue'
  | 'maxValue'
>;

type BaseCalendarProps<DateType extends DateValue> = {
  selectedDate: DateType | null;
  onChange?: (selectedDate: MappedDateValue<DateType> | null) => void;
  navigationDescription?: string;
  style?: React.CSSProperties;
  /** Ekstra klassenavn */
  className?: string;
  onSelectedCellClick?: () => void;
  onCellClick?: () => void;
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
  /** Slå på visning av ukenummere i kalenderen. Overskriften for ukenummer-kolonnen
   * kan endres med prop-en 'weekNumberHeader'
   * @default false */
  showWeekNumbers?: boolean;
  /** Overskrift som vises for ukenummer-kolonnen. Vises kun hvis 'showWeekNumbers' er true.
   * @default 'uke' */
  weekNumberHeader?: string;
  /** Vis datoer som ligger utenfor den viste måneden.
   * @example Hvis uken starter på onsdag vises de to siste datoene i forrige måned i ruten til mandagen og tirsdagen før.
   * @default false */
  showOutsideMonth?: boolean;
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
  /** Callback-funksjon for når valideringen til datovelgeren endrer seg */
  onValidate?: (isValid?: boolean) => void;
  disabled?: boolean;
  locale?: string;
  calendarRef?: React.MutableRefObject<HTMLDivElement | null>;
  forcedReturnType?: DateFieldProps<DateType>['forcedReturnType'];
  /** Vis flere måneder samtidig i kalenderen.
   * @default {months: 1}
   * @example {months: 2}
   */
  visibleDuration?: Pick<DateDuration, 'months'>;
};

export type CalendarProps<DateType extends DateValue> =
  BaseCalendarProps<DateType> & ExtendedCalendarProps<DateType>;

export const Calendar = <DateType extends DateValue>({
  locale: localOverride,
  ...rest
}: CalendarProps<DateType>) => {
  const props = { isDisabled: rest.disabled, ...rest };
  const { locale } = useLocale();
  return (
    <I18nProvider locale={localOverride ?? locale}>
      <_Calendar {...props} />
    </I18nProvider>
  );
};

const _Calendar = <DateType extends DateValue>({
  selectedDate,
  onChange,
  minDate,
  maxDate,
  showWeekNumbers = false,
  weekNumberHeader = 'uke',
  showOutsideMonth = false,
  visibleDuration,
  forcedReturnType,
  style,
  className,
  navigationDescription,
  onSelectedCellClick = () => {
    return;
  },
  onCellClick = () => {
    return;
  },
  classNameForDate,
  ariaLabelForDate,
  calendarRef,
  ...rest
}: CalendarProps<DateType>) => {
  const { locale } = useLocale();

  const _props: CalendarStateOptions<DateType> = {
    ...rest,
    value: selectedDate,
    onChange: value =>
      handleOnChange<DateType>({
        value,
        selectedDate,
        forcedReturnType,
        onChange,
      }),
    locale,
    createCalendar,
    minValue: minDate,
    maxValue: getAdjustedMaxDate(maxDate),
    visibleDuration,
  };

  const state = useCalendarState(_props);
  const { calendarProps, prevButtonProps, nextButtonProps, title } =
    useCalendar(_props, state);

  useEffect(
    () => rest.onValidate?.(!state.isValueInvalid),
    [state.isValueInvalid],
  );

  return (
    <CalendarBase
      state={state}
      calendarProps={calendarProps}
      prevButtonProps={prevButtonProps}
      nextButtonProps={nextButtonProps}
      title={title}
      calendarRef={calendarRef}
      style={style}
      className={className}
      navigationDescription={navigationDescription}
      showWeekNumbers={showWeekNumbers}
      weekNumberHeader={weekNumberHeader}
      renderCell={(date, currentMonth, weekNumberString, ariaDescribedBy) => (
        <CalendarCell
          key={`${date.month}.${date.day}`}
          state={state}
          date={date}
          currentMonth={currentMonth}
          aria-describedby={ariaDescribedBy}
          weekNumberString={weekNumberString}
          onSelectedCellClick={onSelectedCellClick}
          onCellClick={onCellClick}
          classNameForDate={classNameForDate}
          ariaLabelForDate={ariaLabelForDate}
          showOutsideMonth={showOutsideMonth}
        />
      )}
    />
  );
};
