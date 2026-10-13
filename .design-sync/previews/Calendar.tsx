import React, { useState } from 'react';
import { Calendar, CalendarDate } from '@entur/linje';

export const Default = () => {
  const [date, setDate] = useState<any>(new CalendarDate(2026, 10, 14));
  return <Calendar selectedDate={date} onChange={setDate} locale="nb-NO" />;
};

export const WeekNumbersAndOutsideMonth = () => {
  const [date, setDate] = useState<any>(new CalendarDate(2026, 10, 14));
  return (
    <Calendar
      selectedDate={date}
      onChange={setDate}
      locale="nb-NO"
      showWeekNumbers
      weekNumberHeader="Uke"
      showOutsideMonth
    />
  );
};

export const MinMaxDates = () => {
  const [date, setDate] = useState<any>(new CalendarDate(2026, 10, 14));
  return (
    <Calendar
      selectedDate={date}
      onChange={setDate}
      locale="nb-NO"
      minDate={new CalendarDate(2026, 10, 7)}
      maxDate={new CalendarDate(2026, 10, 25)}
    />
  );
};

export const Disabled = () => (
  <Calendar
    selectedDate={new CalendarDate(2026, 10, 14)}
    locale="nb-NO"
    disabled
  />
);
