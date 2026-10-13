import React from 'react';
import {
  Flex,
  FlexSpacer,
  BaseCard,
  Tag,
  Button,
  Heading3,
  Paragraph,
} from '@entur/linje';

const Box = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      background: 'var(--colors-blues-blue90)',
      border: '1px solid var(--colors-blues-blue70)',
      borderRadius: 4,
      padding: 'var(--space-small) var(--space-default)',
    }}
  >
    {children}
  </div>
);

export const Row = () => (
  <Flex gap="m" align="center">
    <Box>Buss</Box>
    <Box>Trikk</Box>
    <Box>T-bane</Box>
    <Box>Tog</Box>
  </Flex>
);

export const Column = () => (
  <Flex direction="column" gap="s" width="240px">
    <Box>Jernbanetorget</Box>
    <Box>Stortinget</Box>
    <Box>Nationaltheatret</Box>
    <Box>Majorstuen</Box>
  </Flex>
);

export const WithSpacer = () => (
  <BaseCard style={{ width: 420, padding: 'var(--space-default)' }}>
    <Flex direction="column" gap="xs" width="100%">
      <Flex align="center" gap="s">
        <Heading3 margin="none">Oslo S → Bergen</Heading3>
        <FlexSpacer />
        <Tag variant="success">I rute</Tag>
      </Flex>
      <Paragraph margin="none">Avgang 07:58 · 6 t 45 min</Paragraph>
    </Flex>
  </BaseCard>
);

export const Justify = () => (
  <Flex direction="column" gap="s" width="420px">
    <Flex justify="space-between" align="center">
      <Box>Tilbake</Box>
      <Box>Neste</Box>
    </Flex>
    <Flex justify="center" gap="s">
      <Box>Sentrert</Box>
    </Flex>
    <Flex justify="flex-end" gap="s">
      <Button variant="secondary" size="small">
        Avbryt
      </Button>
      <Button variant="primary" size="small">
        Kjøp billett
      </Button>
    </Flex>
  </Flex>
);

export const Wrap = () => (
  <Flex wrap="wrap" gap="s" maxWidth="320px">
    {[
      'Sone 1',
      'Sone 2V',
      'Sone 2Ø',
      'Sone 3',
      'Sone 4N',
      'Sone 4S',
      'Sone 5',
    ].map(z => (
      <Tag key={z}>{z}</Tag>
    ))}
  </Flex>
);
