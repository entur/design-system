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
   * Tekst som vises når kalender ikke er åpen på «Åpne/Lukk kalender»-knappen ved hover
   */
  calendarButtonTooltipOpen?: string;
  /**
   * Tekst som vises når kalender er åpen på «Åpne/Lukk kalender»-knappen ved hover
   */
  calendarButtonTooltipClose?: string;
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
  /** Skjermlesertekst for forrige måned-knapen
   * @default "Forrige måned"
   */
  previousMonthAriaLabel?: string;
  /** Skjermlesertekst for neste måned-knapen
   * @default "Neste måned"
   */
  nextMonthAriaLabel?: string;
  /**
   * Skjermlesertekst som leses før dato i kalenderGUI-et
   * @default "Velg"
   */
  chooseDayAriaLabelPrefix?: string;
  // For testing
  'data-cy'?: any;
} & Omit<
  ReactDatePickerProps,
  | 'selected'
  | 'customInput'
  | 'onChangeRaw'
  | 'dateFormat'
  | 'locale'
  | 'previousMonthAriaLabel'
  | 'nextMonthAriaLabel'
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
      calendarButtonTooltipOpen = 'Åpne\xa0kalender',
      calendarButtonTooltipClose = 'Lukk\xa0kalender',
      hideCalendarButton = false,
      hideCalendar = false,
      hideValidation = false,
      weekLabel = 'uke',
      chooseDayAriaLabelPrefix = 'Velg',
      previousMonthAriaLabel = 'Forrige måned',
      nextMonthAriaLabel = 'Neste måned',
      locale = nb,
      open,
      ...rest
    },
    ref,
  ) => {
    const datepickerId = useRandomId('eds-datepicker');

    const datepickerRef = useRef<ReactDatePicker>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const calendarButton = document.getElementById(datepickerId + '-button');

    const [showValidation, setShowValidation] = useState(false);
    const [
      shouldFocusOnCalendarButtonAfterSelect,
      setShouldFocusOnCalendarButtonAfterSelect,
    ] = useState(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useEffect(() => validateInput(), [selectedDate]);

    const handleOnChange = (
      date: Date | null,
      event: React.SyntheticEvent<any, Event> | undefined,
    ): void => {
      if (shouldFocusOnCalendarButtonAfterSelect && !hideCalendarButton) {
        calendarButton?.focus();
        setShouldFocusOnCalendarButtonAfterSelect(false);
      } else inputRef.current?.focus();

      onChange(date, event);
    };

    const handleOnKeyDown = (event: KeyboardEvent) => {
      setShowValidation(false);

      if (event.key === 'Enter') {
        if (!datePickerGUIIsOpen()) {
          // onBlurInput will validate if calendar is open
          validateInput();
          forceUpdateInputFormat();
        }
        focusAndSelectInputField();
      } else if (event.key === 'Tab' && datePickerGUIIsOpen()) {
        forceUpdateInputFormat();
      } else if (event.key === 'Escape') {
        forceUpdateInputFormat();
        focusAndSelectInputField();
        if (datePickerGUIIsOpen()) toggleCalendarGUI();
      }
      onKeyDown(event);
    };

    const handleOnClickOutside = () =>
      setShouldFocusOnCalendarButtonAfterSelect(false);

    const handleOnBlurInput = () => {
      if (datePickerGUIIsOpen()) return;
      validateInput();
      forceUpdateInputFormat();
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
      requestAnimationFrame(() => inputRef.current?.select());

    const forceUpdateInputFormat = () =>
      datepickerRef.current?.setState({ inputValue: null });

    const toggleCalendarGUI = () =>
      datepickerRef.current?.setOpen(!datePickerGUIIsOpen());

    const setFocusToCalendarGUI = () => {
      if (inline || hideCalendar || datePickerGUIIsOpen()) return;
      // 1 frame delay to allow calendar to spawn
      requestAnimationFrame(() => {
        const datepickerGUIWrapper =
          // @ts-expect-error .calendar does actually exist in ReactDatePicker ref
          datepickerRef.current?.calendar.componentNode;

        const dateToSetFocusTo = selectedDate
          ? (datepickerGUIWrapper.querySelector(
              '.eds-datepicker__calender__day[tabindex="0"]',
            ) as HTMLElement | null)
          : (datepickerGUIWrapper.querySelector(
              '.eds-datepicker__calender__day[aria-current="date"]',
            ) as HTMLElement | null);
        if (dateToSetFocusTo !== null) {
          datepickerRef.current?.setBlur();
          dateToSetFocusTo.focus({ preventScroll: true });
        }
      });
      setShouldFocusOnCalendarButtonAfterSelect(true);
      setShowValidation(false);
    };

    const datePickerGUIIsOpen = () => datepickerRef.current?.isCalendarOpen();

    return (
      <>
        <ReactDatepicker
          selected={selectedDate}
          minDate={minDate}
          maxDate={maxDate}
          dateFormat={dateFormats}
          showWeekNumbers
          weekLabel={weekLabel}
          onChange={handleOnChange}
          onClickOutside={handleOnClickOutside}
          id={datepickerId}
          ariaLabelledBy={datepickerId}
          showPopperArrow={false}
          locale={locale}
          inline={inline}
          disabled={disabled}
          preventOpenOnFocus={true}
          chooseDayAriaLabelPrefix={chooseDayAriaLabelPrefix}
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
              previousMonthAriaLabel={previousMonthAriaLabel}
              nextMonthAriaLabel={nextMonthAriaLabel}
              locale={locale}
            />
          )}
          customInput={
            <DatePickerInput
              style={style}
              label={label}
              inputPlaceholder={placeholder}
              calendarButtonTooltipOpen={calendarButtonTooltipOpen}
              calendarButtonTooltipClose={calendarButtonTooltipClose}
              prepend={prepend}
              feedback={getFeedbackAndVariant().feedback}
              variant={getFeedbackAndVariant().variant}
              inputRef={inputRef}
              calendarButtonId={datepickerId + '-button'}
              forwardRef={ref}
              onKeyDownInput={handleOnKeyDown}
              onBlurInput={handleOnBlurInput}
              onFocus={undefined}
              toggleCalendarGUI={toggleCalendarGUI}
              setFocusToCalendarGUI={setFocusToCalendarGUI}
              setShouldFocusOnCalendarButtonAfterSelect={
                setShouldFocusOnCalendarButtonAfterSelect
              }
              calendarGUIIsOpen={datePickerGUIIsOpen}
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
