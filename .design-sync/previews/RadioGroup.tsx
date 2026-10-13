import React from 'react';
import { Radio, RadioGroup } from '@entur/linje';

const Group = ({
  initial,
  label,
  children,
  ...props
}: {
  initial: string;
  label: string;
  children: React.ReactNode;
  disabled?: boolean;
  readOnly?: boolean;
}) => {
  const [value, setValue] = React.useState(initial);
  return (
    <RadioGroup
      name={label}
      label={label}
      value={value}
      onChange={e => setValue(e.target.value)}
      {...props}
    >
      {children}
    </RadioGroup>
  );
};

export const Default = () => (
  <Group initial="tog" label="Hvordan vil du reise?">
    <Radio value="buss">Buss</Radio>
    <Radio value="tog">Tog</Radio>
    <Radio value="bat">Båt</Radio>
  </Group>
);

export const Horizontal = () => (
  <Group initial="retur" label="Reisetype">
    <div style={{ display: 'flex', gap: 'var(--space-large, 1.5rem)' }}>
      <Radio value="en-vei">En vei</Radio>
      <Radio value="retur">Tur-retur</Radio>
    </div>
  </Group>
);

export const Disabled = () => (
  <Group initial="standard" label="Velg komfort" disabled>
    <Radio value="standard" disabled>
      Standard
    </Radio>
    <Radio value="komfort" disabled>
      Komfort
    </Radio>
  </Group>
);

export const ReadOnly = () => (
  <Group initial="periode" label="Billettype" readOnly>
    <Radio value="enkel">Enkeltbillett</Radio>
    <Radio value="periode">Periodebillett</Radio>
  </Group>
);
