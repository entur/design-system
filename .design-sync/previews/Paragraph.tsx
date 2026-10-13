import React from 'react';
import { Paragraph, Heading3, Link } from '@entur/linje';

export const Default = () => (
  <Paragraph style={{ maxWidth: 480 }}>
    Med Entur-appen kan du planlegge reisen, kjøpe billett og se sanntid for
    avganger over hele Norge.
  </Paragraph>
);

export const InContext = () => (
  <section style={{ maxWidth: 480 }}>
    <Heading3>Refusjon av billett</Heading3>
    <Paragraph>
      Har du kjøpt en billett du ikke får brukt, kan du i mange tilfeller få
      pengene tilbake. Refusjon må søkes før billetten er tatt i bruk.
    </Paragraph>
    <Paragraph>
      Les mer om <Link href="#">vilkår for refusjon</Link> før du sender inn
      søknaden.
    </Paragraph>
  </section>
);

export const NoMargin = () => (
  <div
    style={{
      maxWidth: 480,
      outline: '1px dashed var(--basecolors-stroke-subtle, #ccc)',
    }}
  >
    <Paragraph margin="none">
      Avsnitt uten bunnmarg, for bruk i tette komponenter som kort og lister.
    </Paragraph>
  </div>
);
