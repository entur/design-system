import React from 'react';
import { TextField } from '@entur/linje';
import { SearchIcon } from '@entur/icons';

export const Default = () => (
  <div style={{ width: 320 }}>
    <TextField label="Fornavn" defaultValue="Kari" />
  </div>
);

export const WithIcon = () => (
  <div style={{ width: 320 }}>
    <TextField
      label="Søk etter stoppested"
      prepend={<SearchIcon inline />}
      placeholder="F.eks. Oslo S"
    />
  </div>
);

export const Feedback = () => (
  <div style={{ display: 'grid', gap: '1.5rem', width: 320 }}>
    <TextField
      label="E-post"
      defaultValue="kari@eksempel"
      variant="negative"
      feedback="Skriv inn en gyldig e-postadresse"
    />
    <TextField
      label="Telefonnummer"
      defaultValue="+47 912 34 567"
      variant="success"
      feedback="Nummeret er bekreftet"
    />
  </div>
);

export const Sizes = () => (
  <div style={{ display: 'grid', gap: '1.5rem', width: 320 }}>
    <TextField label="Medium" defaultValue="Oslo S" />
    <TextField label="Stor" size="large" defaultValue="Bergen stasjon" />
  </div>
);

export const DisabledAndReadOnly = () => (
  <div style={{ display: 'grid', gap: '1.5rem', width: 320 }}>
    <TextField label="Kundenummer" defaultValue="102938" readOnly />
    <TextField label="Organisasjon" defaultValue="Entur AS" disabled />
  </div>
);
