import React, { useState } from 'react';
import {
  default as ReactDatepicker,
  ReactDatePickerProps,
  registerLocale,
} from 'react-datepicker';
import classNames from 'classnames';
import {
  BaseFormControl,
  useInputGroupContext,
  VariantType,
} from '@entur/form';
import { CalendarIcon } from '@entur/icons';
import { parse, isSameDay } from 'date-fns';
import { nb } from 'date-fns/locale';
import './DatePicker.scss';
import { Tooltip } from '@entur/tooltip';
import { useRandomId } from '@entur/utils';
import * as Popper from '@popperjs/core';

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
  hideValidationFeedback?: boolean;
  /** Skjuler kalender-GUI-et
   * @default false
   */
  hideCalendar?: boolean;
  // For testing
  'data-cy'?: any;
} & Omit<
  ReactDatePickerProps,
  'selected' | 'customInput' | 'onChangeRaw' | 'onChange'
>;
const POPPER_MODIFIERS: Popper.StrictModifiers[] = [
  {
    name: 'offset',
    enabled: true,
    options: {
      offset: [0, 0],
    },
  },
];

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      selectedDate = null,
      onChange,
      onChangeInput,
      placeholder = 'dd.mm.yyyy',
      className,
      style,
      readOnly,
      disableLabelAnimation = false,
      locale = 'nb',
      prepend,
      disabled,
      variant,
      validationVariant = 'error',
      feedback,
      validationFeedback = 'Ugyldig dato',
      label,
      hideCalendarButton = false,
      hideCalendar = false,
      hideValidationFeedback = false,
      id,
      ...rest
    },
    ref,
  ) => {
    const [showValidationFeedback, setShowValidationFeedback] = useState(false);
    const [currentValue, setCurrentValue] = useState('');
    const [lastValidValue, setLastValidValue] = useState('');

    const datepickerId = useRandomId('eds-datepicker');
    const { isFilled, setFilled } = useInputGroupContext();

    React.useEffect(() => {
      setFilled(!!selectedDate);
      handleChange(selectedDate, undefined);
    }, [selectedDate, setFilled, isFilled]);

    const handleChange = (
      date: Date | [Date | null, Date | null] | /* for selectsRange */ null,
      event: React.SyntheticEvent<any> | undefined,
    ) => {
      // The return value from reactDatePicker can potentially be a range of dates, this however is not supported.
      // To circumvent this we create simply pick the first selected value in that case.
      const newDate = [date].flat()[0];
      setFilled(!!newDate);
      const dateString = newDate?.toLocaleDateString('no-NO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      setCurrentValue(dateString ?? '');
      setLastValidValue(dateString ?? '');
      if (onChange) {
        onChange(newDate, event);
      }
    };

    const handleChangeRaw = (event: React.FocusEvent<HTMLInputElement>) => {
      setShowValidationFeedback(false);
      const inputValue = event.target.value;
      setCurrentValue(inputValue);
      if (onChangeInput) onChangeInput(inputValue);
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      validateInput(event.target.value);
    };

    const handleKeyDownInput = (
      event: React.KeyboardEvent<HTMLInputElement>,
    ) => {
      if (event.key === 'Enter') {
        validateInput(event.currentTarget.value);
      }
    };

    const validateInput = (inputValue: string | undefined) => {
      setShowValidationFeedback(false);
      if (!inputValue) {
        return;
      }
      const parsedDate = parse(inputValue, 'dd.MM.yyyy', new Date(), {
        locale: nb,
      });

      const selectedDateIsTheSameAsParsedDateFromInput =
        selectedDate && isSameDay(parsedDate, selectedDate);
      if (selectedDateIsTheSameAsParsedDateFromInput) {
        setLastValidValue(currentValue);
      } else {
        setShowValidationFeedback(true);
        setCurrentValue(lastValidValue);
      }
    };

    const displayedFeedback = (): string => {
      if (feedback) return feedback;
      if (!hideValidationFeedback && showValidationFeedback)
        return validationFeedback;
      return '';
    };

    const displayedVariant = (): string | undefined => {
      if (feedback && variant) return variant;
      if (!hideValidationFeedback && showValidationFeedback)
        return validationVariant;
      return undefined;
    };

    return (
      <ReactDatepicker
        className={classNames(className)}
        calendarClassName="eds-datepicker__calender"
        selected={selectedDate}
        onChange={handleChange}
        showWeekNumbers={true}
        dateFormat={['dd.MM.yyyy', 'ddMMyyyy', 'dd/MM/yyyy']}
        showPopperArrow={false}
        placeholderText={placeholder}
        readOnly={readOnly}
        id={datepickerId}
        ariaLabelledBy={datepickerId}
        disabled={disabled}
        locale={locale}
        popperModifiers={POPPER_MODIFIERS}
        onBlur={handleBlur}
        onChangeRaw={handleChangeRaw}
        onCalendarOpen={() => setShowValidationFeedback(false)}
        value={currentValue}
        open={hideCalendar === true ? false : rest.open}
        {...rest}
        customInput={
          <DatePickerInput
            style={style}
            readOnly={readOnly}
            variant={displayedVariant()}
            feedback={displayedFeedback()}
            label={label}
            disabled={disabled}
            ref={ref}
            data-cy={rest['data-cy']}
            disableLabelAnimation={disableLabelAnimation}
            prepend={prepend}
            hideCalendarButton={hideCalendarButton}
            inputId={id}
            onKeyDownInput={handleKeyDownInput}
            onBlurInput={handleBlur}
            onChangeInput={onChangeInput}
          />
        }
      />
    );
  },
);

type DatePickerInputProps = {
  onClick?: any;
  value?: any;
  disableLabelAnimation?: boolean;
  className?: string;
  hideCalendarButton?: boolean;
  feedback?: string;
  inputId?: string;
  [key: string]: any;
};
// Props fra customInput i react-datepicker
// value: inputValue,
// onBlur: this.handleBlur,
// onChange: this.handleChange,
// onClick: this.onInputClick,
// onFocus: this.handleFocus,
// onKeyDown: this.onInputKeyDown,
// id: this.props.id,
// name: this.props.name,
// autoFocus: this.props.autoFocus,
// placeholder: this.props.placeholderText,
// disabled: this.props.disabled,
// autoComplete: this.props.autoComplete,
// className: classnames(customInput.props.className, className),
// title: this.props.title,
// readOnly: this.props.readOnly,
// required: this.props.required,
// tabIndex: this.props.tabIndex,
// "aria-describedby": this.props.ariaDescribedBy,
// "aria-invalid": this.props.ariaInvalid,
// "aria-labelledby": this.props.ariaLabelledBy,
// "aria-required": this.props.ariaRequired,

const DatePickerInput = React.forwardRef<
  HTMLInputElement,
  DatePickerInputProps
>(
  (
    {
      value,
      onClick,
      // Capture onFocus prop from react-datepicker, but doesn't use it
      // eslint-disable-next-line
      onFocus,
      onKeyDown,
      variant,
      feedback,
      style,
      disableLabelAnimation,
      disabled,
      label,
      readOnly,
      id,
      prepend,
      className,
      hideCalendarButton,
      inputId,
      onChangeInput,
      onKeyDownInput,
      onBlurInput,
      ...rest
    },
    ref,
  ) => {
    return (
      <span className={className} onBlur={onBlurInput}>
        <BaseFormControl
          style={style}
          className="eds-datepicker__form-control"
          readOnly={readOnly}
          label={label}
          labelId={id}
          feedback={feedback}
          variant={variant}
          disabled={disabled}
          disableLabelAnimation={disableLabelAnimation}
          isFilled={!!value}
          prepend={prepend}
        >
          <input
            value={value}
            onClick={onClick}
            readOnly={readOnly}
            disabled={disabled}
            ref={ref}
            // aria-labelledby={id}
            className="eds-form-control"
            id={inputId}
            onKeyDown={onKeyDownInput}
            onChange={onChangeInput}
            {...rest}
          />
          {!hideCalendarButton && (
            <Tooltip
              placement="top"
              content="Åpne kalender"
              disableHoverListener={disabled}
              disableFocusListener={disabled}
            >
              <button
                className={classNames('eds-datepicker__calendar-button', {
                  'eds-datepicker__calendar-button--open': true,
                  'eds-datepicker__calendar-button--disabled': disabled,
                })}
                onKeyDown={onKeyDown}
                onClick={onClick}
                disabled={disabled}
                type="button"
              >
                <CalendarIcon />
              </button>
            </Tooltip>
          )}
        </BaseFormControl>
      </span>
    );
  },
);
