import React from 'react';
import { VariantProvider, TextField, TextArea } from '@entur/linje';

export const Negative = () => (
  <div style={{ width: 320 }}>
    <VariantProvider variant="negative">
      <div style={{ display: 'grid', gap: 'var(--space-large, 1.5rem)' }}>
        <TextField
          label="Fra"
          defaultValue="Oslo"
          feedback="Velg et stoppested fra listen"
        />
        <TextField
          label="Til"
          defaultValue="Bergn"
          feedback="Fant ingen stoppesteder med dette navnet"
        />
      </div>
    </VariantProvider>
  </div>
);

export const Success = () => (
  <div style={{ width: 320 }}>
    <VariantProvider variant="success">
      <div style={{ display: 'grid', gap: 'var(--space-large, 1.5rem)' }}>
        <TextField
          label="E-post"
          defaultValue="kari.nordmann@example.com"
          feedback="E-posten er bekreftet"
        />
        <TextArea
          label="Melding"
          defaultValue="Jeg ønsker refusjon for innstilt avgang."
          feedback="Meldingen er sendt"
        />
      </div>
    </VariantProvider>
  </div>
);

export const FieldOverride = () => (
  <div style={{ width: 320 }}>
    <VariantProvider variant="negative">
      <div style={{ display: 'grid', gap: 'var(--space-large, 1.5rem)' }}>
        <TextField
          label="Kortnummer"
          defaultValue="1234 5678"
          feedback="Ugyldig kortnummer"
        />
        <TextField
          label="Navn på kort"
          defaultValue="Kari Nordmann"
          variant="success"
          feedback="Ser bra ut"
        />
      </div>
    </VariantProvider>
  </div>
);
