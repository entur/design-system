import React from 'react';
import { ExpandArrow, Paragraph } from '@entur/linje';

const Row = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-extra-small)',
    }}
  >
    {children}
  </div>
);

export const States = () => (
  <div
    style={{
      display: 'flex',
      gap: 'var(--space-extra-large)',
      alignItems: 'center',
    }}
  >
    <Row>
      <Paragraph margin="none">Lukket</Paragraph>
      <ExpandArrow />
    </Row>
    <Row>
      <Paragraph margin="none">Åpen</Paragraph>
      <ExpandArrow open />
    </Row>
  </div>
);

export const InTrigger = () => (
  <button
    type="button"
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-extra-small)',
      background: 'none',
      border: 0,
      padding: 0,
      font: 'inherit',
      color: 'inherit',
      cursor: 'pointer',
    }}
  >
    <Paragraph margin="none" as="span">
      Vis flere avganger
    </Paragraph>
    <ExpandArrow />
  </button>
);
