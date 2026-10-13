import React, { useState } from 'react';
import { TimePicker, Time } from '@entur/linje';

export const Default = () => {
  const [time, setTime] = useState<any>(new Time(7, 45));
  return (
    <div style={{ width: 320 }}>
      <TimePicker
        label="Avreisetid"
        selectedTime={time}
        onChange={setTime}
        locale="nb-NO"
      />
    </div>
  );
};

export const WithSeconds = () => {
  const [time, setTime] = useState<any>(new Time(14, 32, 10));
  return (
    <div style={{ width: 320 }}>
      <TimePicker
        label="Registrert"
        selectedTime={time}
        onChange={setTime}
        locale="nb-NO"
        showSeconds
      />
    </div>
  );
};

export const Feedback = () => (
  <div
    style={{ display: 'grid', gap: 'var(--space-large, 1.5rem)', width: 320 }}
  >
    <TimePicker
      label="Ankomst"
      selectedTime={new Time(3, 15)}
      onChange={() => {}}
      locale="nb-NO"
      variant="negative"
      feedback="Ingen avganger mellom 01:00 og 05:00"
    />
    <TimePicker
      label="Avreise"
      selectedTime={new Time(8, 30)}
      onChange={() => {}}
      locale="nb-NO"
      variant="success"
      feedback="Toget går i rute"
    />
  </div>
);

export const DisabledAndReadOnly = () => (
  <div
    style={{ display: 'grid', gap: 'var(--space-large, 1.5rem)', width: 320 }}
  >
    <TimePicker
      label="Planlagt"
      selectedTime={new Time(16, 5)}
      onChange={() => {}}
      locale="nb-NO"
      readOnly
    />
    <TimePicker
      label="Faktisk"
      selectedTime={new Time(16, 12)}
      onChange={() => {}}
      locale="nb-NO"
      disabled
    />
  </div>
);
