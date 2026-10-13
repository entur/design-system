import React, { useState } from 'react';
import { NativeDropdown } from '@entur/linje';

const stops = [
  { value: 'oslo-s', label: 'Oslo S' },
  { value: 'nationaltheatret', label: 'Nationaltheatret' },
  { value: 'lillestrom', label: 'Lillestrøm stasjon' },
  { value: 'bergen', label: 'Bergen stasjon' },
  { value: 'trondheim-s', label: 'Trondheim S' },
];

export const Default = () => {
  const [value, setValue] = useState('oslo-s');
  return (
    <div style={{ width: 320 }}>
      <NativeDropdown
        label="Fra stoppested"
        items={stops}
        value={value}
        onChange={({ value }) => setValue(value)}
      />
    </div>
  );
};

export const Feedback = () => (
  <div
    style={{ display: 'grid', gap: 'var(--space-large, 1.5rem)', width: 320 }}
  >
    <NativeDropdown
      label="Reisetilbyder"
      items={['Vy', 'Ruter', 'Skyss', 'AtB']}
      value="Skyss"
      variant="negative"
      feedback="Skyss har ingen avganger på denne strekningen"
    />
    <NativeDropdown
      label="Billettype"
      items={['Enkeltbillett', 'Periodebillett', '24-timersbillett']}
      value="Periodebillett"
      variant="success"
      feedback="Periodebillett gir fri reise i 30 dager"
    />
  </div>
);

export const DisabledAndReadOnly = () => (
  <div
    style={{ display: 'grid', gap: 'var(--space-large, 1.5rem)', width: 320 }}
  >
    <NativeDropdown
      label="Sone"
      items={['Sone 1', 'Sone 2V', 'Sone 2Ø']}
      value="Sone 1"
      readOnly
    />
    <NativeDropdown
      label="Transportmiddel"
      items={['Tog', 'Buss', 'Trikk']}
      value="Tog"
      disabled
    />
  </div>
);
