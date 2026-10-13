import React from 'react';
import { Blockquote, BlockquoteFooter, Paragraph } from '@entur/linje';

export const Default = () => (
  <Blockquote style={{ maxWidth: 480 }}>
    <Paragraph>
      Sanntidsinformasjonen i appen gjør at jeg aldri står og venter på bussen.
    </Paragraph>
    <BlockquoteFooter>Ola Nordmann, Entur</BlockquoteFooter>
  </Blockquote>
);
