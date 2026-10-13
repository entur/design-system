import React from 'react';
import { SmallText, Paragraph, StrongText } from '@entur/linje';

export const Default = () => <SmallText>Sist oppdatert kl. 10:04</SmallText>;

export const InContext = () => (
  <div
    style={{
      maxWidth: 360,
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-extra-small)',
    }}
  >
    <Paragraph margin="none">
      <StrongText>L1 Spikkestad</StrongText> · avgang 10:04 fra spor 3
    </Paragraph>
    <SmallText>Forsinket ca. 5 minutter på grunn av signalfeil</SmallText>
  </div>
);

export const AsBlock = () => (
  <SmallText as="p" margin="none" style={{ maxWidth: 360 }}>
    Ved å kjøpe billett godtar du Enturs reisevilkår og personvernerklæring.
  </SmallText>
);
