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
import { ClockIcon } from '@entur/icons';
import { nb } from 'date-fns/locale';
import './TimePicker.scss';
import { useOnMount, useRandomId } from '@entur/utils';
registerLocale('nb', nb);

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
  style?: React.CSSProperties;
  labelTooltip?: React.ReactNode;
  /** Plasserer labelen statisk på toppen av inputfeltet
   * @default false
   */
  disableLabelAnimation?: boolean;
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
      disableLabelAnimation,
      locale = 'nb',
      ...rest
    },
    ref,
  ) => {
    const timepickerId = useRandomId('eds-timepicker');
    return (
      <BaseFormControl
        style={style}
        prepend={<ClockIcon inline />}
        ref={ref}
        label={label}
        labelId={timepickerId}
        labelTooltip={labelTooltip}
        variant={variant}
        feedback={feedback}
        disableLabelAnimation={disableLabelAnimation}
      >
        <TimePickerBase
          selectedTime={selectedTime}
          onChange={onChange}
          placeholder={placeholder}
          className={className}
          locale={locale}
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

  React.useEffect(() => {
    if (selectedTime) {
      setFiller && !isTimepickerFilled && setFiller(true);
    } else {
      setFiller && isTimepickerFilled && setFiller(false);
    }
  }, [selectedTime, setFiller, isTimepickerFilled]);

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
