import React from 'react';
import DatePicker from 'react-datepicker';
import { BaseFormControl } from '@entur/form';
import { DateIcon } from '@entur/icons';
import { nb } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import './styles.scss';

type DatepickerProps = {
  /** Hva som er den valgte datoen
   * @default new Date()
   */
  selected?: Date;
  [key: string]: any;
};

export const Datepicker: React.FC<DatepickerProps> = ({
  selected = new Date(),
  ...rest
}) => {
  const [startDate, setStartDate] = React.useState(selected);

  return (
    <BaseFormControl prepend={<DateIcon inline />} dark>
      <DatePicker
        className="eds-form-control"
        calendarClassName="eds-datepicker__calender"
        selected={startDate}
        onChange={(date: Date) => setStartDate(date)}
        showWeekNumbers={true}
        weekLabel="uke"
        locale={nb}
        // showTimeSelect  Commented for now, until design is done
        timeFormat="HH:mm"
        dateFormat="dd.MM.yyyy"
        timeIntervals={15}
        timeCaption="time"
        popperClassName="eds-datepicker__popper"
        {...rest}
      />
    </BaseFormControl>
  );
};
