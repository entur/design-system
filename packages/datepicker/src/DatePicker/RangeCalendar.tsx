import React, { useEffect, useRef } from 'react';

import classNames from 'classnames';
import './Calendar.scss';
import { I18nProvider, useLocale } from '@react-aria/i18n';
import { AriaRangeCalendarProps, useRangeCalendar } from '@react-aria/calendar';
import {
  RangeCalendarStateOptions,
  useRangeCalendarState,
} from '@react-stately/calendar';
import { CalendarDate, DateDuration, DateValue } from '@internationalized/date';
import { RangeValue } from '@react-types/shared';
import { MappedDateValue } from '@react-types/datepicker';

import { LeftArrowIcon, RightArrowIcon } from '@entur/icons';

import {
  ariaLabelIfNorwegian,
  createCalendar,
  getAdjustedMaxDate,
} from '../shared/utils';
import { CalendarButton } from '../shared/CalendarButton';
import { RangeCalendarGrid } from './RangeCalendarGrid';

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
   * Eks: today(getLocalTimeZone()) == i dag i lokal tidssone. */
  minDate?: DateValue;
  /** Seneste gyldige datovalg.
   * Eks: today(getLocalTimeZone()).add({days: 1}) == i morgen i lokal tidssone */
  maxDate?: DateValue;
  /** Slå på visning av ukenummere i kalenderen. Overskriften for ukenummer-kolonnen
   * kan endres med prop-en 'weekNumberHeader'
   * @default false */
  showWeekNumbers?: boolean;
  /** Overskrift som vises for ukenummer-kolonnen. Vises kun hvis 'showWeekNumbers' er true.
   * @default 'uke' */
  weekNumberHeader?: string;
  /** Vis datoer som ligger utenfor den viste måneden.
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
  locale: localeOverride,
  ...rest
}: RangeCalendarProps<DateType>) => {
  const props = { isDisabled: rest.disabled, ...rest };
  const { locale } = useLocale();
  return (
    <I18nProvider locale={localeOverride ?? locale}>
      <RangeCalendarBase {...props} />
    </I18nProvider>
  );
};

const RangeCalendarBase = <DateType extends DateValue>({
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

  const monthCount =
    state.visibleRange.end.month -
    state.visibleRange.start.month +
    1 +
    (state.visibleRange.end.year - state.visibleRange.start.year) * 12;

  const getMonthTitle = (startDate: CalendarDate) =>
    new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(
      new Date(startDate.year, startDate.month - 1),
    );

  return (
    <div
      {...calendarProps}
      ref={ref}
      className={classNames('eds-datepicker__calendar', className)}
      style={style}
    >
      <div className="eds-datepicker__calendar__grids">
        {Array.from({ length: monthCount }, (_, i) => {
          const startDate = state.visibleRange.start.add({ months: i });
          return (
            <div key={i} className="eds-datepicker__calendar__month">
              <div className="eds-datepicker__calendar__header">
                {i === 0 && (
                  <CalendarButton
                    {...prevButtonProps}
                    aria-label={ariaLabelIfNorwegian(
                      'Forrige måned',
                      locale,
                      prevButtonProps,
                    )}
                  >
                    <LeftArrowIcon size={20} />
                  </CalendarButton>
                )}
                <h2>{monthCount > 1 ? getMonthTitle(startDate) : title}</h2>
                {i === monthCount - 1 && (
                  <CalendarButton
                    {...nextButtonProps}
                    aria-label={ariaLabelIfNorwegian(
                      'Neste måned',
                      locale,
                      nextButtonProps,
                    )}
                  >
                    <RightArrowIcon size={20} />
                  </CalendarButton>
                )}
              </div>
              <RangeCalendarGrid
                {...rest}
                state={state}
                startDate={startDate}
                navigationDescription={navigationDescription}
                classNameForDate={classNameForDate}
                ariaLabelForDate={ariaLabelForDate}
                showWeekNumbers={showWeekNumbers}
                weekNumberHeader={weekNumberHeader}
                showOutsideMonth={showOutsideMonth}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
