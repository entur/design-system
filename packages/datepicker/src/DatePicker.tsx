import React from 'react';
import {
  default as ReactDatepicker,
  ReactDatePickerProps,
} from 'react-datepicker';
import classNames from 'classnames';
import {
  BaseFormControl,
  useInputGroupContext,
  VariantType,
} from '@entur/form';
import { DateIcon } from '@entur/icons';
import { nb } from 'date-fns/locale';
import './DatePicker.scss';
import { useOnMount, useRandomId } from '@entur/utils';

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
  [key: string]: any;
} & ReactDatePickerProps;

export const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(
  (
    {
      selectedDate = null,
      onChange,
      placeholder = 'Velg dato',
      className,
      style,
      readOnly,
      label,
      feedback,
      variant,
      ...rest
    },
    ref,
  ) => {
    const datepickerId = useRandomId('eds-datepicker');
    return (
      <BaseFormControl
        style={style}
        prepend={<DateIcon inline />}
        readOnly={readOnly}
        label={label}
        labelId={datepickerId}
        feedback={feedback}
        variant={variant}
        ref={ref}
      >
        <DatePickerBase
          className={className}
          selectedDate={selectedDate}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          id={datepickerId}
          {...rest}
        />
      </BaseFormControl>
    );
  },
);

type DatePickerBaseProps = {
  /** Hva som er den valgte datoen */
  selectedDate: Date | null;
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
  [key: string]: any;
} & ReactDatePickerProps;

const POPPER_MODIFIERS = {
  offset: {
    enabled: true,
    offset: '-32, 0',
  },
};

const DatePickerBase: React.FC<DatePickerBaseProps> = ({
  selectedDate,
  onChange,
  placeholder,
  className,
  readOnly,
  id,
  ...rest
}) => {
  const {
    isFilled: isDatepickerFilled,
    setFilled: setFiller,
  } = useInputGroupContext();

  useOnMount(() => {
    if (selectedDate) {
      setFiller && !isDatepickerFilled && setFiller(true);
    }
  });

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
      weekLabel="uke"
      locale={nb}
      dateFormat="dd.MM.yyyy"
      showPopperArrow={false}
      placeholderText={placeholder}
      popperClassName="eds-datepicker__popper"
      readOnly={readOnly}
      id={id}
      popperModifiers={POPPER_MODIFIERS}
      {...rest}
    />
  );
};
