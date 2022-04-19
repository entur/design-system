import React, { useRef, useState } from 'react';
import ReactDatePicker, {
  default as ReactDatepicker,
  ReactDatePickerProps,
  registerLocale,
} from 'react-datepicker';
import { parse, isSameDay, Locale } from 'date-fns';
import { nb } from 'date-fns/locale';
import classNames from 'classnames';

import { VariantType } from '@entur/form';
import { useRandomId } from '@entur/utils';

import { DatePickerHeader } from './DatePickerHeader';
import { DatePickerInput } from './DatePickerInput';

import './DatePicker.scss';
import 'react-datepicker/dist/react-datepicker.css';

registerLocale('nb', nb);

export type DatePickerProps = {
  /** Hva som er den valgte datoen */
  selectedDate: Date | null;
  /** Kalles når datoen/tiden endres */
  onChange: (
    date: Date | null,
    event: React.SyntheticEvent<any, Event> | undefined,
  ) => void;
  /**
   * Kalles når en tast trykkes i inputfeltet
   */
  onKeyDown?: (event: KeyboardEvent) => void;
  /**
   * Datoformater som skal støttes. Første i listen er formatet alt input omgjøres til.
   * Format-valg tilgjengelig her: https://date-fns.org/v2.28.0/docs/format
   * OBS: Noen kombinasjoner av datoformater kan gi rar og uønsket oppførsel,
   * test nøye ved endring
   * @default "['dd.MM.yyyy', 'ddMMyyyy', 'dd/MM/yyyy', 'ddMMyy']"
   */
  dateFormats?: string[];
  /**
   * Locale fra date-fns som brukes av Datepicker-en
   * @default nb
   */
  locale?: Locale;
  /** Placeholder om ingen dato er valgt
   * @default "dd.mm.yyyy"
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
  /**
   * Tekst som vises ved hover på «Åpne kalender»-knappen
   */
  calendarButtonTooltip?: string;
  /** Skjuler knapp for åpning av kalender
   * @default false
   */
  hideCalendarButton?: boolean;
  /** Skjuler tilbakemeldingsteksten ved feil dato-input
   * @default false
   */
  hideValidation?: boolean;
  /** Skjuler kalender-GUI-et
   * @default false
   */
  hideCalendar?: boolean;
  /** Viser kun kalender-popover-en
   * @default false
   */
  inline?: boolean;
  // For testing
  'data-cy'?: any;
} & Omit<
  ReactDatePickerProps,
  'selected' | 'customInput' | 'onChangeRaw' | 'dateFormat' | 'locale'
>;

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      style,
      className,
      selectedDate,
      label,
      placeholder = 'dd.mm.yyyy',
      onChange,
      onKeyDown = () => null,
      dateFormats = ['dd.MM.yyyy', 'ddMMyyyy', 'dd/MM/yyyy', 'ddMMyy'],
      minDate,
      maxDate,
      inline = false,
      disabled,
      prepend,
      feedback = '',
      variant,
      validationFeedback = 'Ugyldig dato',
      validationVariant = 'error',
      disableLabelAnimation = false,
      calendarButtonTooltip = 'Åpne\xa0kalender',
      hideCalendarButton = false,
      hideCalendar = false,
      hideValidation = false,
      weekLabel = 'uke',
      locale = nb,
      open,
      ...rest
    },
    ref,
  ) => {
    const datepickerId = useRandomId('eds-datepicker');

    const [showValidation, setShowValidation] = useState(false);

    const datepickerRef = useRef<ReactDatePicker>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => validateInput(), [selectedDate]);

    const handleOnKeyDown = (event: KeyboardEvent) => {
      const calendarIsClosed = !datepickerRef.current?.isCalendarOpen();

      setShowValidation(false);
      if (event.key === 'Enter') {
        validateInput();
        focusAndSelectInputField();
        forceUpdateInputFormat();
      } else if (event.key === 'Tab' && calendarIsClosed) {
        validateInput();
        forceUpdateInputFormat();
      }
      onKeyDown(event);
    };

    const validateInput = () => {
      setShowValidation(false);
      const inputValue = inputRef.current?.value;
      if (!inputValue) return;

      const inputValueParsedWithAllDateFormats = dateFormats.map(format =>
        parse(inputValue, format, new Date(), {
          locale: locale,
        }),
      );

      const parsedDateFromInputIsTheSameAsSelectedDate =
        selectedDate &&
        inputValueParsedWithAllDateFormats.some(dateFormat =>
          isSameDay(dateFormat, selectedDate),
        );

      if (parsedDateFromInputIsTheSameAsSelectedDate) {
        // valid date inputted
        setShowValidation(false);
      } else {
        // invalid date inputted
        setShowValidation(true);
      }
    };

    const getFeedbackAndVariant = (): {
      feedback: string;
      variant: VariantType | undefined;
    } => {
      if (feedback) return { feedback, variant };
      if (!hideValidation && showValidation)
        return { feedback: validationFeedback, variant: validationVariant };
      return { feedback: '', variant: undefined };
    };

    const focusAndSelectInputField = () =>
      setTimeout(() => {
        inputRef.current?.select();
      }, 5);

    const forceUpdateInputFormat = () =>
      datepickerRef.current?.setState({ inputValue: null });

    const toggleCalendarGUI = () =>
      datepickerRef.current?.setOpen(!datepickerRef.current?.isCalendarOpen());

    return (
      <>
        <ReactDatepicker
          selected={selectedDate}
          minDate={minDate}
          maxDate={maxDate}
          dateFormat={dateFormats}
          showWeekNumbers
          weekLabel={weekLabel}
          onChange={onChange}
          onClickOutside={validateInput}
          id={datepickerId}
          ariaLabelledBy={datepickerId}
          showPopperArrow={false}
          locale={locale}
          inline={inline}
          disabled={disabled}
          preventOpenOnFocus={true}
          open={hideCalendar ? false : open}
          ref={datepickerRef}
          calendarClassName="eds-datepicker__calender"
          dayClassName={() => 'eds-datepicker__calender__day'}
          weekDayClassName={() => 'eds-datepicker__calender__day-name'}
          className={classNames(className, 'eds-datepicker__input')}
          highlightDates={[
            { 'eds-datepicker__calender__day--today': [new Date()] },
            {
              'eds-datepicker__calender__day--selected': selectedDate
                ? [selectedDate]
                : [],
            },
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
          customInput={
            <DatePickerInput
              style={style}
              label={label}
              inputPlaceholder={placeholder}
              calendarButtonTooltip={calendarButtonTooltip}
              prepend={prepend}
              feedback={getFeedbackAndVariant().feedback}
              variant={getFeedbackAndVariant().variant}
              inputRef={inputRef}
              forwardRef={ref}
              onKeyDownInput={handleOnKeyDown}
              onBlurInput={() =>
                !datepickerRef.current?.isCalendarOpen() && validateInput()
              }
              onFocus={undefined}
              toggleCalendarGUI={toggleCalendarGUI}
              disableLabelAnimation={disableLabelAnimation}
              hideCalendarButton={hideCalendarButton}
              selectedDate={selectedDate}
            />
          }
          {...rest}
        />
      </>
    );
  },
);
