import React from 'react';
import { ReactDatePickerCustomHeaderProps } from 'react-datepicker';

import { LeftArrowIcon, RightArrowIcon } from '@entur/icons';
import { Heading3 } from '@entur/typography';
import { IconButton } from '@entur/button';

type DatePickerHeaderProps = {
  nextMonthAriaLabel: string;
  previousMonthAriaLabel: string;
  locale: globalThis.Locale;
} & Partial<ReactDatePickerCustomHeaderProps>;

export const DatePickerHeader = ({
  date,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
  nextMonthAriaLabel,
  previousMonthAriaLabel,
  locale,
}: DatePickerHeaderProps) => {
  const currentMonthIndex = date?.getMonth() ?? 0;
  return (
    <div className="eds-datepicker__calender__header">
      <IconButton
        type="button"
        className="eds-datepicker__calender__header__month-button--left"
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        aria-label={`${previousMonthAriaLabel} (${getMonthName(
          currentMonthIndex - 1,
          locale,
        )})`}
      >
        <LeftArrowIcon />
      </IconButton>

      <Heading3 className="eds-datepicker__calender__header__month-text">
        {getMonthName(currentMonthIndex, locale)}
      </Heading3>
      <Heading3 className="eds-datepicker__calender__header__month-text">
        {date?.getFullYear()}
      </Heading3>

      <IconButton
        type="button"
        className="eds-datepicker__calender__header__month-button--right"
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
        aria-label={`${nextMonthAriaLabel} (${getMonthName(
          currentMonthIndex + 1,
          locale,
        )})`}
      >
        <RightArrowIcon />
      </IconButton>
    </div>
  );
};

function getMonthName(monthIndex: number, locale: globalThis.Locale) {
  const year = new Date().getFullYear();
  const formatter = new Intl.DateTimeFormat(locale.code, {
    month: 'long',
  });
  return formatter.format(new Date(year, monthIndex));
}
