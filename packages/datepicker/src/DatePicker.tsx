import React, { useRef, useState } from 'react';
import ReactDatePicker, {
  default as ReactDatepicker,
  ReactDatePickerCustomHeaderProps,
  ReactDatePickerProps,
  registerLocale,
} from 'react-datepicker';
import { nb } from 'date-fns/locale';

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
  /** Viser kun kalender-popover-en
   * @default false
   */
  inline?: boolean;
  // For testing
  'data-cy'?: any;
} & Omit<ReactDatePickerProps, 'selected' | 'customInput' | 'onChangeRaw'>;

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({
    label,
    onChange,
    style,
    minDate,
    maxDate,
    inline = false,
    disabled,
    prepend,
    disableLabelAnimation = false,
    hideCalendarButton = false,
    hideCalendar = false,
    open,
  }) => {
    const datepickerId = useRandomId('eds-datepicker');

    const [chosenDate, setChosenDate] = useState<Date | null>(new Date());

    const datepickerRef = useRef<ReactDatePicker>(null);

    const handleOnChange = (
      date: Date | null,
      event: React.SyntheticEvent<any, Event> | undefined,
    ) => {
      setChosenDate(date);
      onChange(date, event);
    };

    const handleOnKeyDown = (
      event: React.KeyboardEventHandler<HTMLInputElement> | undefined,
    ) => {
      console.log('keydown', event);
    };

    return (
      <ReactDatepicker
        selected={chosenDate}
        calendarClassName="eds-datepicker__calender"
        dayClassName={() => 'eds-datepicker__calender__day'}
        weekDayClassName={() => 'eds-datepicker__calender__day-name'}
        className="eds-datepicker__input"
        dateFormat={['dd.MM.yyyy', 'ddMMyyyy', 'dd/MM/yyyy']}
        onChange={handleOnChange}
        // onChangeRaw={event => console.log(event.currentTarget.value)}
        onBlur={() => {
          datepickerRef.current?.setState({ inputValue: null });
          console.log('blur');
        }}
        id={datepickerId}
        showWeekNumbers
        showPopperArrow={false}
        locale={nb}
        minDate={minDate}
        maxDate={maxDate}
        inline={inline}
        disabled={disabled}
        preventOpenOnFocus={true}
        open={hideCalendar ? false : open}
        ref={datepickerRef}
        highlightDates={[
          { 'eds-datepicker__calender__day--today': [new Date()] },
          {
            'eds-datepicker__calender__day--selected': chosenDate
              ? [chosenDate]
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
            label={label}
            style={style}
            onFocus={undefined}
            prepend={prepend}
            onKeyDown={() => console.log('test')}
            disableLabelAnimation={disableLabelAnimation}
            hideCalendarButton={hideCalendarButton}
          />
        }
      />
    );
  },
);

type DatePickerInputProps = {
  label: string;
  style?: React.CSSProperties;
  prepend?: React.ReactNode;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const DatePickerInput = React.forwardRef<HTMLInputElement>(
  ({ children, ...props }, ref) => {
    // test om du kan finne ut når enter trykkes gjennom ref
    const inputRef = React.useRef<HTMLInputElement>(null);

    // React.useEffect(() => {
    //   inputRef.current.onB
    // }, []);

    return (
      <TextField
        label={props.label}
        style={props.style}
        prepend={props.prepend}
        ref={mergeRefs(ref, inputRef)}
        {...props}
        append={
          !props.hideCalendarButton && (
            <Tooltip
              placement="top"
              content="Åpne&nbsp;kalender"
              disableHoverListener={props.disabled}
              disableFocusListener={props.disabled}
            >
              <IconButton onClick={props.onClick}>
                <CalendarIcon />
              </IconButton>
            </Tooltip>
          )
        }
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
