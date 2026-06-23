import React, { useEffect } from 'react';

import classNames from 'classnames';
import { I18nProvider, useLocale } from '@react-aria/i18n';
import { AriaCalendarProps, useCalendar } from '@react-aria/calendar';
import {
  CalendarStateOptions,
  useCalendarState,
} from '@react-stately/calendar';
import { CalendarDate, DateDuration, DateValue } from '@internationalized/date';
import { MappedDateValue } from '@react-types/datepicker';

import { LeftArrowIcon, RightArrowIcon } from '@entur/icons';

import {
  ariaLabelIfNorwegian,
  createCalendar,
  getAdjustedMaxDate,
  handleOnChange,
} from '../shared/utils';
import { CalendarButton } from '../shared/CalendarButton';
import { CalendarGrid } from './CalendarGrid';
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
      <CalendarBase {...props} />
    </I18nProvider>
  );
};

const CalendarBase = <DateType extends DateValue>({
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
      ref={calendarRef}
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
              <CalendarGrid
                {...rest}
                state={state}
                startDate={startDate}
                navigationDescription={navigationDescription}
                onSelectedCellClick={onSelectedCellClick}
                onCellClick={onCellClick}
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
