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
  onSelectedCellClick?: () => void;
};

export const CalendarCell = ({
  state,
  date,
  onSelectedCellClick = () => {
    return;
  },
  ...rest
}: CalendarCellProps) => {
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
        onClick={e => {
          buttonProps.onClick && buttonProps.onClick(e);
          isSelected && onSelectedCellClick();
        }}
        onKeyDown={e => {
          buttonProps.onKeyDown && buttonProps.onKeyDown(e);
          if (e.key === 'Enter' || e.key === ' ')
            isSelected && onSelectedCellClick();
        }}
      >
        {formattedDate}
      </div>
    </td>
  );
};
