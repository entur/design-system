import React from 'react';
import { ChoiceChip, ChoiceChipGroup } from '@entur/linje';

export const Default = () => {
  const [value, setValue] = React.useState('voksen');
  return (
    <ChoiceChipGroup
      name="billettype"
      label="Billettype"
      value={value}
      onChange={e => setValue(e.target.value)}
    >
      <ChoiceChip value="barn">Barn</ChoiceChip>
      <ChoiceChip value="voksen">Voksen</ChoiceChip>
      <ChoiceChip value="honnor">Honnør</ChoiceChip>
      <ChoiceChip value="student">Student</ChoiceChip>
    </ChoiceChipGroup>
  );
};

export const DisabledOption = () => {
  const [value, setValue] = React.useState('premium');
  return (
    <ChoiceChipGroup
      name="setekategori"
      label="Velg setekategori"
      value={value}
      onChange={e => setValue(e.target.value)}
    >
      <ChoiceChip value="standard">Standard</ChoiceChip>
      <ChoiceChip value="premium">Premium</ChoiceChip>
      <ChoiceChip value="sove" disabled>
        Sove (utsolgt)
      </ChoiceChip>
    </ChoiceChipGroup>
  );
};

export const Small = () => {
  const [value, setValue] = React.useState('i-dag');
  return (
    <ChoiceChipGroup
      name="dato"
      label="Avreise"
      value={value}
      onChange={e => setValue(e.target.value)}
    >
      <ChoiceChip size="small" value="i-dag">
        I dag
      </ChoiceChip>
      <ChoiceChip size="small" value="i-morgen">
        I morgen
      </ChoiceChip>
      <ChoiceChip size="small" value="annen">
        Annen dato
      </ChoiceChip>
    </ChoiceChipGroup>
  );
};
