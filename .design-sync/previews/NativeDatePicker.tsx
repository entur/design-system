import React from 'react';
import { NativeDatePicker } from '@entur/linje';

export const Default = () => (
  <div style={{ width: 320 }}>
    <NativeDatePicker label="Reisedato" defaultValue="2026-10-14" />
  </div>
);

export const Empty = () => (
  <div style={{ width: 320 }}>
    <NativeDatePicker label="Fødselsdato" />
  </div>
);

export const Feedback = () => (
  <div
    style={{ display: 'grid', gap: 'var(--space-large, 1.5rem)', width: 320 }}
  >
    <NativeDatePicker
      label="Utreise"
      defaultValue="2026-09-01"
      variant="negative"
      feedback="Utreisedato kan ikke være tilbake i tid"
    />
    <NativeDatePicker
      label="Hjemreise"
      defaultValue="2026-10-18"
      variant="success"
      feedback="Det finnes avganger denne dagen"
    />
  </div>
);
