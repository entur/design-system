import React, { useRef, useState } from 'react';
import ReactDatePicker, {
  default as ReactDatepicker,
  ReactDatePickerCustomHeaderProps,
  ReactDatePickerProps,
  registerLocale,
} from 'react-datepicker';
import { parse, isSameDay } from 'date-fns';
import { nb } from 'date-fns/locale';
import classNames from 'classnames';

import { TextField, VariantType } from '@entur/form';
import { Tooltip } from '@entur/tooltip';
import { useRandomId } from '@entur/utils';
import { IconButton } from '@entur/button';
import { CalendarIcon, LeftArrowIcon, RightArrowIcon } from '@entur/icons';
import { Heading3 } from '@entur/typography';

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
  'selected' | 'customInput' | 'onChangeRaw' | 'dateFormat'
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
      hideCalendarButton = false,
      hideCalendar = false,
      hideValidation = false,
      weekLabel = 'uke',
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
          locale: nb,
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
          locale={nb}
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

type DatePickerInputProps = {
  style?: React.CSSProperties;
  label: string;
  inputPlaceholder: string;
  prepend?: React.ReactNode;
  feedback?: string;
  variant?: VariantType;
  disabled?: boolean;
  disableLabelAnimation?: boolean;
  hideCalendarButton?: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  forwardRef: React.ForwardedRef<HTMLInputElement>;
  toggleCalendarGUI: () => void;
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLInputElement>;
  onKeyDownInput: (event: KeyboardEvent) => any;
  onBlurInput: (event: FocusEvent) => any;
  onFocus: undefined; // To prevent open on focus
  selectedDate: Date | null; // Necessary to update component on state change
  placeholder?: null; // override react-datepickers placeholder prop
};

const DatePickerInput = React.forwardRef<
  HTMLInputElement,
  DatePickerInputProps
>(
  (
    {
      style,
      label,
      inputPlaceholder,
      prepend,
      feedback,
      variant,
      disabled,
      hideCalendarButton,
      disableLabelAnimation,
      inputRef,
      forwardRef,
      toggleCalendarGUI,
      onKeyDownInput,
      onBlurInput,
      selectedDate,
      placeholder = null, // eslint-disable-line
      ...rest
    },
    ref,
  ) => {
    React.useEffect(() => {
      inputRef.current?.addEventListener('keydown', handleOnKeyDown);
      inputRef.current?.addEventListener('blur', handleOnBlur);
      inputRef.current?.addEventListener('focus', handleOnFocus);
      return () => {
        inputRef.current?.removeEventListener('keydown', handleOnKeyDown);
        inputRef.current?.removeEventListener('blur', handleOnBlur);
        inputRef.current?.removeEventListener('focus', handleOnFocus);
      };
    }, [inputRef, selectedDate]);

    function handleOnKeyDown(this: HTMLElement, event: KeyboardEvent) {
      onKeyDownInput(event);
    }
    function handleOnBlur(this: HTMLElement, event: FocusEvent) {
      onBlurInput(event);
    }
    function handleOnFocus() {
      setTimeout(() => inputRef.current?.select(), 5);
    }

    return (
      <TextField
        style={style}
        label={label}
        placeholder={inputPlaceholder}
        prepend={prepend}
        feedback={feedback}
        variant={variant}
        disableLabelAnimation={disableLabelAnimation}
        ref={mergeRefs(ref, inputRef, forwardRef)}
        append={
          !hideCalendarButton && (
            <Tooltip
              placement="top"
              content="Åpne&nbsp;kalender"
              disableHoverListener={disabled}
              disableFocusListener={disabled}
            >
              <IconButton type="button" onClick={toggleCalendarGUI}>
                <CalendarIcon />
              </IconButton>
            </Tooltip>
          )
        }
        {...rest}
      />
    );
  },
);

const DatePickerHeader = ({
  date,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}: Partial<ReactDatePickerCustomHeaderProps>) => {
  const monthNames = getMonthList();
  return (
    <div className="eds-datepicker__calender__header">
      <IconButton
        className="eds-datepicker__calender__header__month-button--left"
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
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
        className="eds-datepicker__calender__header__month-button--right"
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
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

const mergeRefs = <T extends HTMLElement>(
  ...refs: React.MutableRefObject<T>[] | React.ForwardedRef<T>[]
) => {
  return (node: T) => {
    for (const ref of refs) {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) ref.current = node;
    }
  };
};
