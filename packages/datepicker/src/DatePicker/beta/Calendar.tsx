import React, { useRef } from 'react';

import { I18nProvider, useLocale } from '@react-aria/i18n';
import { useCalendar } from '@react-aria/calendar';
import { useCalendarState } from '@react-stately/calendar';
import { DateValue } from '@internationalized/date';

import { LeftArrowIcon, RightArrowIcon } from '@entur/icons';
import { mergeRefs } from '@entur/utils';

import { ariaLabelIfNorwegian, createCalendar } from '../../shared/utils';
import { CalendarButton } from '../../shared/CalendarButton';
import { CalendarGrid } from './CalendarGrid';

import './Calendar.scss';

type CalendarProps = {
  selectedDate: DateValue;
  style?: React.CSSProperties;
  [key: string]: any;
};

export const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  ({ selectedDate: value, locale: customLocale, style, ...rest }, ref) => {
    let { locale } = useLocale();
    if (customLocale) locale = customLocale;

    const state = useCalendarState({ value, locale, createCalendar, ...rest });
    const calendarRef = useRef(null);
    const { children, ...props } = rest;
    const { calendarProps, prevButtonProps, nextButtonProps, title } =
      useCalendar({ ...props }, state);
    const monthAndYear = title.split(' ');

    return (
      <I18nProvider locale={locale}>
        <div
          {...calendarProps}
          ref={mergeRefs(calendarRef, ref)}
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
            <h2>{getMonthName(monthAndYear, locale)}</h2>
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
          <CalendarGrid state={state} />
        </div>
      </I18nProvider>
    );
  },
);

const getMonthName = (monthYearList: string[], locale: string) => {
  const month = monthYearList[0];
  const year = monthYearList[1];

  if (locale.toLowerCase() !== 'no-no' && locale.toLowerCase() !== 'no')
    return month + ' ' + year;
  switch (month.toLowerCase()) {
    case 'january':
      return 'januar ' + year;
    case 'february':
      return 'februar ' + year;
    case 'march':
      return 'mars ' + year;
    case 'may':
      return 'mai ' + year;
    case 'june':
      return 'juni ' + year;
    case 'july':
      return 'juli ' + year;
    case 'october':
      return 'oktober ' + year;
    case 'december':
      return 'desember ' + year;
    default:
      return month.toLowerCase() + ' ' + year.toLowerCase();
  }
};
