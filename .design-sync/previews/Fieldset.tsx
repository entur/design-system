import React from 'react';
import { Fieldset, TextField, Checkbox } from '@entur/linje';

export const Default = () => (
  <div style={{ width: 320 }}>
    <Fieldset label="Reisende">
      <div style={{ display: 'grid', gap: 'var(--space-default, 1rem)' }}>
        <TextField label="Fornavn" defaultValue="Kari" />
        <TextField label="Etternavn" defaultValue="Nordmann" />
        <TextField label="E-post" defaultValue="kari.nordmann@example.com" />
      </div>
    </Fieldset>
  </div>
);

const Box = ({ label, initial }: { label: string; initial: boolean }) => {
  const [checked, setChecked] = React.useState(initial);
  return (
    <Checkbox checked={checked} onChange={e => setChecked(e.target.checked)}>
      {label}
    </Checkbox>
  );
};

export const WithCheckboxes = () => (
  <Fieldset label="Hvilke sparkesykler vil du se i kartet?">
    <Box label="Tier" initial={true} />
    <Box label="Voi" initial={false} />
    <Box label="Ryde" initial={true} />
  </Fieldset>
);
