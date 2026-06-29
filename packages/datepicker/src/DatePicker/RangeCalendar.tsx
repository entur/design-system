import React, { useEffect, useRef } from 'react';

import { I18nProvider, useLocale } from '@react-aria/i18n';
import { AriaRangeCalendarProps, useRangeCalendar } from '@react-aria/calendar';
import {
  RangeCalendarStateOptions,
  useRangeCalendarState,
} from '@react-stately/calendar';
import { CalendarDate, DateDuration, DateValue } from '@internationalized/date';
import { RangeValue } from '@react-types/shared';
import { MappedDateValue } from '@react-types/datepicker';

import { createCalendar, getAdjustedMaxDate } from '../shared/utils';
import { CalendarBase } from './CalendarBase';
import { RangeCalendarCell } from './RangeCalendarCell';

import './Calendar.scss';

type BaseRangeCalendarProps<DateType extends DateValue> = {
  /** Det valgte datoperioden. Null hvis ingen periode er valgt. */
  value: RangeValue<MappedDateValue<DateType>> | null;
  /** Callback som kalles når valgt periode endres. */
  onChange?: (value: RangeValue<MappedDateValue<DateType>> | null) => void;
  navigationDescription?: string;
  style?: React.CSSProperties;
  /** Ekstra klassenavn */
  className?: string;
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
  /** Vis flere måneder samtidig i kalenderen.
   * @default {months: 1}
   * @example {months: 2}
   */
  visibleDuration?: Pick<DateDuration, 'months'>;
};

type ExtendedRangeCalendarProps<DateType extends DateValue> = Omit<
  AriaRangeCalendarProps<DateType>,
  | keyof BaseRangeCalendarProps<DateType>
  | 'value'
  | 'label'
  | 'hideTimeZone'
  | 'placeholder'
  | 'placeholderValue'
  | 'defaultValue'
  | 'minValue'
  | 'maxValue'
>;

export type RangeCalendarProps<DateType extends DateValue> =
  BaseRangeCalendarProps<DateType> & ExtendedRangeCalendarProps<DateType>;

export const RangeCalendar = <DateType extends DateValue>({
  locale: localOverride,
  ...rest
}: RangeCalendarProps<DateType>) => {
  const props = { isDisabled: rest.disabled, ...rest };
  const { locale } = useLocale();
  return (
    <I18nProvider locale={localOverride ?? locale}>
      <_RangeCalendar {...props} />
    </I18nProvider>
  );
};

const _RangeCalendar = <DateType extends DateValue>({
  value,
  onChange,
  minDate,
  maxDate,
  showWeekNumbers = false,
  weekNumberHeader = 'uke',
  showOutsideMonth = false,
  visibleDuration,
  style,
  className,
  navigationDescription,
  classNameForDate,
  ariaLabelForDate,
  calendarRef,
  ...rest
}: RangeCalendarProps<DateType>) => {
  const { locale } = useLocale();
  const internalRef = useRef<HTMLDivElement | null>(null);
  const ref = calendarRef ?? internalRef;

  const _props: RangeCalendarStateOptions<DateType> = {
    ...rest,
    value,
    onChange,
    locale,
    createCalendar,
    minValue: minDate,
    maxValue: getAdjustedMaxDate(maxDate),
    visibleDuration,
  };

  const state = useRangeCalendarState(_props);
  const { calendarProps, prevButtonProps, nextButtonProps, title } =
    useRangeCalendar(_props, state, ref);

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
      calendarRef={ref}
      style={style}
      className={className}
      navigationDescription={navigationDescription}
      showWeekNumbers={showWeekNumbers}
      weekNumberHeader={weekNumberHeader}
      renderCell={(date, currentMonth, weekNumberString, ariaDescribedBy) => (
        <RangeCalendarCell
          key={`${date.month}.${date.day}`}
          state={state}
          date={date}
          currentMonth={currentMonth}
          aria-describedby={ariaDescribedBy}
          weekNumberString={weekNumberString}
          classNameForDate={classNameForDate}
          ariaLabelForDate={ariaLabelForDate}
          showOutsideMonth={showOutsideMonth}
        />
      )}
    />
  );
};
