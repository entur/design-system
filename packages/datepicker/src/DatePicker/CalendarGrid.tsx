import { useId } from 'react';

import { useLocale } from '@react-aria/i18n';
import { useCalendarGrid } from '@react-aria/calendar';
import { CalendarState, RangeCalendarState } from '@react-stately/calendar';
import { CalendarDate, getWeeksInMonth } from '@internationalized/date';

import { VisuallyHidden } from '@entur/a11y';

import { getWeekNumberForDate } from '../shared/utils';

type CalendarGridProps = {
  state: CalendarState | RangeCalendarState;
  startDate?: CalendarDate;
  navigationDescription?: string;
  showWeekNumbers: boolean;
  weekNumberHeader: string;
  renderCell: (
    date: CalendarDate,
    currentMonth: CalendarDate,
    weekNumberString: string,
    ariaDescribedBy: string,
  ) => React.ReactNode;
};

export const CalendarGrid = ({
  state,
  startDate,
  navigationDescription,
  showWeekNumbers,
  weekNumberHeader,
  renderCell,
}: CalendarGridProps) => {
  const calendarGridId = `eds-calendar${useId()}`;
  const { locale } = useLocale();

  const gridStartDate = startDate ?? state.visibleRange.start;
  const { gridProps, headerProps, weekDays } = useCalendarGrid(
    { startDate: gridStartDate },
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
            const weekNumberString = showWeekNumbers
              ? `, ${weekNumberHeader} ${weekNumber},`
              : '';
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
                      renderCell(
                        date,
                        gridStartDate,
                        weekNumberString,
                        calendarGridId + 'description',
                      )
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
