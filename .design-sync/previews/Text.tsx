import React from 'react';
import { Text, Heading } from '@entur/linje';

export const Variants = () => (
  <div style={{ maxWidth: 460 }}>
    <Text variant="leading">
      Entur samler reiseinformasjon for all kollektivtrafikk i Norge.
    </Text>
    <Text variant="paragraph">
      Du kan kjøpe billetter til tog, buss, trikk og båt i Entur-appen.
    </Text>
    <Text variant="subparagraph">
      Priser kan variere mellom kollektivselskapene.
    </Text>
    <Text variant="caption">Sist oppdatert 14:32</Text>
    <Text variant="quote">«Enklere å velge en bærekraftig reise.»</Text>
  </div>
);

export const LabelsAndInline = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-extra-small)',
    }}
  >
    <Text variant="overline">Reiseinformasjon</Text>
    <Text variant="label">Avreisested</Text>
    <Text variant="sublabel">Oslo S, spor 4</Text>
    <Text variant="emphasized">Toget er forsinket med 5 minutter</Text>
    <Text variant="code-text">npm install @entur/typography</Text>
  </div>
);

export const Weights = () => (
  <div>
    <Text size="xl" weight="bold">
      Bergen – Oslo
    </Text>
    <Text size="lg" weight="semibold">
      Avgang 07:58
    </Text>
    <Text size="m" weight="medium">
      Ankomst 14:43
    </Text>
    <Text size="s" weight="regular">
      6 t 45 min · 1 bytte
    </Text>
    <Text size="xs" weight="regular">
      Regiontog F4 · Vy
    </Text>
  </div>
);

export const InContext = () => (
  <div style={{ maxWidth: 420 }}>
    <Heading as="h3" variant="subtitle-1" spacing="xs-bottom">
      Ta med sykkel på toget
    </Heading>
    <Text variant="paragraph" spacing="sm-bottom">
      På de fleste regiontog kan du ta med sykkel mot et tillegg. Husk å
      reservere plass.
    </Text>
    <Text variant="caption">Gjelder ikke i rushtiden 07–09 og 15–17.</Text>
  </div>
);
