import React from 'react';
import { SubParagraph, Paragraph, Heading4 } from '@entur/linje';

export const Default = () => (
  <SubParagraph style={{ maxWidth: 480 }}>
    Prisene gjelder for voksen, og kan endres uten varsel.
  </SubParagraph>
);

export const InContext = () => (
  <section style={{ maxWidth: 480 }}>
    <Heading4>30-dagersbillett, sone 1</Heading4>
    <Paragraph>
      Reis så mye du vil med buss, trikk, T-bane og tog i Oslo i 30 dager.
    </Paragraph>
    <SubParagraph>
      Billetten starter når du aktiverer den, og kan ikke refunderes etter
      aktivering.
    </SubParagraph>
  </section>
);
