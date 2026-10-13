import React, { useState } from 'react';
import { DateField, CalendarDate, CalendarDateTime } from '@entur/linje';

export const Default = () => {
  const [date, setDate] = useState<any>(new CalendarDate(2026, 10, 14));
  return (
    <div style={{ width: 320 }}>
      <DateField
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
      <DateField
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
    <DateField
      label="Gyldig fra"
      selectedDate={new CalendarDate(2026, 9, 1)}
      locale="nb-NO"
      variant="negative"
      feedback="Datoen kan ikke være tilbake i tid"
    />
    <DateField
      label="Gyldig til"
      selectedDate={new CalendarDate(2026, 10, 31)}
      locale="nb-NO"
      variant="success"
      feedback="Billetten er gyldig i 30 dager"
    />
  </div>
);

export const DisabledAndReadOnly = () => (
  <div
    style={{ display: 'grid', gap: 'var(--space-large, 1.5rem)', width: 320 }}
  >
    <DateField
      label="Kjøpsdato"
      selectedDate={new CalendarDate(2026, 10, 2)}
      locale="nb-NO"
      readOnly
    />
    <DateField
      label="Utløpsdato"
      selectedDate={new CalendarDate(2026, 11, 2)}
      locale="nb-NO"
      disabled
    />
  </div>
);
