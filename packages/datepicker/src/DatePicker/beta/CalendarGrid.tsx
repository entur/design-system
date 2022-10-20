import React from 'react';

import { useLocale } from '@react-aria/i18n';
import { useCalendarGrid } from '@react-aria/calendar';
import { CalendarState } from '@react-stately/calendar';
import { getWeeksInMonth } from '@internationalized/date';

import { CalendarCell } from './CalendarCell';

type CalendarGridProps = {
  state: CalendarState;
};

export const CalendarGrid = ({ state, ...rest }: CalendarGridProps) => {
  const { locale } = useLocale();

  const { gridProps, headerProps, weekDays } = useCalendarGrid(rest, state);

  const weeksInMonth = getWeeksInMonth(state.visibleRange.start, locale);
  const weeksArray = Array.from(Array(weeksInMonth).keys());

  const weekDaysMapped = () => {
    if (locale.toLowerCase() === 'no-no' || locale.toLowerCase() === 'no')
      return ['ma', 'ti', 'on', 'to', 'fr', 'lø', 'sø'];
    if (weekDays.toString() === 'M,T,W,T,F,S,S')
      return ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    return weekDays.map(day => day.toLowerCase());
  };

  return (
    <table
      {...gridProps}
      cellSpacing="0"
      className="eds-datepicker__calendar__grid"
    >
      <thead {...headerProps}>
        <tr>
          {weekDaysMapped().map((day, index) => (
            <th key={index}>{day}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {weeksArray.map(weekIndex => (
          <tr key={weekIndex}>
            {state
              .getDatesInWeek(weekIndex)
              .map((date, i) =>
                date ? (
                  <CalendarCell key={i} state={state} date={date} />
                ) : (
                  <td key={i} />
                ),
              )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
