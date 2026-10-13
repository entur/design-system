import React from 'react';
import { NativeTimePicker } from '@entur/linje';

export const Default = () => (
  <div style={{ width: 320 }}>
    <NativeTimePicker label="Avreisetid" defaultValue="07:45" />
  </div>
);

export const Empty = () => (
  <div style={{ width: 320 }}>
    <NativeTimePicker label="Ankomsttid" />
  </div>
);

export const Feedback = () => (
  <div
    style={{ display: 'grid', gap: 'var(--space-large, 1.5rem)', width: 320 }}
  >
    <NativeTimePicker
      label="Ankomst"
      defaultValue="03:15"
      variant="negative"
      feedback="Ingen avganger mellom 01:00 og 05:00"
    />
    <NativeTimePicker
      label="Avreise"
      defaultValue="08:30"
      variant="success"
      feedback="Toget går i rute"
    />
  </div>
);
