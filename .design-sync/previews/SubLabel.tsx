import React from 'react';
import { SubLabel, Label, Paragraph } from '@entur/linje';

export const Default = () => <SubLabel>Maks 20 tegn</SubLabel>;

export const InContext = () => (
  <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 320 }}>
    <Label margin="none">Periodebillett</Label>
    <Paragraph margin="none">30 dager, sone 1</Paragraph>
    <SubLabel>Gyldig til 14.07.2025 kl. 23:59</SubLabel>
  </div>
);
