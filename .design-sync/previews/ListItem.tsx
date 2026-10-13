import React from 'react';
import { UnorderedList, NumberedList, ListItem } from '@entur/linje';

export const Default = () => (
  <UnorderedList>
    <ListItem>Gyldig på buss, trikk og T-bane i sone 1</ListItem>
    <ListItem>Fri overgang i 60 minutter</ListItem>
  </UnorderedList>
);

export const WithTitle = () => (
  <UnorderedList style={{ maxWidth: 480 }}>
    <ListItem title="Barn under 6 år">
      Reiser gratis sammen med en voksen.
    </ListItem>
    <ListItem title="Barn 6–17 år">Får 50 % rabatt på alle billetter.</ListItem>
  </UnorderedList>
);

export const InNumberedList = () => (
  <NumberedList style={{ maxWidth: 480 }}>
    <ListItem title="Aktiver billetten">
      Trykk «Aktiver» før du går om bord.
    </ListItem>
    <ListItem title="Vis billetten">
      Ha telefonen klar ved billettkontroll.
    </ListItem>
  </NumberedList>
);
