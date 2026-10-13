import React, { useEffect, useRef, useState } from 'react';
import { Dropdown } from '@entur/linje';
import { BusIcon, TrainIcon, TramIcon, FerryIcon } from '@entur/icons';

const stops = [
  { value: 'oslo-s', label: 'Oslo S' },
  { value: 'nationaltheatret', label: 'Nationaltheatret' },
  { value: 'lillestrom', label: 'Lillestrøm stasjon' },
  { value: 'bergen', label: 'Bergen stasjon' },
  { value: 'trondheim-s', label: 'Trondheim S' },
  { value: 'stavanger', label: 'Stavanger stasjon' },
];

export const Default = () => {
  const [selected, setSelected] = useState<any>(stops[0]);
  return (
    <div style={{ width: 320 }}>
      <Dropdown
        label="Fra stoppested"
        items={stops}
        selectedItem={selected}
        onChange={setSelected}
      />
    </div>
  );
};

export const Empty = () => {
  const [selected, setSelected] = useState<any>(null);
  return (
    <div style={{ width: 320 }}>
      <Dropdown
        label="Til stoppested"
        placeholder="Velg stoppested"
        items={stops}
        selectedItem={selected}
        onChange={setSelected}
        clearable
      />
    </div>
  );
};

export const Feedback = () => (
  <div
    style={{ display: 'grid', gap: 'var(--space-large, 1.5rem)', width: 320 }}
  >
    <Dropdown
      label="Reisetilbyder"
      placeholder="Velg selskap"
      items={['Vy', 'Ruter', 'Skyss', 'AtB', 'Kolumbus']}
      selectedItem={null as any}
      variant="negative"
      feedback="Du må velge en reisetilbyder"
    />
    <Dropdown
      label="Billettype"
      items={['Enkeltbillett', 'Periodebillett', '24-timersbillett']}
      selectedItem={{ value: 'Periodebillett', label: 'Periodebillett' }}
      variant="success"
      feedback="Periodebillett gir fri reise i 30 dager"
    />
  </div>
);

export const DisabledAndReadOnly = () => (
  <div
    style={{ display: 'grid', gap: 'var(--space-large, 1.5rem)', width: 320 }}
  >
    <Dropdown
      label="Sone"
      items={['Sone 1', 'Sone 2V', 'Sone 2Ø']}
      selectedItem={{ value: 'Sone 1', label: 'Sone 1' }}
      readOnly
    />
    <Dropdown
      label="Transportmiddel"
      items={['Tog', 'Buss']}
      selectedItem={{ value: 'Tog', label: 'Tog' }}
      disabled
    />
  </div>
);

const modes = [
  { value: 'tog', label: 'Tog', icons: [TrainIcon] },
  { value: 'buss', label: 'Buss', icons: [BusIcon] },
  { value: 'trikk', label: 'Trikk', icons: [TramIcon] },
  { value: 'båt', label: 'Båt', icons: [FerryIcon] },
];

export const Open = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<any>(modes[0]);
  useEffect(() => {
    const t = setTimeout(() => {
      (
        ref.current?.querySelector('[aria-expanded]') as HTMLElement | null
      )?.click();
    }, 100);
    return () => clearTimeout(t);
  }, []);
  return (
    <div
      ref={ref}
      style={{ width: 320, minHeight: 280, padding: 'var(--space-default)' }}
    >
      <Dropdown
        label="Transportmiddel"
        items={modes}
        selectedItem={selected}
        onChange={setSelected}
      />
    </div>
  );
};
