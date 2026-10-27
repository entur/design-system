import React from 'react';
import { Flex, Text, Heading } from '@entur/linje';

export const Variants = () => (
  <Flex direction="column" gap="s" maxWidth="460px">
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
  </Flex>
);

export const LabelsAndInline = () => (
  <Flex direction="column" gap="xs">
    <Text variant="overline">Reiseinformasjon</Text>
    <Text variant="label">Avreisested</Text>
    <Text variant="sublabel">Oslo S, spor 4</Text>
    <Text variant="emphasized">Toget er forsinket med 5 minutter</Text>
    <Text>
      Installer med <Text variant="code">npm install @entur/typography</Text>
    </Text>
  </Flex>
);

export const Preformatted = () => (
  <Text variant="preformatted" style={{ maxWidth: 420 }}>
    {`import { Text } from '@entur/typography/beta';

<Text variant="paragraph">Avgang 07:58</Text>`}
  </Text>
);

export const SizesAndWeights = () => (
  <Flex direction="column" gap="xs">
    <Text size="xl" weight="bold">
      Bergen – Oslo
    </Text>
    <Text size="lg" weight="bold">
      Avgang 07:58
    </Text>
    <Text size="m" weight="medium">
      Ankomst 14:43
    </Text>
    <Text size="s">6 t 45 min · 1 bytte</Text>
    <Text size="xs">Regiontog F4 · Vy</Text>
  </Flex>
);

export const WithSpacing = () => (
  <div style={{ maxWidth: 420 }}>
    <Heading as="h3" variant="subtitle-1" spacing={{ bottom: 'xs' }}>
      Ta med sykkel på toget
    </Heading>
    <Text variant="paragraph" spacing={{ bottom: 's' }}>
      På de fleste regiontog kan du ta med sykkel mot et tillegg. Husk å
      reservere plass.
    </Text>
    <Text variant="caption">Gjelder ikke i rushtiden 07–09 og 15–17.</Text>
  </div>
);
