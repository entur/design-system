import React from 'react';

import { useLocale } from '@react-aria/i18n';
import { useCalendar } from '@react-aria/calendar';
import { useCalendarState } from '@react-stately/calendar';
import { DateValue } from '@internationalized/date';

import { LeftArrowIcon, RightArrowIcon } from '@entur/icons';

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
  ({ selectedDate: value, style, children: _, ...rest }, ref) => {
    const { locale } = useLocale();

    const state = useCalendarState({
      ...rest,
      locale,
      createCalendar,
    });
    const { calendarProps, prevButtonProps, nextButtonProps, title } =
      useCalendar(rest, state);
    // const monthAndYear = title.split(' ');

    return (
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
          {/* <h2>{getTitle(monthAndYear, locale)}</h2> */}
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
        <CalendarGrid state={state} />
      </div>
    );
  },
);

// const getTitle = (monthYearList: string[], locale: string) => {
//   const month = monthYearList[0];
//   const year = monthYearList[1];

//   if (locale.toLowerCase() !== 'no-no' && locale.toLowerCase() !== 'no')
//     return month + ' ' + year;
//   switch (month.toLowerCase()) {
//     case 'january':
//       return 'januar ' + year;
//     case 'february':
//       return 'februar ' + year;
//     case 'march':
//       return 'mars ' + year;
//     case 'may':
//       return 'mai ' + year;
//     case 'june':
//       return 'juni ' + year;
//     case 'july':
//       return 'juli ' + year;
//     case 'october':
//       return 'oktober ' + year;
//     case 'december':
//       return 'desember ' + year;
//     default:
//       return month.toLowerCase() + ' ' + year.toLowerCase();
//   }
// };
