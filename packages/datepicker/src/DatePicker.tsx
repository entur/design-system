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
import { parse, isValid } from 'date-fns';
import { nb } from 'date-fns/locale';
import './DatePicker.scss';
import { Tooltip } from '@entur/tooltip';
import { useOnMount, useRandomId } from '@entur/utils';
import * as Popper from '@popperjs/core';

registerLocale('nb', nb);

export type DatePickerProps = {
  /** Hva som er den valgte datoen */
  selectedDate?: Date;
  /** Kalles når datoen/tiden endres */
  onChange: (
    date: Date | null,
    event: React.SyntheticEvent<any, Event>,
  ) => void;
  /** Placeholder om ingen dato er valgt
   * @default "dd.mm.yyyy"
   */
  placeholder?: string;
  /** Ekstra klassenavn */
  className?: string;
  /** Label over DatePicker */
  label: string;
  /** Varselmelding, som vil komme under DatePicker
   * @default "Ugyldig dato"
   */
  feedback?: string;
  /** Valideringsvariant
   * @default "error"
   */
  variant?: VariantType;
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
  hideFeedback?: boolean;
  /** Skjuler kalender-GUI-et
   * @default false
   */
  hideCalendar?: boolean;
  // For testing
  'data-cy'?: any;
} & Omit<ReactDatePickerProps, 'selected' | 'customInput'>;
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
      placeholder = 'dd.mm.yyyy',
      className,
      style,
      readOnly,
      disableLabelAnimation = false,
      locale = 'nb',
      prepend,
      disabled,
      variant = 'error',
      feedback = 'Ugyldig dato',
      label,
      hideCalendarButton = false,
      hideCalendar = false,
      hideFeedback = false,
      id,
      ...rest
    },
    ref,
  ) => {
    const [showFeedback, setShowFeedback] = useState(false);
    const [currentValue, setCurrentValue] = useState('');
    const [lastValidValue, setLastValidValue] = useState('');

    const datepickerId = useRandomId('eds-datepicker');
    const { isFilled: isDatepickerFilled, setFilled: setFiller } =
      useInputGroupContext();

    useOnMount(() => {
      if (selectedDate) {
        setFiller && !isDatepickerFilled && setFiller(true);
        handleChange(selectedDate, undefined);
      }
    });

    React.useEffect(() => {
      if (selectedDate) {
        setFiller && !isDatepickerFilled && setFiller(true);
      } else {
        setFiller && isDatepickerFilled && setFiller(false);
      }
    }, [selectedDate, setFiller, isDatepickerFilled]);

    const handleChange = (
      date: any,
      event: React.SyntheticEvent<any> | undefined,
    ) => {
      if (date) {
        setFiller && !isDatepickerFilled && setFiller(true);
      } else {
        setFiller && isDatepickerFilled && setFiller(false);
      }
      if (onChange) {
        onChange(date, event);
        const dateString = date?.toLocaleDateString('no-NO', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
        setCurrentValue(dateString ?? '');
        setLastValidValue(dateString ?? '');
      }
    };

    const handleChangeRaw = (event: React.FocusEvent<HTMLInputElement>) => {
      setShowFeedback(false);
      setCurrentValue(event.target.value);
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      if (showFeedback) {
        setShowFeedback(false);
      } else {
        const inputValue = event.target.value;
        if (inputValue) validateInput(inputValue);
      }
    };

    const handleKeyDownInput = (
      event: React.KeyboardEvent<HTMLInputElement>,
    ) => {
      if (event.key === 'Enter') validateInput(currentValue);
    };

    const validateInput = (inputValue: string) => {
      const parsedDate = parse(inputValue, 'dd.MM.yyyy', new Date(), {
        locale: nb,
      });

      const yearIsFourCharacters =
        currentValue.slice(currentValue.lastIndexOf('.') + 1).length === 4;
      const isValidDate = isValid(parsedDate) && yearIsFourCharacters;

      if (!isValidDate) {
        setShowFeedback(true);
        setCurrentValue(lastValidValue);
      } else {
        setShowFeedback(false);
        setLastValidValue(currentValue);
      }
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
        onCalendarOpen={() => setShowFeedback(false)}
        value={currentValue}
        open={hideCalendar === true ? false : rest.open}
        {...rest}
        customInput={
          <DatePickerInput
            style={style}
            readOnly={readOnly}
            variant={!hideFeedback && showFeedback ? variant : ''}
            feedback={!hideFeedback && showFeedback ? feedback : ''}
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
          isFilled={value ? true : false}
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
