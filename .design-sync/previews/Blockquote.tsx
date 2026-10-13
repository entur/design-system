import React from 'react';
import { Blockquote, BlockquoteFooter, Paragraph } from '@entur/linje';

export const Default = () => (
  <Blockquote style={{ maxWidth: 480 }}>
    <Paragraph>
      Endelig kan jeg kjøpe én billett for hele reisen, uansett hvilket selskap
      som kjører.
    </Paragraph>
    <BlockquoteFooter>Kari Nordmann, pendler fra Drammen</BlockquoteFooter>
  </Blockquote>
);

export const WithoutFooter = () => (
  <Blockquote style={{ maxWidth: 480 }}>
    <Paragraph>
      Kollektivtrafikken skal være enkel å bruke for alle, over hele landet.
    </Paragraph>
  </Blockquote>
);
