import React from 'react';

import classNames from 'classnames';
import { I18nProvider, useLocale } from '@react-aria/i18n';
import { useCalendar } from '@react-aria/calendar';
import { useCalendarState } from '@react-stately/calendar';
import { CalendarDate, DateValue } from '@internationalized/date';
import { MappedDateValue } from '@react-types/datepicker';

import { LeftArrowIcon, RightArrowIcon } from '@entur/icons';

import { ariaLabelIfNorwegian, createCalendar } from '../shared/utils';
import { CalendarButton } from '../shared/CalendarButton';
import { CalendarGrid } from './CalendarGrid';

import './Calendar.scss';

export type CalendarProps<DateType extends DateValue> = {
  selectedDate: DateType | null;
  onChange: (
    SelectedDate: MappedDateValue<DateType> | null,
  ) => void | React.Dispatch<React.SetStateAction<DateType | null>>;
  navigationDescription?: string;
  style?: React.CSSProperties;
  /** Ekstra klassenavn */
  className?: string;
  onSelectedCellClick?: () => void;
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
  locale?: string;
  calendarRef?: React.MutableRefObject<HTMLDivElement | null>;
};

export const Calendar = <DateType extends DateValue>({
  locale: localOverride,
  ...rest
}: CalendarProps<DateType>) => {
  const { locale } = useLocale();
  return (
    <I18nProvider locale={localOverride ?? locale}>
      <CalendarBase {...rest} />
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
  style,
  className,
  navigationDescription,
  onSelectedCellClick = () => {
    return;
  },
  classNameForDate,
  ariaLabelForDate,
  calendarRef,
  ...rest
}: CalendarProps<DateType>) => {
  const { locale } = useLocale();

  const allProps = {
    ...rest,
    value: selectedDate,
    onChange,
    locale,
    createCalendar,
    minValue: minDate,
    maxValue: maxDate,
  };

  const state = useCalendarState(allProps);
  const { calendarProps, prevButtonProps, nextButtonProps, title } =
    useCalendar(allProps, state);

  return (
    <div
      {...calendarProps}
      ref={calendarRef}
      className={classNames('eds-datepicker__calendar', className)}
      style={style}
    >
      <div className="eds-datepicker__calendar__header">
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
        <h2>{title}</h2>
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
      </div>
      <CalendarGrid
        state={state}
        navigationDescription={navigationDescription}
        onSelectedCellClick={onSelectedCellClick}
        classNameForDate={classNameForDate}
        ariaLabelForDate={ariaLabelForDate}
        showWeekNumbers={showWeekNumbers}
        weekNumberHeader={weekNumberHeader}
      />
    </div>
  );
};
