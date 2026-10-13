import React from 'react';
import { NumberedList, ListItem, Heading4 } from '@entur/linje';

export const Default = () => (
  <NumberedList>
    <ListItem>Velg hvor du reiser fra og til</ListItem>
    <ListItem>Velg billettype og antall reisende</ListItem>
    <ListItem>Betal med kort eller Vipps</ListItem>
  </NumberedList>
);

export const WithTitles = () => (
  <section style={{ maxWidth: 480 }}>
    <Heading4>Slik får du refusjon</Heading4>
    <NumberedList>
      <ListItem title="Finn billetten">
        Gå til «Mine billetter» i appen og velg billetten du vil refundere.
      </ListItem>
      <ListItem title="Søk om refusjon">
        Trykk «Refunder» og bekreft. Billetten kan ikke være aktivert.
      </ListItem>
      <ListItem title="Motta pengene">
        Beløpet tilbakeføres til betalingsmiddelet innen 5 virkedager.
      </ListItem>
    </NumberedList>
  </section>
);
