import React, { ReactNode } from 'react';

import { I18nProvider, useLocale } from '@react-aria/i18n';
import { useCalendar } from '@react-aria/calendar';
import { useCalendarState } from '@react-stately/calendar';
import { DateValue } from '@internationalized/date';

import { LeftArrowIcon, RightArrowIcon } from '@entur/icons';
import { ConditionalWrapper } from '@entur/utils';

import { ariaLabelIfNorwegian, createCalendar } from '../shared/utils';
import { CalendarButton } from '../shared/CalendarButton';
import { CalendarGrid } from './CalendarGrid';

import './Calendar.scss';

type CalendarProps = {
  selectedDate: DateValue | null;
  onChange: (SelectedDate: DateValue | null) => void;
  navigationDescription?: string;
  style?: React.CSSProperties;
  onSelectedCellClick?: () => void;
  [key: string]: any;
};

export const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  (
    {
      selectedDate: value,
      onChange,
      locale: customLocale,
      style,
      children: _,
      navigationDescription,
      onSelectedCellClick = () => {
        return;
      },
      ...rest
    },
    ref,
  ) => {
    const { locale } = useLocale();

    const state = useCalendarState({
      ...rest,
      onChange,
      locale: customLocale ?? locale,
      createCalendar,
    });
    const { calendarProps, prevButtonProps, nextButtonProps, title } =
      useCalendar(rest, state);

    return (
      <ConditionalWrapper
        condition={customLocale}
        wrapper={(child: ReactNode) => (
          <I18nProvider locale={customLocale}>{child}</I18nProvider>
        )}
      >
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
            onSelectedCellClick={onSelectedCellClick}
          />
        </div>
      </ConditionalWrapper>
    );
  },
);
