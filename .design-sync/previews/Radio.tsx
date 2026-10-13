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
  <Group initial="voksen" label="Velg reisende">
    <Radio value="voksen">Voksen</Radio>
    <Radio value="barn">Barn</Radio>
    <Radio value="honnor">Honnør</Radio>
  </Group>
);

export const DisabledOption = () => (
  <Group initial="standard" label="Velg komfort">
    <Radio value="standard">Standard</Radio>
    <Radio value="komfort">Komfort</Radio>
    <Radio value="sove" disabled>
      Sovekupé (utsolgt)
    </Radio>
  </Group>
);

export const ReadOnly = () => (
  <Group initial="enkel" label="Billettype" readOnly>
    <Radio value="enkel">Enkeltbillett</Radio>
    <Radio value="periode">Periodebillett</Radio>
  </Group>
);
