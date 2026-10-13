import React from 'react';
import { Label, SubLabel, Paragraph } from '@entur/linje';

export const Default = () => <Label>Reisende</Label>;

export const InContext = () => (
  <dl
    style={{
      display: 'grid',
      gridTemplateColumns: 'auto auto',
      gap: 'var(--space-small) var(--space-large)',
      margin: 0,
      maxWidth: 360,
    }}
  >
    <dt>
      <Label margin="none">Fra</Label>
    </dt>
    <dd style={{ margin: 0 }}>
      <Paragraph margin="none">Oslo S</Paragraph>
    </dd>
    <dt>
      <Label margin="none">Til</Label>
    </dt>
    <dd style={{ margin: 0 }}>
      <Paragraph margin="none">Bergen stasjon</Paragraph>
    </dd>
    <dt>
      <Label margin="none">Reisende</Label>
    </dt>
    <dd style={{ margin: 0 }}>
      <Paragraph margin="none">1 voksen</Paragraph>
      <SubLabel margin="none">Standard sete</SubLabel>
    </dd>
  </dl>
);
