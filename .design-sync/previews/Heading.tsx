import React from 'react';
import { Flex, Heading, Text, TextContainer } from '@entur/linje';

export const Variants = () => (
  <Flex direction="column" gap="s">
    <Heading as="h1" variant="title-1">
      Reis kollektivt i hele Norge
    </Heading>
    <Heading as="h2" variant="title-2">
      Planlegg reisen
    </Heading>
    <Heading as="h3" variant="subtitle-1">
      Avganger fra Oslo S
    </Heading>
    <Heading as="h4" variant="subtitle-2">
      Billetter og priser
    </Heading>
    <Heading as="h5" variant="section-1">
      Periodebilletter
    </Heading>
    <Heading as="h6" variant="section-2">
      Enkeltbilletter
    </Heading>
  </Flex>
);

export const Sizes = () => (
  <Flex direction="column" gap="s">
    <Heading as="h2" size="2xl">
      Stoppesteder
    </Heading>
    <Heading as="h2" size="xl">
      Stoppesteder
    </Heading>
    <Heading as="h2" size="lg">
      Stoppesteder
    </Heading>
    <Heading as="h2" size="m">
      Stoppesteder
    </Heading>
    <Heading as="h2" size="s">
      Stoppesteder
    </Heading>
    <Heading as="h2" size="xs">
      Stoppesteder
    </Heading>
  </Flex>
);

export const WithText = () => (
  <TextContainer style={{ maxWidth: 440 }}>
    <Heading as="h2" variant="title-2">
      Én billett til hele reisen
    </Heading>
    <Text variant="paragraph">
      Uansett om reisen består av flere delstrekninger, kan du kjøpe billett til
      hele reisen med ett tastetrykk – også når du bytter mellom tog og buss.
    </Text>
  </TextContainer>
);

export const WithSpacing = () => (
  <div style={{ maxWidth: 440 }}>
    <Heading as="h3" variant="subtitle-1" spacing={{ bottom: 'xs' }}>
      Ta med sykkel på toget
    </Heading>
    <Text variant="paragraph">
      Utenfor en TextContainer har overskriften ingen avstand før du gir den
      spacing.
    </Text>
  </div>
);
