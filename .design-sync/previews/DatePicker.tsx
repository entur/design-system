import React, { useState } from 'react';
import { DatePicker, CalendarDate, CalendarDateTime } from '@entur/linje';

export const Default = () => {
  const [date, setDate] = useState<any>(new CalendarDate(2026, 10, 14));
  return (
    <div style={{ width: 320 }}>
      <DatePicker
        label="Reisedato"
        selectedDate={date}
        onChange={setDate}
        locale="nb-NO"
      />
    </div>
  );
};

export const WithTime = () => {
  const [date, setDate] = useState<any>(
    new CalendarDateTime(2026, 10, 14, 7, 45),
  );
  return (
    <div style={{ width: 320 }}>
      <DatePicker
        label="Avreise"
        selectedDate={date}
        onChange={setDate}
        locale="nb-NO"
        showTime
      />
    </div>
  );
};

export const Feedback = () => (
  <div
    style={{ display: 'grid', gap: 'var(--space-large, 1.5rem)', width: 320 }}
  >
    <DatePicker
      label="Utreise"
      selectedDate={new CalendarDate(2026, 9, 1)}
      locale="nb-NO"
      variant="negative"
      feedback="Utreisedato kan ikke være tilbake i tid"
    />
    <DatePicker
      label="Hjemreise"
      selectedDate={new CalendarDate(2026, 10, 18)}
      locale="nb-NO"
      variant="success"
      feedback="Det finnes avganger denne dagen"
    />
  </div>
);

export const DisabledAndReadOnly = () => (
  <div
    style={{ display: 'grid', gap: 'var(--space-large, 1.5rem)', width: 320 }}
  >
    <DatePicker
      label="Bestilt dato"
      selectedDate={new CalendarDate(2026, 10, 2)}
      locale="nb-NO"
      readOnly
    />
    <DatePicker
      label="Reisedato"
      selectedDate={new CalendarDate(2026, 10, 14)}
      locale="nb-NO"
      disabled
    />
  </div>
);

export const Open = () => {
  const [date, setDate] = useState<any>(new CalendarDate(2026, 10, 14));
  return (
    <div
      style={{ width: 320, minHeight: 440, padding: 'var(--space-default)' }}
    >
      <DatePicker
        label="Reisedato"
        selectedDate={date}
        onChange={setDate}
        locale="nb-NO"
        defaultOpen
        disableModal
        showWeekNumbers
      />
    </div>
  );
};
