import React from 'react';
import { Heading, Text, TextContainer } from '@entur/linje';

export const Article = () => (
  <TextContainer as="article" style={{ maxWidth: 460 }}>
    <Text variant="overline">Reiseinformasjon</Text>
    <Heading as="h2" variant="title-2">
      Ta med sykkel på toget
    </Heading>
    <Text variant="leading">
      På de fleste regiontog kan du ta med sykkel mot et tillegg.
    </Text>
    <Text variant="paragraph">
      Sykkelen må stå i sykkelstativet, og du må reservere plass før du reiser.
      Det gjelder også når du bytter tog underveis.
    </Text>
    <Heading as="h3" variant="subtitle-1">
      Når kan du ta med sykkel?
    </Heading>
    <Text variant="paragraph">Dette gjelder på regiontog:</Text>
    <ul>
      <li>Hele døgnet i helger</li>
      <li>Utenom rushtiden 07–09 og 15–17 på hverdager</li>
    </ul>
    <Text variant="caption">Sist oppdatert 14. oktober 2026</Text>
  </TextContainer>
);

export const PlainHtml = () => (
  <TextContainer style={{ maxWidth: 460 }}>
    <h3>Billetter for barn</h3>
    <p>
      Barn under 6 år reiser gratis sammen med en voksen. Barn fra 6 til 17 år
      reiser med barnebillett.
    </p>
    <h4>Periodebillett</h4>
    <p>Barn kan også kjøpe periodebillett for 7 eller 30 dager.</p>
  </TextContainer>
);

export const WithSpacing = () => (
  <TextContainer spacing={{ bottom: '3xl' }} style={{ maxWidth: 460 }}>
    <Heading as="h3" variant="subtitle-1">
      Forsinkelser
    </Heading>
    <Text variant="paragraph" spacing={{ bottom: 'xs' }}>
      Spacing på et barn erstatter avstanden etter det.
    </Text>
    <Text variant="subparagraph">
      Oppdatert reiseinformasjon finner du i appen.
    </Text>
  </TextContainer>
);
