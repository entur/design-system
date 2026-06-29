import React from 'react';

import classNames from 'classnames';
import { useLocale } from '@react-aria/i18n';
import { CalendarState, RangeCalendarState } from '@react-stately/calendar';
import { CalendarDate } from '@internationalized/date';
import { AriaButtonProps } from '@react-types/button';

import { LeftArrowIcon, RightArrowIcon } from '@entur/icons';

import { ariaLabelIfNorwegian } from '../shared/utils';
import { CalendarButton } from '../shared/CalendarButton';
import { CalendarGrid } from './CalendarGrid';

type CalendarBaseProps = {
  state: CalendarState | RangeCalendarState;
  calendarProps: React.HTMLAttributes<HTMLElement>;
  prevButtonProps: AriaButtonProps;
  nextButtonProps: AriaButtonProps;
  title: string;
  calendarRef?: React.Ref<HTMLDivElement>;
  style?: React.CSSProperties;
  className?: string;
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

export const CalendarBase = ({
  state,
  calendarProps,
  prevButtonProps,
  nextButtonProps,
  title,
  calendarRef,
  style,
  className,
  navigationDescription,
  showWeekNumbers,
  weekNumberHeader,
  renderCell,
}: CalendarBaseProps) => {
  const { locale } = useLocale();

  const monthCount =
    state.visibleRange.end.month -
    state.visibleRange.start.month +
    1 +
    (state.visibleRange.end.year - state.visibleRange.start.year) * 12;

  const getMonthTitle = (startDate: CalendarDate) =>
    new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(
      new Date(startDate.year, startDate.month - 1),
    );

  return (
    <div
      {...calendarProps}
      ref={calendarRef}
      className={classNames('eds-datepicker__calendar', className)}
      style={style}
    >
      <div className="eds-datepicker__calendar__grids">
        {Array.from({ length: monthCount }, (_, i) => {
          const startDate = state.visibleRange.start.add({ months: i });
          return (
            <div key={i} className="eds-datepicker__calendar__month">
              <div className="eds-datepicker__calendar__header">
                {i === 0 && (
                  <CalendarButton
                    {...prevButtonProps}
                    aria-label={ariaLabelIfNorwegian(
                      'Forrige måned',
                      locale,
                      prevButtonProps,
                    )}
                  >
                    <LeftArrowIcon size={20} />
                  </CalendarButton>
                )}
                <h2>{monthCount > 1 ? getMonthTitle(startDate) : title}</h2>
                {i === monthCount - 1 && (
                  <CalendarButton
                    {...nextButtonProps}
                    aria-label={ariaLabelIfNorwegian(
                      'Neste måned',
                      locale,
                      nextButtonProps,
                    )}
                  >
                    <RightArrowIcon size={20} />
                  </CalendarButton>
                )}
              </div>
              <CalendarGrid
                state={state}
                startDate={startDate}
                navigationDescription={navigationDescription}
                showWeekNumbers={showWeekNumbers}
                weekNumberHeader={weekNumberHeader}
                renderCell={renderCell}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
