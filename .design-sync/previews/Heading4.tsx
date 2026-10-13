import React from 'react';
import { Heading4, Paragraph } from '@entur/linje';

export const Default = () => <Heading4>Hvem kan kjøpe honnørbillett?</Heading4>;

export const InContext = () => (
  <section style={{ maxWidth: 480 }}>
    <Heading4>Hvem kan kjøpe honnørbillett?</Heading4>
    <Paragraph>
      Honnørbillett gjelder for deg som er 67 år eller eldre, og for personer
      med uføretrygd.
    </Paragraph>
    <Heading4>Hva må jeg ha med meg?</Heading4>
    <Paragraph>Ha gyldig legitimasjon klar ved billettkontroll.</Paragraph>
  </section>
);

export const AsOtherElement = () => (
  <Heading4 as="p">Hvem kan kjøpe honnørbillett? (som p-element)</Heading4>
);
