import React from 'react';
import {
  default as ReactDatepicker,
  ReactDatePickerProps,
} from 'react-datepicker';
import classNames from 'classnames';
import { BaseFormControl } from '@entur/form';
import { DateIcon } from '@entur/icons';
import { nb } from 'date-fns/locale';

import 'react-datepicker/dist/react-datepicker.css';
import './DatePicker.scss';

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
  [key: string]: any;
} & ReactDatePickerProps;

export const DatePicker: React.FC<DatePickerProps> = ({
  selectedDate = null,
  onChange,
  placeholder = 'Velg dato',
  className,
  style,
  ...rest
}) => {
  return (
    <BaseFormControl style={style} dark prepend={<DateIcon inline />}>
      <ReactDatepicker
        className={classNames('eds-form-control', className)}
        calendarClassName="eds-datepicker__calender"
        selected={selectedDate}
        onChange={onChange}
        showWeekNumbers={true}
        weekLabel="uke"
        locale={nb}
        dateFormat="dd.MM.yyyy"
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
