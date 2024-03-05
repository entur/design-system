import React, { ReactNode } from 'react';

import { I18nProvider, useLocale } from '@react-aria/i18n';
import { useCalendar } from '@react-aria/calendar';
import { useCalendarState } from '@react-stately/calendar';
import { CalendarDate, DateValue } from '@internationalized/date';

import { LeftArrowIcon, RightArrowIcon } from '@entur/icons';
import { ConditionalWrapper } from '@entur/utils';

import { ariaLabelIfNorwegian, createCalendar } from '../shared/utils';
import { CalendarButton } from '../shared/CalendarButton';
import { CalendarGrid } from './CalendarGrid';

import './Calendar.scss';

export type CalendarProps = {
  selectedDate: DateValue | null;
  onChange: (SelectedDate: DateValue | null) => void;
  navigationDescription?: string;
  style?: React.CSSProperties;
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
  /** Brukes for å legge til klassenavn på spesifikke datoer i kalenderen.
   *  Tar inn en dato og skal returnere klassenavnet som skal legges til den datoen.
   *  @default undefined
   *  @example (date) => isWeekend(date, 'no-NO') ? 'weekend' : ''
   */
  classNameForDate?: (date: CalendarDate) => string;
  [key: string]: any;
};

export const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  (
    {
      selectedDate,
      onChange,
      locale: customLocale,
      minDate,
      maxDate,
      style,
      children: _,
      navigationDescription,
      onSelectedCellClick = () => {
        return;
      },
      classNameForDate,
      ...rest
    },
    ref,
  ) => {
    const { locale } = useLocale();

    const allProps = {
      ...rest,
      value: selectedDate,
      onChange,
      locale: customLocale ?? locale,
      createCalendar,
      minValue: minDate,
      maxValue: maxDate,
    };

    const state = useCalendarState(allProps);
    const { calendarProps, prevButtonProps, nextButtonProps, title } =
      useCalendar(allProps, state);

    return (
      <ConditionalWrapper
        condition={customLocale}
        wrapper={(child: ReactNode) => (
          <I18nProvider locale={customLocale}>{child}</I18nProvider>
        )}
      >
        <div
          {...calendarProps}
          ref={ref}
          className="eds-datepicker__calendar"
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
          />
        </div>
      </ConditionalWrapper>
    );
  },
);
