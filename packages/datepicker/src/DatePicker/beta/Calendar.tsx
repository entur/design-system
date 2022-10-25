import React from 'react';

import { useLocale } from '@react-aria/i18n';
import { useCalendar } from '@react-aria/calendar';
import { useCalendarState } from '@react-stately/calendar';
import { DateValue } from '@internationalized/date';

import { LeftArrowIcon, RightArrowIcon } from '@entur/icons';

import { ariaLabelIfNorwegian, createCalendar } from '../../shared/utils';
import { CalendarButton } from '../../shared/CalendarButton';
import { CalendarGrid } from './CalendarGrid';

import './Calendar.scss';

type CalendarProps = {
  selectedDate: DateValue;
  onChange: (SelectedDate: DateValue) => void;
  navigationDescription?: string;
  style?: React.CSSProperties;
  [key: string]: any;
};

export const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  (
    {
      selectedDate: value,
      onChange,
      style,
      children: _,
      navigationDescription,
      ...rest
    },
    ref,
  ) => {
    const { locale } = useLocale();

    const state = useCalendarState({
      ...rest,
      onChange,
      locale,
      createCalendar,
    });
    const { calendarProps, prevButtonProps, nextButtonProps, title } =
      useCalendar(rest, state);

    return (
      <div
        {...calendarProps}
        ref={ref}
        className="eds-datepicker__calendar"
        style={style}
      >
        <div className="eds-datepicker__calendar__header">
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
          <h2>{title}</h2>
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
        </div>
        <CalendarGrid
          state={state}
          navigationDescription={navigationDescription}
        />
      </div>
    );
  },
);
