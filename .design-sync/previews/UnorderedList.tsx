import React from 'react';
import { UnorderedList, ListItem, Heading4 } from '@entur/linje';

export const Default = () => (
  <UnorderedList>
    <ListItem>Enkeltbillett</ListItem>
    <ListItem>24-timersbillett</ListItem>
    <ListItem>30-dagersbillett</ListItem>
  </UnorderedList>
);

export const InContext = () => (
  <section style={{ maxWidth: 480 }}>
    <Heading4>Dette er inkludert i billetten</Heading4>
    <UnorderedList>
      <ListItem>
        Fri overgang mellom buss, trikk, T-bane og båt i 60 minutter
      </ListItem>
      <ListItem>Gratis medreise for ett barn under 6 år</ListItem>
      <ListItem>Sykkel på T-banen utenom rushtid</ListItem>
    </UnorderedList>
  </section>
);
