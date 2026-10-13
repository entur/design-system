import React from 'react';
import { LegBone, Text } from '@entur/linje';

export const Vertical = () => (
  <div
    style={{ display: 'flex', gap: 'var(--space-extra-large)', height: 160 }}
  >
    <LegBone
      direction="vertical"
      pattern="line"
      color="var(--colors-transport-default-train)"
    />
    <LegBone
      direction="vertical"
      pattern="dashed"
      color="var(--colors-transport-default-bus)"
    />
    <LegBone
      direction="vertical"
      pattern="dotted"
      color="var(--colors-transport-default-walk)"
    />
    <LegBone
      direction="vertical"
      pattern="wave"
      color="var(--colors-transport-default-ferry)"
    />
  </div>
);

export const Horizontal = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-large)',
      width: 360,
    }}
  >
    <LegBone
      direction="horizontal"
      pattern="line"
      color="var(--colors-transport-default-metro)"
    />
    <LegBone
      direction="horizontal"
      pattern="dashed"
      color="var(--colors-transport-default-bus)"
    />
    <LegBone
      direction="horizontal"
      pattern="wave"
      color="var(--colors-transport-default-ferry)"
    />
  </div>
);

export const StartAndEnd = () => (
  <div
    style={{ display: 'flex', gap: 'var(--space-extra-large)', height: 160 }}
  >
    <LegBone
      direction="vertical"
      pattern="line"
      color="var(--colors-transport-default-tram)"
      showStop={false}
    />
    <LegBone
      direction="vertical"
      pattern="line"
      color="var(--colors-transport-default-tram)"
      showStart={false}
    />
    <LegBone
      direction="vertical"
      pattern="line"
      color="var(--colors-transport-default-train)"
      startColor="var(--colors-transport-default-walk)"
      endColor="var(--colors-transport-default-bus)"
    />
  </div>
);

export const WithLabels = () => (
  <div style={{ display: 'flex', gap: 'var(--space-default)', height: 140 }}>
    <LegBone
      direction="vertical"
      pattern="line"
      color="var(--colors-transport-default-train)"
    />
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Text variant="label">07:58 Oslo S</Text>
      <Text variant="subparagraph">Regiontog F4 mot Bergen</Text>
      <Text variant="label">14:43 Bergen stasjon</Text>
    </div>
  </div>
);
