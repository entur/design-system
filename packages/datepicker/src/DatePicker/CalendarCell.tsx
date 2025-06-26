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
  weekNumberString: string;
  onSelectedCellClick?: () => void;
  onCellClick?: () => void;
  classNameForDate?: (date: CalendarDate) => string;
  ariaLabelForDate?: (date: CalendarDate) => string;
};

export const CalendarCell = ({
  state,
  date,
  onSelectedCellClick = () => {
    return;
  },
  onCellClick = () => {
    return;
  },
  weekNumberString,
  classNameForDate,
  ariaLabelForDate,
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

  const ariaLabel = `${buttonProps['aria-label']}${weekNumberString} ${
    ariaLabelForDate?.(date) ?? ''
  }`;

  const cellCanBeSelected = !(
    isOutsideVisibleRange ||
    isDisabled ||
    isUnavailable
  );

  return (
    <td {...cellProps} className="eds-datepicker__calendar__grid__cell__td">
      <div
        {...buttonProps}
        aria-label={ariaLabel}
        aria-hidden={isOutsideVisibleRange}
        ref={cellRef}
        hidden={isOutsideVisibleRange}
        className={classNames('eds-datepicker__calendar__grid__cell', {
          [classNameForDate?.(date) ?? '']: !isOutsideVisibleRange,
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
          // Used to force close calendar on select
          isSelected && onSelectedCellClick();
          cellCanBeSelected && onCellClick();
        }}
        onKeyUp={e => {
          buttonProps.onKeyUp && buttonProps.onKeyUp(e);
          if (e.key === 'Enter') {
            // Used to force close calendar on select
            isSelected && onSelectedCellClick();
            cellCanBeSelected && onCellClick();
          }
        }}
      >
        {formattedDate}
      </div>
    </td>
  );
};
