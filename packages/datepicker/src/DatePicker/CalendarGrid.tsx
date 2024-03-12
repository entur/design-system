import React from 'react';

import { useLocale } from '@react-aria/i18n';
import { useCalendarGrid } from '@react-aria/calendar';
import { CalendarState } from '@react-stately/calendar';
import { getWeeksInMonth, CalendarDate } from '@internationalized/date';

import { useRandomId } from '@entur/utils';
import { VisuallyHidden } from '@entur/a11y';

import { getWeekNumberForDate } from '../shared/utils';
import { CalendarCell } from './CalendarCell';

type CalendarGridProps = {
  state: CalendarState;
  navigationDescription?: string;
  showWeekNumbers: boolean;
  weekNumberHeader: string;
  onSelectedCellClick?: () => void;
  classNameForDate?: (date: CalendarDate) => string;
  ariaLabelForDate?: (date: CalendarDate) => string;
};

export const CalendarGrid = ({
  state,
  navigationDescription,
  onSelectedCellClick = () => {
    return;
  },
  showWeekNumbers,
  weekNumberHeader,
  classNameForDate,
  ariaLabelForDate,
  ...rest
}: CalendarGridProps) => {
  const calendarGridId = useRandomId('eds-calendar');
  const { locale } = useLocale();

  const { gridProps, headerProps, weekDays } = useCalendarGrid(rest, state);

  const weeksInMonth = getWeeksInMonth(state.visibleRange.start, locale);
  const weeksArray = Array.from(Array(weeksInMonth).keys());

  const weekDaysMapped = () => {
    if (locale.toLowerCase().includes('no'))
      return ['ma', 'ti', 'on', 'to', 'fr', 'lø', 'sø'];
    if (locale.toLowerCase().includes('en')) {
      if (weekDays[0] === 'M')
        return ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
      if (weekDays[0] === 'S')
        return ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    }
    return weekDays.map(day => day.toLowerCase());
  };

  const getNavigationDescription = () => {
    if (navigationDescription) return navigationDescription;
    if (locale.toLowerCase().includes('en'))
      return 'Use the arrow keys to navigate between dates';
    return 'Bruk piltastene til å navigere mellom datoer';
  };

  return (
    <>
      <table
        {...gridProps}
        cellSpacing="0"
        className="eds-datepicker__calendar__grid"
      >
        <thead {...headerProps}>
          <tr>
            {showWeekNumbers && (
              <th className="eds-datepicker__calendar__grid__weeknumber-header">
                {weekNumberHeader}
              </th>
            )}
            {weekDaysMapped().map((day, index) => (
              <th key={index}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeksArray.map(weekIndex => {
            const weekNumber = getWeekNumberForDate(
              state.getDatesInWeek(weekIndex)[0],
            );
            return (
              <tr key={weekIndex}>
                {showWeekNumbers && (
                  <th
                    aria-hidden
                    className="eds-datepicker__calendar__grid__weeknumber"
                  >
                    {weekNumber}
                  </th>
                )}
                {state
                  .getDatesInWeek(weekIndex)
                  .map((date, i) =>
                    date ? (
                      <CalendarCell
                        key={i}
                        state={state}
                        date={date}
                        aria-describedby={calendarGridId + 'description'}
                        weekNumberString={
                          showWeekNumbers
                            ? `, ${weekNumberHeader} ${weekNumber},`
                            : ''
                        }
                        onSelectedCellClick={onSelectedCellClick}
                        classNameForDate={classNameForDate}
                        ariaLabelForDate={ariaLabelForDate}
                      />
                    ) : (
                      <td key={i} />
                    ),
                  )}
              </tr>
            );
          })}
        </tbody>
      </table>
      <VisuallyHidden id={calendarGridId + 'description'}>
        {getNavigationDescription()}
      </VisuallyHidden>
    </>
  );
};
