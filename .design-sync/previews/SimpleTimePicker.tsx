import React, { useState } from 'react';
import { SimpleTimePicker, Time } from '@entur/linje';

export const Default = () => {
  const [time, setTime] = useState<any>(new Time(7, 45));
  return (
    <SimpleTimePicker
      label="Avreisetid"
      selectedTime={time}
      onChange={setTime}
    />
  );
};

export const ClockIconPlacement = () => (
  <div
    style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'var(--space-large, 1.5rem)',
    }}
  >
    <SimpleTimePicker
      label="Avreise"
      selectedTime={new Time(7, 45)}
      onChange={() => {}}
      showClockIcon="left"
    />
    <SimpleTimePicker
      label="Ankomst"
      selectedTime={new Time(9, 20)}
      onChange={() => {}}
      showClockIcon="right"
    />
    <SimpleTimePicker
      label="Bytte"
      selectedTime={new Time(8, 5)}
      onChange={() => {}}
      showClockIcon={false}
    />
  </div>
);

export const WithSeconds = () => (
  <SimpleTimePicker
    label="Registrert"
    selectedTime={new Time(14, 32, 10)}
    onChange={() => {}}
    showSeconds
  />
);

export const Feedback = () => (
  <div
    style={{
      display: 'grid',
      gap: 'var(--space-large, 1.5rem)',
      justifyItems: 'start',
    }}
  >
    <SimpleTimePicker
      label="Ankomst"
      selectedTime={new Time(3, 15)}
      onChange={() => {}}
      variant="negative"
      feedback="Utenfor rutetid"
    />
    <SimpleTimePicker
      label="Avgang"
      selectedTime={new Time(16, 5)}
      onChange={() => {}}
      variant="success"
      feedback="Innenfor rutetid"
    />
  </div>
);

export const DisabledAndReadOnly = () => (
  <div
    style={{
      display: 'grid',
      gap: 'var(--space-large, 1.5rem)',
      justifyItems: 'start',
    }}
  >
    <SimpleTimePicker
      label="Avgang"
      selectedTime={new Time(16, 5)}
      onChange={() => {}}
      disabled
    />
    <SimpleTimePicker
      label="Ankomst"
      selectedTime={new Time(18, 40)}
      onChange={() => {}}
      readOnly
    />
  </div>
);
