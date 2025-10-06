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
  showOutsideMonth?: boolean;
  onSelectedCellClick?: () => void;
  onCellClick?: () => void;
  classNameForDate?: (date: CalendarDate) => string;
  ariaLabelForDate?: (date: CalendarDate) => string;
};

export const CalendarCell = ({
  state,
  date,
  showOutsideMonth = false,
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

  const cellCanBeSelected = showOutsideMonth
    ? !(isDisabled || isUnavailable)
    : !(isOutsideVisibleRange || isDisabled || isUnavailable);

  const shouldHideDate = !showOutsideMonth && isOutsideVisibleRange;

  // Override button props when showOutsideMonth is true and date is outside visible range
  const extendedButtonProps = {
    ...buttonProps,
    ...(showOutsideMonth &&
      isOutsideVisibleRange && {
        onClick: () => {
          state.selectDate(date);
          onCellClick();
        },
        onKeyUp: (e: React.KeyboardEvent) => {
          if (e.key === 'Enter') {
            state.selectDate(date);
            onCellClick();
          }
        },
      }),
  };

  return (
    <td {...cellProps} className="eds-datepicker__calendar__grid__cell__td">
      <div
        {...extendedButtonProps}
        aria-label={ariaLabel}
        aria-hidden={shouldHideDate}
        ref={cellRef}
        hidden={shouldHideDate}
        className={classNames('eds-datepicker__calendar__grid__cell', {
          [classNameForDate?.(date) ?? '']: !shouldHideDate,
          'eds-datepicker__calendar__grid__cell--selected': isSelected,
          'eds-datepicker__calendar__grid__cell--disabled':
            isDisabled || isUnavailable,
          'eds-datepicker__calendar__grid__cell--outside-month':
            isOutsideVisibleRange && !showOutsideMonth,
          'eds-datepicker__calendar__grid__cell--outside-month--visible':
            isOutsideVisibleRange && showOutsideMonth,
          'eds-datepicker__calendar__grid__cell--today': isEqualDay(
            date,
            now(state.timeZone ?? getLocalTimeZone()),
          ),
        })}
        {...rest}
        onClick={e => {
          extendedButtonProps?.onClick?.(e);
          // Used to force close calendar on select
          isSelected && onSelectedCellClick();
          cellCanBeSelected && onCellClick();
        }}
        onKeyUp={e => {
          extendedButtonProps?.onKeyUp?.(e);
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
