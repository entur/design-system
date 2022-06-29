import React from 'react';
import { ReactDatePickerCustomHeaderProps } from 'react-datepicker';

import { LeftArrowIcon, RightArrowIcon } from '@entur/icons';
import { Heading3 } from '@entur/typography';
import { IconButton } from '@entur/button';

type DatePickerHeaderProps = {
  nextMonthAriaLabel: string;
  prevMonthAriaLabel: string;
} & Partial<ReactDatePickerCustomHeaderProps>;

export const DatePickerHeader = ({
  date,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
  nextMonthAriaLabel,
  prevMonthAriaLabel,
}: DatePickerHeaderProps) => {
  const monthNames = getMonthList();
  return (
    <div className="eds-datepicker__calender__header">
      <IconButton
        type="button"
        className="eds-datepicker__calender__header__month-button--left"
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        aria-label={prevMonthAriaLabel}
      >
        <LeftArrowIcon />
      </IconButton>
      <Heading3 className="eds-datepicker__calender__header__month-text">
        {monthNames[date?.getMonth() ?? 0]}
      </Heading3>
      <Heading3 className="eds-datepicker__calender__header__month-text">
        {date?.getFullYear()}
      </Heading3>

      <IconButton
        type="button"
        className="eds-datepicker__calender__header__month-button--right"
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
        aria-label={nextMonthAriaLabel}
      >
        <RightArrowIcon />
      </IconButton>
    </div>
  );
};

function getMonthList(locale = 'nb') {
  const year = new Date().getFullYear();
  const monthList = Array(12).keys();
  const formatter = new Intl.DateTimeFormat(locale, {
    month: 'long',
  });
  const getMonthName = (monthIndex: number) =>
    formatter.format(new Date(year, monthIndex));

  return Array.from(monthList, getMonthName);
}
