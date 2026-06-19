import React, { useRef } from 'react';

import { useCalendarCell } from '@react-aria/calendar';
import { RangeCalendarState } from '@react-stately/calendar';
import {
  CalendarDate,
  getLocalTimeZone,
  isEqualDay,
  isSameDay,
  now,
} from '@internationalized/date';
import classNames from 'classnames';

type RangeCalendarCellProps = {
  state: RangeCalendarState;
  date: CalendarDate;
  currentMonth: CalendarDate;
  weekNumberString: string;
  showOutsideMonth?: boolean;
  classNameForDate?: (date: CalendarDate) => string;
  ariaLabelForDate?: (date: CalendarDate) => string;
};

export const RangeCalendarCell = ({
  state,
  date,
  currentMonth,
  showOutsideMonth = false,
  weekNumberString,
  classNameForDate,
  ariaLabelForDate,
  ...rest
}: RangeCalendarCellProps) => {
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

  const highlightedRange = state.highlightedRange;
  const isSelectionStart =
    isSelected && highlightedRange
      ? isSameDay(date, highlightedRange.start)
      : isSelected;
  const isSelectionEnd =
    isSelected && highlightedRange
      ? isSameDay(date, highlightedRange.end)
      : isSelected;
  const isInRange = isSelected && !isSelectionStart && !isSelectionEnd;

  const isOverflowDate =
    date.month !== currentMonth.month || date.year !== currentMonth.year;
  const isBetweenVisibleMonths = isOverflowDate && !isOutsideVisibleRange;

  const shouldHideDate = !showOutsideMonth && isOutsideVisibleRange;

  const extendedButtonProps = {
    ...buttonProps,
    ...(showOutsideMonth &&
      isOutsideVisibleRange && {
        onClick: () => state.selectDate(date),
        onKeyUp: (e: React.KeyboardEvent) => {
          if (e.key === 'Enter') state.selectDate(date);
        },
      }),
    ...(isBetweenVisibleMonths && {
      tabIndex: -1,
      role: 'presentation' as const,
      onClick: undefined,
      onKeyDown: undefined,
      onKeyUp: undefined,
      onPointerDown: undefined,
      onFocus: undefined,
    }),
  };

  return (
    <td {...cellProps} className="eds-datepicker__calendar__grid__cell__td">
      <div
        {...extendedButtonProps}
        aria-label={isBetweenVisibleMonths ? undefined : ariaLabel}
        aria-hidden={shouldHideDate || isBetweenVisibleMonths}
        ref={cellRef}
        hidden={shouldHideDate}
        className={classNames('eds-datepicker__calendar__grid__cell', {
          [classNameForDate?.(date) ?? '']: !shouldHideDate,
          'eds-datepicker__calendar__grid__cell--selected':
            isSelected && !isOverflowDate,
          'eds-datepicker__calendar__grid__cell--selection-start':
            isSelectionStart && !isOverflowDate,
          'eds-datepicker__calendar__grid__cell--selection-end':
            isSelectionEnd && !isOverflowDate,
          'eds-datepicker__calendar__grid__cell--in-range':
            isInRange && !isOverflowDate,
          'eds-datepicker__calendar__grid__cell--disabled':
            isDisabled || isUnavailable,
          'eds-datepicker__calendar__grid__cell--outside-month':
            isOutsideVisibleRange && !showOutsideMonth,
          'eds-datepicker__calendar__grid__cell--between-months':
            isBetweenVisibleMonths,
          'eds-datepicker__calendar__grid__cell--outside-month--visible':
            isOutsideVisibleRange && showOutsideMonth,
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
