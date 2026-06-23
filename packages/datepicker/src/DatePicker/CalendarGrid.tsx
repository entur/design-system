import React from 'react';

import { useLocale } from '@react-aria/i18n';
import { useCalendarGrid } from '@react-aria/calendar';
import { CalendarState } from '@react-stately/calendar';
import { CalendarDate, getWeeksInMonth } from '@internationalized/date';

import { useRandomId } from '@entur/utils';
import { VisuallyHidden } from '@entur/a11y';

import { getWeekNumberForDate } from '../shared/utils';
import { CalendarCell } from './CalendarCell';

type CalendarGridProps = {
  state: CalendarState;
  startDate?: CalendarDate;
  navigationDescription?: string;
  showWeekNumbers: boolean;
  weekNumberHeader: string;
  showOutsideMonth?: boolean;
  onSelectedCellClick?: () => void;
  onCellClick?: () => void;
  classNameForDate?: (date: CalendarDate) => string;
  ariaLabelForDate?: (date: CalendarDate) => string;
};

export const CalendarGrid = ({
  state,
  startDate,
  navigationDescription,
  onSelectedCellClick = () => {
    return;
  },
  onCellClick = () => {
    return;
  },
  showWeekNumbers,
  weekNumberHeader,
  showOutsideMonth = false,
  classNameForDate,
  ariaLabelForDate,
  ...rest
}: CalendarGridProps) => {
  const calendarGridId = useRandomId('eds-calendar');
  const { locale } = useLocale();

  const gridStartDate = startDate ?? state.visibleRange.start;
  const { gridProps, headerProps, weekDays } = useCalendarGrid(
    { ...rest, startDate: gridStartDate },
    state,
  );

  const weeksInMonth = getWeeksInMonth(gridStartDate, locale);
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
            {weekDaysMapped().map(day => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeksArray.map(weekIndex => {
            const weekNumber = getWeekNumberForDate(
              state.getDatesInWeek(weekIndex, gridStartDate)[0],
            );
            return (
              <tr key={weekIndex}>
                {showWeekNumbers && (
                  <th
                    aria-label={`${weekNumberHeader} ${weekNumber}`}
                    className="eds-datepicker__calendar__grid__weeknumber"
                  >
                    {weekNumber}
                  </th>
                )}
                {state
                  .getDatesInWeek(weekIndex, gridStartDate)
                  .map((date, i) =>
                    date ? (
                      <CalendarCell
                        key={`${date.month}.${date.day}`}
                        state={state}
                        date={date}
                        currentMonth={gridStartDate}
                        aria-describedby={calendarGridId + 'description'}
                        weekNumberString={
                          showWeekNumbers
                            ? `, ${weekNumberHeader} ${weekNumber},`
                            : ''
                        }
                        onSelectedCellClick={onSelectedCellClick}
                        onCellClick={onCellClick}
                        classNameForDate={classNameForDate}
                        ariaLabelForDate={ariaLabelForDate}
                        showOutsideMonth={showOutsideMonth}
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
