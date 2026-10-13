import React from 'react';
import { StrongText, Paragraph } from '@entur/linje';

export const Default = () => (
  <StrongText>Billetten må aktiveres før du går om bord</StrongText>
);

export const InContext = () => (
  <Paragraph style={{ maxWidth: 480 }}>
    Husk at <StrongText>billetten må være gyldig</StrongText> når reisen
    starter. Kontrollører kan ilegge gebyr ved manglende billett.
  </Paragraph>
);
