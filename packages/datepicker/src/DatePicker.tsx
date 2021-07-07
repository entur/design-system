import React from 'react';
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
import { CalenderIcon, DateIcon } from '@entur/icons';
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
   * @default "Velg dato"
   */
  placeholder?: string;
  /** Ekstra klassenavn */
  className?: string;
  /** Label over DatePicker */
  label: string;
  /** Varselmelding, som vil komme under TextArea */
  feedback?: string;
  /** Valideringsvariant */
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
  // For testing
  'data-cy'?: any;
} & Omit<ReactDatePickerProps, 'selected'>;
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
      placeholder = 'Velg dato',
      className,
      style,
      readOnly,
      disableLabelAnimation = false,
      locale = 'nb',
      weekLabel = 'uke',
      prepend = <DateIcon />,
      disabled,
      dateFormat = ['dd.MM.yyyy', 'ddMMyyyy'],
      variant,
      label,
      ...rest
    },
    ref,
  ) => {
    const id = useRandomId('eds-datepicker');
    const {
      isFilled: isDatepickerFilled,
      setFilled: setFiller,
    } = useInputGroupContext();

    useOnMount(() => {
      if (selectedDate) {
        setFiller && !isDatepickerFilled && setFiller(true);
      }
    });

    React.useEffect(() => {
      if (selectedDate) {
        setFiller && !isDatepickerFilled && setFiller(true);
      } else {
        setFiller && isDatepickerFilled && setFiller(false);
      }
    }, [selectedDate, setFiller, isDatepickerFilled]);

    const handleChange = (date: any, event: any) => {
      if (date) {
        setFiller && !isDatepickerFilled && setFiller(true);
      } else {
        setFiller && isDatepickerFilled && setFiller(false);
      }
      if (onChange) {
        onChange(date, event);
      }
    };
    return (
      <ReactDatepicker
        className={classNames('eds-form-control', className)}
        calendarClassName="eds-datepicker__calender"
        selected={selectedDate}
        onChange={handleChange}
        showWeekNumbers={true}
        dateFormat={dateFormat}
        showPopperArrow={false}
        placeholderText={placeholder}
        readOnly={readOnly}
        id={id}
        disabled={disabled}
        // @ts-ignore
        popperModifiers={POPPER_MODIFIERS}
        customInput={
          <DatePickerInput
            style={style}
            readOnly={readOnly}
            variant={variant}
            datepickerId={id}
            label={label}
            disabled={disabled}
            ref={ref}
            data-cy={rest['data-cy']}
          />
        }
        {...rest}
      />
    );
  },
);

type DatePickerInputProps = {
  onClick?: any;
  value?: any;
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
      onFocus,
      onKeyDown,
      variant,
      feedback,
      style,
      disableLabelAnimation,
      disabled,
      label,
      readOnly,
      datepickerId,
      ...rest
    },
    ref,
  ) => {
    return (
      <span style={{ display: 'flex' }}>
        <BaseFormControl
          style={style}
          className="eds-datepicker__form-control"
          readOnly={readOnly}
          label={label}
          labelId={datepickerId}
          feedback={feedback}
          variant={variant}
          disabled={disabled}
          disableLabelAnimation={disableLabelAnimation}
          isFilled={value ? true : false}
        >
          <input
            value={value}
            onClick={onClick}
            readOnly={readOnly}
            disabled={disabled}
            ref={ref}
            {...rest}
          />
        </BaseFormControl>
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
          >
            <CalenderIcon />
          </button>
        </Tooltip>
      </span>
    );
  },
);
