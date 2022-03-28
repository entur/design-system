import React, { useState } from 'react';
import {
  default as ReactDatepicker,
  ReactDatePickerCustomHeaderProps,
  ReactDatePickerProps,
  registerLocale,
} from 'react-datepicker';
import { nb } from 'date-fns/locale';

import { VariantType } from '@entur/form';
import { useRandomId } from '@entur/utils';
import { IconButton } from '@entur/button';
import { LeftArrowIcon, RightArrowIcon } from '@entur/icons';
import { Heading3 } from '@entur/typography';

import './DatePicker.scss';

registerLocale('nb', nb);

export type DatePickerProps = {
  /** Hva som er den valgte datoen */
  selectedDate?: Date;
  /** Kalles når datoen/tiden endres */
  onChange: (
    date: Date | null,
    event: React.SyntheticEvent<any, Event> | undefined,
  ) => void;
  /**
   * Kalles når innholdet i inputfeltet endres
   */
  onChangeInput?: (value: string) => void;
  /** Placeholder om ingen dato er valgt
   * @default "dd/mm/yyyy"
   */
  placeholder?: string;
  /** Ekstra klassenavn */
  className?: string;
  /** Label over DatePicker */
  label: string;
  /**
   * Varselmelding, som vil komme under DatePicker
   */
  feedback?: string;
  /** Valideringsvariant
   */
  variant?: VariantType;
  /** Varselmelding for når datoen er på feil format
   * @default "Ugyldig dato"
   */
  validationFeedback?: string;
  /** Valideringsvariant for melding om feil datoformat
   * @default "error"
   */
  validationVariant?: VariantType;
  style?: React.CSSProperties;
  /** Plasserer labelen statisk på toppen av inputfeltet
   * @default false
   */
  disableLabelAnimation?: boolean;
  /** Tekst eller ikon som kommer før inputfelter
   * @default <DateIcon />
   */
  prepend?: React.ReactNode;
  /** Skjuler knapp for åpning av kalender
   * @default false
   */
  hideCalendarButton?: boolean;
  /** Skjuler tilbakemeldingsteksten ved feil dato-input
   * @default false
   */
  hideValidationFeedback?: boolean;
  /** Skjuler kalender-GUI-et
   * @default false
   */
  hideCalendar?: boolean;
  // For testing
  'data-cy'?: any;
} & Omit<ReactDatePickerProps, 'selected' | 'customInput' | 'onChangeRaw'>;

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  () => {
    const datepickerId = useRandomId('eds-datepicker');

    const [chosenDate, setChosenDate] = useState(new Date());

    return (
      <ReactDatepicker
        selected={chosenDate}
        calendarClassName="eds-datepicker__calender -tost"
        className="only-classname-tost"
        dayClassName={() => 'eds-datepicker__day -tost'}
        weekDayClassName={() => 'eds-datepicker__day-name -tost'}
        timeClassName={() => 'time-classname -tost'}
        popperClassName="popper-classname -tost"
        monthClassName={() => 'month-classname-tost'}
        wrapperClassName="wrapper-classname-tost"
        onChange={date => setChosenDate(date as Date)}
        id={datepickerId}
        showWeekNumbers
        showPopperArrow={false}
        locale={nb}
        highlightDates={[
          { 'eds-datepicker__day--today': [new Date()] },
          { 'eds-datepicker__day--selected': [chosenDate] },
        ]}
        renderCustomHeader={({
          date,
          changeYear,
          changeMonth,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <DatePickerHeader
            date={date}
            changeYear={changeYear}
            changeMonth={changeMonth}
            increaseMonth={increaseMonth}
            decreaseMonth={decreaseMonth}
            prevMonthButtonDisabled={prevMonthButtonDisabled}
            nextMonthButtonDisabled={nextMonthButtonDisabled}
          />
        )}
      />
    );
  },
);

function getMonthList(locale = 'nb') {
  const year = new Date().getFullYear(); // 2020
  const monthList = Array(12).keys(); // an Array Iterator
  const formatter = new Intl.DateTimeFormat(locale, {
    month: 'long',
  });
  const getMonthName = (monthIndex: number) =>
    formatter.format(new Date(year, monthIndex));

  return Array.from(monthList, getMonthName);
}

const DatePickerHeader = ({
  date,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}: Partial<ReactDatePickerCustomHeaderProps>) => {
  const monthNames = getMonthList();
  return (
    <div className="eds-datepicker__header">
      <IconButton
        className="eds-datepicker__header__month-button--left"
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
      >
        <LeftArrowIcon />
      </IconButton>
      <Heading3 className="eds-datepicker__header__month-text">
        {monthNames[date?.getMonth() ?? 0]}
      </Heading3>
      <Heading3 className="eds-datepicker__header__month-text">
        {date?.getFullYear()}
      </Heading3>

      <IconButton
        className="eds-datepicker__header__month-button--right"
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
      >
        <RightArrowIcon />
      </IconButton>
    </div>
  );
};
