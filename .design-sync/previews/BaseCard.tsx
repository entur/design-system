import React from 'react';
import { BaseCard, Heading3, Paragraph, Label } from '@entur/linje';

export const Default = () => (
  <BaseCard style={{ width: 320, padding: 'var(--space-large)' }}>
    <div>
      <Heading3 margin="bottom">Periodebillett Oslo sone 1</Heading3>
      <Paragraph margin="none">
        Reis ubegrenset med buss, trikk, T-bane og båt i sone 1 i 30 dager.
      </Paragraph>
    </div>
  </BaseCard>
);

export const DepartureSummary = () => (
  <BaseCard style={{ width: 320, padding: 'var(--space-large)' }}>
    <div>
      <Label>Neste avgang</Label>
      <Heading3 margin="bottom">Jernbanetorget → Majorstuen</Heading3>
      <Paragraph margin="none">
        T-bane linje 3 · avgang 14:32 · spor 2
      </Paragraph>
    </div>
  </BaseCard>
);

export const AsSection = () => (
  <div
    style={{ display: 'flex', gap: 'var(--space-default)', flexWrap: 'wrap' }}
  >
    <BaseCard
      as="section"
      style={{
        width: 200,
        flexDirection: 'column',
        padding: 'var(--space-default)',
      }}
    >
      <Label>Reisende i dag</Label>
      <Heading3 margin="none">12 480</Heading3>
    </BaseCard>
    <BaseCard
      as="section"
      style={{
        width: 200,
        flexDirection: 'column',
        padding: 'var(--space-default)',
      }}
    >
      <Label>Solgte billetter</Label>
      <Heading3 margin="none">3 912</Heading3>
    </BaseCard>
  </div>
);
