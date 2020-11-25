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
import { ClockIcon } from '@entur/icons';
import { nb } from 'date-fns/locale';
import './TimePicker.scss';
import { useOnMount } from '@entur/utils';

export type TimePickerProps = {
  /** Hva som er den valgte datoen */
  selectedTime?: Date;
  /** Kalles når datoen/tiden endres */
  onChange: (
    date: Date | null,
    event: React.SyntheticEvent<any, Event>,
  ) => void;
  /** Placeholder om ingen dato er valgt
   * @default "Velg tid"
   */
  placeholder?: string;
  /** Ekstra klassenavn */
  className?: string;
  /** Label over TimePicker */
  label: string;
  /** Varselmelding, som vil komme under TimePicker */
  feedback?: string;
  /** Valideringsvariant */
  variant?: VariantType;
  [key: string]: any;
} & ReactDatePickerProps;

export const TimePicker = React.forwardRef<HTMLDivElement, TimePickerProps>(
  (
    {
      selectedTime = null,
      onChange,
      placeholder = 'Velg tid',
      className,
      style,
      label,
      labelTooltip,
      feedback,
      variant,
      ...rest
    },
    ref,
  ) => {
    return (
      <BaseFormControl
        style={style}
        prepend={<ClockIcon inline />}
        ref={ref}
        label={label}
        labelTooltip={labelTooltip}
        variant={variant}
        feedback={feedback}
      >
        <TimePickerBase
          selectedTime={selectedTime}
          onChange={onChange}
          placeholder={placeholder}
          className={className}
          {...rest}
        />
      </BaseFormControl>
    );
  },
);

type TimePickerBaseProps = {
  /** Hva som er den valgte datoen */
  selectedTime?: Date | null;
  /** Kalles når datoen/tiden endres */
  onChange: (
    date: Date | null,
    event: React.SyntheticEvent<any, Event>,
  ) => void;
  /** Placeholder om ingen dato er valgt
   * @default "Velg tid"
   */
  placeholder?: string;
  /** Ekstra klassenavn */
  className?: string;
  [key: string]: any;
} & ReactDatePickerProps;

const POPPEER_MODIFIERS = {
  offset: {
    enabled: true,
    offset: '-32, 0',
  },
};

const TimePickerBase: React.FC<TimePickerBaseProps> = ({
  className,
  onChange,
  selectedTime,
  placeholder,
  ...rest
}) => {
  const {
    isFilled: isTimepickerFilled,
    setFilled: setFiller,
  } = useInputGroupContext();

  useOnMount(() => {
    if (selectedTime) {
      setFiller && !isTimepickerFilled && setFiller(true);
    }
  });

  const handleChange = (date: any, event: any) => {
    if (date) {
      setFiller && !isTimepickerFilled && setFiller(true);
    } else {
      setFiller && isTimepickerFilled && setFiller(false);
    }
    if (onChange) {
      onChange(date, event);
    }
  };
  return (
    <ReactDatepicker
      className={classNames('eds-form-control', className)}
      calendarClassName="eds-timepicker"
      selected={selectedTime}
      onChange={handleChange}
      locale={nb}
      dateFormat="HH:mm"
      timeFormat="HH:mm"
      showTimeSelect
      showTimeSelectOnly
      showPopperArrow={false}
      placeholderText={placeholder}
      popperClassName="eds-datepicker__popper"
      popperModifiers={POPPEER_MODIFIERS}
      {...rest}
    />
  );
};
