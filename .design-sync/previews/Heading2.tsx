import React from 'react';
import { Heading2, Paragraph } from '@entur/linje';

export const Default = () => <Heading2>Enkeltbillett</Heading2>;

export const InContext = () => (
  <section style={{ maxWidth: 480 }}>
    <Heading2>Enkeltbillett</Heading2>
    <Paragraph>
      Gjelder for én reise i valgt sone, med fri overgang i 60 minutter.
    </Paragraph>
    <Heading2>Periodebillett</Heading2>
    <Paragraph>
      Reis så mye du vil i 7, 30 eller 365 dager innenfor valgte soner.
    </Paragraph>
  </section>
);

export const AsOtherElement = () => (
  <Heading2 as="p">Enkeltbillett (som p-element)</Heading2>
);
