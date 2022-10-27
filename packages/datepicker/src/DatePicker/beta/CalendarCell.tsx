import React, { useRef } from 'react';

import { useCalendarCell } from '@react-aria/calendar';
import { CalendarState } from '@react-stately/calendar';
import {
  CalendarDate,
  getLocalTimeZone,
  isEqualDay,
  now,
} from '@internationalized/date';
import classNames from 'classnames';

type CalendarCellProps = {
  state: CalendarState;
  date: CalendarDate;
};

export const CalendarCell = ({ state, date, ...rest }: CalendarCellProps) => {
  const cellRef = useRef(null);

  const {
    cellProps,
    buttonProps,
    isSelected,
    isOutsideVisibleRange,
    isDisabled,
    isUnavailable,
    formattedDate,
  } = useCalendarCell({ date }, state, cellRef);
  return (
    <td {...cellProps} className="eds-datepicker__calendar__grid__cell__td">
      <div
        {...buttonProps}
        ref={cellRef}
        hidden={isOutsideVisibleRange}
        className={classNames('eds-datepicker__calendar__grid__cell', {
          'eds-datepicker__calendar__grid__cell--selected': isSelected,
          'eds-datepicker__calendar__grid__cell--disabled':
            isDisabled || isUnavailable,
          'eds-datepicker__calendar__grid__cell--outside-month':
            isOutsideVisibleRange,
          'eds-datepicker__calendar__grid__cell--today': isEqualDay(
            date,
            now(state.timeZone ?? getLocalTimeZone()),
          ),
        })}
        {...rest}
      >
        {formattedDate}
      </div>
    </td>
  );
};
