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
import { ClockIcon, LeftArrowIcon, RightArrowIcon } from '@entur/icons';
import { nb } from 'date-fns/locale';
import { add, sub } from 'date-fns';
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
  /** Tekst eller ikon som kommer før inputfelter
   * @default <ClockIcon />
   */
  prepend?: React.ReactNode;
  /** Kalles ved klikk på pil venstre i TimePicker
   * @default Trekker fra 30 minutter av den valgte tiden
   */
  onLeftArrowClick?: (selectedTime?: Date | null, e?: React.MouseEvent) => void;
  /** Kalles ved klikk på pil høyre i TimePicker
   * @default Legger til 30 minutter av den valgte tiden
   */
  onRightArrowClick?: (
    selectedTime?: Date | null,
    e?: React.MouseEvent,
  ) => void;
} & ReactDatePickerProps;

export const TimePicker = React.forwardRef<HTMLDivElement, TimePickerProps>(
  (
    {
      selectedTime = null,
      onChange,
      placeholder = 'Velg tid',
      disabled,
      className,
      style,
      label,
      labelTooltip,
      feedback,
      variant,
      disableLabelAnimation,
      locale = 'nb',
      prepend = <ClockIcon />,
      onLeftArrowClick = (selectedTime, event) =>
        selectedTime && onChange(sub(selectedTime, { minutes: 30 }), event),
      onRightArrowClick = (selectedTime, event) =>
        selectedTime && onChange(add(selectedTime, { minutes: 30 }), event),
      ...rest
    },
    ref,
  ) => {
    const timepickerId = useRandomId('eds-timepicker');
    return (
      <BaseFormControl
        style={style}
        ref={ref}
        label={label}
        labelId={timepickerId}
        labelTooltip={labelTooltip}
        variant={variant}
        feedback={feedback}
        disableLabelAnimation={disableLabelAnimation}
        className="eds-timepicker-form-control"
        disabled={disabled}
        prepend={
          <TimePickerArrowButton
            direction="left"
            tabIndex={-1}
            onClick={(e: React.MouseEvent) => onLeftArrowClick(selectedTime, e)}
            disabled={disabled}
          />
        }
      >
        <TimePickerBase
          selectedTime={selectedTime}
          onChange={onChange}
          placeholder={placeholder}
          className={className}
          locale={locale}
          ariaLabelledBy={timepickerId}
          disabled={disabled}
          {...rest}
        />
        <TimePickerArrowButton
          direction="right"
          tabIndex={-1}
          onClick={(e: React.MouseEvent) => onRightArrowClick(selectedTime, e)}
          disabled={disabled}
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
  timeFormat = 'HH:mm',
  dateFormat = ['HH:mm', 'HHmm'],
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
      className={classNames(
        'eds-form-control',
        'eds-timepicker__input',
        className,
      )}
      calendarClassName="eds-timepicker"
      selected={selectedTime}
      onChange={handleChange}
      dateFormat={dateFormat}
      timeFormat={timeFormat}
      showTimeSelect
      showTimeInput={true}
      showTimeSelectOnly
      showPopperArrow={false}
      placeholderText={placeholder}
      popperClassName="eds-datepicker__popper"
      popperModifiers={POPPEER_MODIFIERS}
      open={false}
      {...rest}
    />
  );
};

type TimePickerArrowButtonProps = {
  direction: 'left' | 'right';
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const TimePickerArrowButton: React.FC<TimePickerArrowButtonProps> = ({
  direction,
  ...rest
}) => {
  return (
    <button className="eds-timepicker__arrowbutton" type="button" {...rest}>
      {direction === 'left' ? <LeftArrowIcon /> : <RightArrowIcon />}
    </button>
  );
};
