import React from 'react';
import { LeadParagraph, Heading1, Paragraph } from '@entur/linje';

export const Default = () => (
  <LeadParagraph style={{ maxWidth: 560 }}>
    Finn riktig billett for reisen din, enten du reiser en gang eller hver dag.
  </LeadParagraph>
);

export const InContext = () => (
  <article style={{ maxWidth: 560 }}>
    <Heading1>Reis med tog i Norge</Heading1>
    <LeadParagraph>
      Fra Kristiansand til Bodø: slik planlegger du togreisen og finner de beste
      prisene.
    </LeadParagraph>
    <Paragraph>
      Minipris-billetter legges ut for salg inntil 90 dager før avreise og har
      begrenset antall.
    </Paragraph>
  </article>
);
