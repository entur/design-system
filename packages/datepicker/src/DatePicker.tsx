import React, { useState } from 'react';
import {
  default as ReactDatepicker,
  ReactDatePickerCustomHeaderProps,
  ReactDatePickerProps,
  registerLocale,
} from 'react-datepicker';
import { VariantType } from '@entur/form';
import { nb } from 'date-fns/locale';
import { useRandomId } from '@entur/utils';
import './DatePicker.scss';
import { IconButton } from '@entur/button';
import { LeftArrowIcon, RightArrowIcon } from '@entur/icons';
import { Heading3 } from '@entur/typography';

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
        onChange={date => setChosenDate(date as Date)}
        id={datepickerId}
        showWeekNumbers
        showPopperArrow={false}
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
    <div
      style={{
        margin: '0 0.4rem',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <IconButton
        style={{ marginRight: 'auto' }}
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
      >
        <LeftArrowIcon />
      </IconButton>
      <Heading3 style={{ margin: '0 0.25rem' }}>
        {monthNames[date?.getMonth() ?? 0]}
      </Heading3>
      <Heading3 style={{ margin: '0 0.25rem' }}>{date?.getFullYear()}</Heading3>

      <IconButton
        style={{ marginLeft: 'auto' }}
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
      >
        <RightArrowIcon />
      </IconButton>
    </div>
  );
};
