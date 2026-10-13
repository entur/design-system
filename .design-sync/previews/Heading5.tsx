import React from 'react';
import { Heading5, Paragraph } from '@entur/linje';

export const Default = () => <Heading5>Avganger fra Oslo S</Heading5>;

export const InContext = () => (
  <section style={{ maxWidth: 480 }}>
    <Heading5>Avganger fra Oslo S</Heading5>
    <Paragraph>Neste tog mot Lillehammer går fra spor 13 kl. 10:12.</Paragraph>
    <Heading5>Ankomster til Oslo S</Heading5>
    <Paragraph>Toget fra Bergen er ventet inn på spor 7 kl. 10:40.</Paragraph>
  </section>
);

export const AsOtherElement = () => (
  <Heading5 as="p">Avganger fra Oslo S (som p-element)</Heading5>
);
