import React, { useState } from 'react';
import { RangeCalendar, CalendarDate } from '@entur/linje';

export const Default = () => {
  const [range, setRange] = useState<any>({
    start: new CalendarDate(2026, 10, 12),
    end: new CalendarDate(2026, 10, 18),
  });
  return <RangeCalendar value={range} onChange={setRange} locale="nb-NO" />;
};

export const WeekNumbersAndOutsideMonth = () => {
  const [range, setRange] = useState<any>({
    start: new CalendarDate(2026, 10, 28),
    end: new CalendarDate(2026, 11, 3),
  });
  return (
    <RangeCalendar
      value={range}
      onChange={setRange}
      locale="nb-NO"
      showWeekNumbers
      weekNumberHeader="Uke"
      showOutsideMonth
    />
  );
};

export const MinMaxDates = () => {
  const [range, setRange] = useState<any>({
    start: new CalendarDate(2026, 10, 9),
    end: new CalendarDate(2026, 10, 11),
  });
  return (
    <RangeCalendar
      value={range}
      onChange={setRange}
      locale="nb-NO"
      minDate={new CalendarDate(2026, 10, 5)}
      maxDate={new CalendarDate(2026, 10, 23)}
    />
  );
};

export const Empty = () => (
  <RangeCalendar
    value={null as any}
    locale="nb-NO"
    defaultFocusedValue={new CalendarDate(2026, 10, 14)}
  />
);
