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
  currentMonth: CalendarDate;
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
  currentMonth,
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

  const isOverflowDate =
    date.month !== currentMonth.month || date.year !== currentMonth.year;
  const isBetweenVisibleMonths = isOverflowDate && !isOutsideVisibleRange;

  const cellCanBeSelected = showOutsideMonth
    ? !(isDisabled || isUnavailable)
    : !(isOutsideVisibleRange || isDisabled || isUnavailable);

  const shouldHideDate = !showOutsideMonth && isOutsideVisibleRange;

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
        onClick={e => {
          if (isBetweenVisibleMonths) return;
          extendedButtonProps?.onClick?.(e);
          isSelected && onSelectedCellClick();
          cellCanBeSelected && onCellClick();
        }}
        onKeyUp={e => {
          if (isBetweenVisibleMonths) return;
          extendedButtonProps?.onKeyUp?.(e);
          if (e.key === 'Enter') {
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
