import React from 'react';
import {
  Heading1,
  Heading2,
  Heading3,
  LeadParagraph,
  Paragraph,
} from '@entur/linje';

export const Default = () => <Heading1>Reis smartere med Entur</Heading1>;

export const InContext = () => (
  <article style={{ maxWidth: 560 }}>
    <Heading1>Billetter og priser</Heading1>
    <LeadParagraph>
      Finn riktig billett for reisen din, enten du reiser en gang eller hver
      dag.
    </LeadParagraph>
    <Heading2>Enkeltbillett</Heading2>
    <Paragraph>
      Gjelder for én reise i valgt sone, med fri overgang i 60 minutter.
    </Paragraph>
    <Heading3>Rabatter</Heading3>
    <Paragraph>
      Barn, honnør og studenter får rabatt på de fleste billetter.
    </Paragraph>
  </article>
);

export const AsOtherElement = () => (
  <Heading1 as="h2">Visuelt H1, semantisk h2</Heading1>
);
