import React from 'react';
import { SmallAlertBox } from '@entur/linje';

const Stack = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-default)',
    }}
  >
    {children}
  </div>
);

export const Information = () => (
  <SmallAlertBox variant="information">
    Husk å ha med gyldig legitimasjon ved kjøp av honnørbillett.
  </SmallAlertBox>
);

export const Variants = () => (
  <Stack>
    <SmallAlertBox variant="success">Setet ditt er reservert.</SmallAlertBox>
    <SmallAlertBox variant="warning">
      Avgangen er forsinket med 12 minutter.
    </SmallAlertBox>
    <SmallAlertBox variant="negative">
      Billetten er ikke lenger gyldig.
    </SmallAlertBox>
  </Stack>
);

export const Closable = () => (
  <SmallAlertBox
    variant="information"
    title="Plattformendring"
    closable
    closeButtonLabel="Lukk melding"
    onClose={() => undefined}
  >
    Toget til Drammen går fra spor 4 i dag.
  </SmallAlertBox>
);

export const Width = () => (
  <Stack>
    <SmallAlertBox variant="success" width="fit-content">
      Endringene er lagret.
    </SmallAlertBox>
    <SmallAlertBox variant="warning" width="fluid">
      Enkelte avganger kan være innstilt på grunn av vær.
    </SmallAlertBox>
  </Stack>
);
