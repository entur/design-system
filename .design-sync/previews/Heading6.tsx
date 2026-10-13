import React from 'react';
import { Heading6, Paragraph } from '@entur/linje';

export const Default = () => <Heading6>Reisedetaljer</Heading6>;

export const InContext = () => (
  <section style={{ maxWidth: 480 }}>
    <Heading6>Reisedetaljer</Heading6>
    <Paragraph>Oslo S – Bergen, avgang 08:25, ankomst 15:21.</Paragraph>
    <Heading6>Billettinformasjon</Heading6>
    <Paragraph>1 voksen, standard sete, vogn 4 plass 52.</Paragraph>
  </section>
);

export const AsOtherElement = () => (
  <Heading6 as="p">Reisedetaljer (som p-element)</Heading6>
);
