import React from 'react';
import { Heading3, Paragraph } from '@entur/linje';

export const Default = () => <Heading3>Rabatter</Heading3>;

export const InContext = () => (
  <section style={{ maxWidth: 480 }}>
    <Heading3>Rabatter</Heading3>
    <Paragraph>
      Barn, honnør og studenter får rabatt på de fleste billetter.
    </Paragraph>
    <Heading3>Sykkel på toget</Heading3>
    <Paragraph>
      Du kan ta med sykkel på de fleste regiontog mot et tillegg.
    </Paragraph>
  </section>
);

export const AsOtherElement = () => (
  <Heading3 as="p">Rabatter (som p-element)</Heading3>
);
