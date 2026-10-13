import React from 'react';
import { TextArea } from '@entur/linje';

export const Default = () => (
  <div style={{ width: 360 }}>
    <TextArea
      label="Beskriv hva som skjedde"
      defaultValue="Toget fra Oslo S til Lillehammer ble innstilt, og jeg måtte ta taxi for å rekke et møte."
    />
  </div>
);

export const Empty = () => (
  <div style={{ width: 360 }}>
    <TextArea label="Tilbakemelding til kundeservice" />
  </div>
);

export const Feedback = () => (
  <div
    style={{ display: 'grid', gap: 'var(--space-large, 1.5rem)', width: 360 }}
  >
    <TextArea
      label="Begrunnelse for refusjon"
      variant="negative"
      feedback="Du må fylle ut en begrunnelse"
    />
    <TextArea
      label="Melding"
      defaultValue="Takk for hjelpen med billetten min!"
      variant="success"
      feedback="Meldingen er sendt"
    />
  </div>
);

export const DisabledAndReadOnly = () => (
  <div
    style={{ display: 'grid', gap: 'var(--space-large, 1.5rem)', width: 360 }}
  >
    <TextArea
      label="Saksnotat"
      defaultValue="Refusjon innvilget 12. mars."
      readOnly
    />
    <TextArea
      label="Kommentar"
      defaultValue="Kan ikke endres etter innsending."
      disabled
    />
  </div>
);
