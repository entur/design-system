import React from 'react';
import { Grid, BaseCard, Label, Heading3 } from '@entur/linje';

const Cell = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      background: 'var(--colors-blues-blue90)',
      border: '1px solid var(--colors-blues-blue70)',
      borderRadius: 4,
      padding: 'var(--space-small)',
      textAlign: 'center',
      height: '100%',
      boxSizing: 'border-box',
    }}
  >
    {children}
  </div>
);

export const ColSpan = () => (
  <Grid gap="s" style={{ width: 520 }}>
    <Grid.Item colSpan={12}>
      <Cell>12</Cell>
    </Grid.Item>
    <Grid.Item colSpan={6}>
      <Cell>6</Cell>
    </Grid.Item>
    <Grid.Item colSpan={6}>
      <Cell>6</Cell>
    </Grid.Item>
    <Grid.Item colSpan={4}>
      <Cell>4</Cell>
    </Grid.Item>
    <Grid.Item colSpan={4}>
      <Cell>4</Cell>
    </Grid.Item>
    <Grid.Item colSpan={4}>
      <Cell>4</Cell>
    </Grid.Item>
    <Grid.Item colSpan={8}>
      <Cell>8</Cell>
    </Grid.Item>
    <Grid.Item colSpan={4}>
      <Cell>4</Cell>
    </Grid.Item>
  </Grid>
);

export const TemplateColumns = () => (
  <Grid templateColumns="repeat(3, 1fr)" gap="m" style={{ width: 520 }}>
    {[
      ['Reisende i dag', '12 480'],
      ['Solgte billetter', '3 912'],
      ['Avvik', '7'],
    ].map(([label, value]) => (
      <BaseCard
        key={label}
        style={{ flexDirection: 'column', padding: 'var(--space-default)' }}
      >
        <Label>{label}</Label>
        <Heading3 margin="none">{value}</Heading3>
      </BaseCard>
    ))}
  </Grid>
);

export const SpanAndPlacement = () => (
  <Grid
    templateColumns="repeat(4, 1fr)"
    autoRows="48px"
    gap="s"
    style={{ width: 520 }}
  >
    <Grid.Item colSpan={2} rowSpan={2}>
      <Cell>Kart</Cell>
    </Grid.Item>
    <Grid.Item colSpan={2}>
      <Cell>Avganger</Cell>
    </Grid.Item>
    <Grid.Item>
      <Cell>Vær</Cell>
    </Grid.Item>
    <Grid.Item>
      <Cell>Avvik</Cell>
    </Grid.Item>
    <Grid.Item colStart={1} colEnd={-1}>
      <Cell>Reiseforslag</Cell>
    </Grid.Item>
  </Grid>
);
