import React, { useEffect, useRef, useState } from 'react';
import { SearchableDropdown } from '@entur/linje';
import { SearchIcon } from '@entur/icons';

const stops = [
  { value: 'oslo-s', label: 'Oslo S' },
  { value: 'nationaltheatret', label: 'Nationaltheatret' },
  { value: 'jernbanetorget', label: 'Jernbanetorget' },
  { value: 'majorstuen', label: 'Majorstuen' },
  { value: 'lillestrom', label: 'Lillestrøm stasjon' },
  { value: 'bergen', label: 'Bergen stasjon' },
  { value: 'trondheim-s', label: 'Trondheim S' },
];

export const Default = () => {
  const [selected, setSelected] = useState<any>(stops[0]);
  return (
    <div style={{ width: 320 }}>
      <SearchableDropdown
        label="Fra stoppested"
        items={stops}
        selectedItem={selected}
        onChange={setSelected}
        clearable
      />
    </div>
  );
};

export const Empty = () => {
  const [selected, setSelected] = useState<any>(null);
  return (
    <div style={{ width: 320 }}>
      <SearchableDropdown
        label="Til stoppested"
        placeholder="Søk etter stoppested"
        prepend={<SearchIcon inline />}
        items={stops}
        selectedItem={selected}
        onChange={setSelected}
      />
    </div>
  );
};

export const Feedback = () => (
  <div
    style={{ display: 'grid', gap: 'var(--space-large, 1.5rem)', width: 320 }}
  >
    <SearchableDropdown
      label="Til stoppested"
      placeholder="Søk etter stoppested"
      items={stops}
      selectedItem={null as any}
      variant="negative"
      feedback="Velg et stoppested fra listen"
    />
    <SearchableDropdown
      label="Fra stoppested"
      items={stops}
      selectedItem={stops[3]}
      variant="success"
      feedback="Det går avganger herfra hvert 5. minutt"
    />
  </div>
);

export const DisabledAndReadOnly = () => (
  <div
    style={{ display: 'grid', gap: 'var(--space-large, 1.5rem)', width: 320 }}
  >
    <SearchableDropdown
      label="Hjemstoppested"
      items={stops}
      selectedItem={stops[2]}
      readOnly
    />
    <SearchableDropdown
      label="Byttepunkt"
      items={stops}
      selectedItem={stops[4]}
      disabled
    />
  </div>
);

export const Open = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<any>(null);
  useEffect(() => {
    const t = setTimeout(() => {
      (
        ref.current?.querySelector(
          'button[aria-expanded], [aria-haspopup][aria-expanded="false"]',
        ) as HTMLElement | null
      )?.click();
    }, 100);
    return () => clearTimeout(t);
  }, []);
  return (
    <div
      ref={ref}
      style={{ width: 320, minHeight: 340, padding: 'var(--space-default)' }}
    >
      <SearchableDropdown
        label="Til stoppested"
        placeholder="Søk etter stoppested"
        items={stops}
        selectedItem={selected}
        onChange={setSelected}
      />
    </div>
  );
};
