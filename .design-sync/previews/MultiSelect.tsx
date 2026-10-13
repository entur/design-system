import React, { useEffect, useRef, useState } from 'react';
import { MultiSelect } from '@entur/linje';

const lines = [
  { value: 'L1', label: 'L1 Spikkestad – Lillestrøm' },
  { value: 'L2', label: 'L2 Stabekk – Ski' },
  { value: 'R10', label: 'R10 Drammen – Lillehammer' },
  { value: 'R11', label: 'R11 Skien – Eidsvoll' },
  { value: 'R12', label: 'R12 Kongsberg – Eidsvoll' },
  { value: 'RE20', label: 'RE20 Oslo S – Halden' },
];

const zones = [
  'Sone 1',
  'Sone 2V',
  'Sone 2Ø',
  'Sone 2S',
  'Sone 3V',
  'Sone 3Ø',
].map(z => ({ value: z, label: z }));

export const Default = () => {
  const [selected, setSelected] = useState<any[]>([lines[2], lines[4]]);
  return (
    <div style={{ width: 360 }}>
      <MultiSelect
        label="Linjer"
        items={lines}
        selectedItems={selected}
        onChange={setSelected}
      />
    </div>
  );
};

export const Empty = () => {
  const [selected, setSelected] = useState<any[]>([]);
  return (
    <div style={{ width: 360 }}>
      <MultiSelect
        label="Soner"
        placeholder="Velg én eller flere soner"
        items={zones}
        selectedItems={selected}
        onChange={setSelected}
      />
    </div>
  );
};

export const ManySelected = () => {
  const [selected, setSelected] = useState<any[]>(zones.slice(0, 5));
  return (
    <div style={{ width: 360 }}>
      <MultiSelect
        label="Soner"
        items={zones}
        selectedItems={selected}
        onChange={setSelected}
        maxChips={2}
        clearable
      />
    </div>
  );
};

export const Feedback = () => (
  <div
    style={{ display: 'grid', gap: 'var(--space-large, 1.5rem)', width: 360 }}
  >
    <MultiSelect
      label="Linjer"
      placeholder="Velg linjer"
      items={lines}
      selectedItems={[]}
      variant="negative"
      feedback="Velg minst én linje"
    />
    <MultiSelect
      label="Soner"
      items={zones}
      selectedItems={[zones[0]]}
      variant="success"
      feedback="Sonen dekker hele reisen"
    />
  </div>
);

export const DisabledAndReadOnly = () => (
  <div
    style={{ display: 'grid', gap: 'var(--space-large, 1.5rem)', width: 360 }}
  >
    <MultiSelect
      label="Soner"
      items={zones}
      selectedItems={[zones[0]]}
      disabled
    />
    <MultiSelect
      label="Linjer"
      items={lines}
      selectedItems={[lines[0]]}
      readOnly
    />
  </div>
);

export const Open = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<any[]>([lines[0]]);
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
      style={{ width: 360, minHeight: 380, padding: 'var(--space-default)' }}
    >
      <MultiSelect
        label="Linjer"
        items={lines}
        selectedItems={selected}
        onChange={setSelected}
      />
    </div>
  );
};
