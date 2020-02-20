import React from 'react';
import {
  default as ReactDatepicker,
  ReactDatePickerProps,
} from 'react-datepicker';
import classNames from 'classnames';
import { BaseFormControl } from '@entur/form';
import { ClockIcon } from '@entur/icons';
import { nb } from 'date-fns/locale';
import './TimePicker.scss';

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
  [key: string]: any;
} & ReactDatePickerProps;

export const TimePicker: React.FC<TimePickerProps> = ({
  selectedTime = null,
  onChange,
  placeholder = 'Velg tid',
  className,
  style,
  ...rest
}) => {
  return (
    <BaseFormControl style={style} dark prepend={<ClockIcon inline />}>
      <ReactDatepicker
        className={classNames('eds-form-control', className)}
        calendarClassName="eds-timepicker"
        selected={selectedTime}
        onChange={onChange}
        showWeekNumbers={true}
        locale={nb}
        dateFormat="HH:mm"
        timeFormat="HH:mm"
        showTimeSelect
        showTimeSelectOnly
        showPopperArrow={false}
        placeholderText={placeholder}
        popperClassName="eds-datepicker__popper"
        popperModifiers={{
          offset: {
            enabled: true,
            offset: '-32, 0',
          },
        }}
        {...rest}
      />
    </BaseFormControl>
  );
};
