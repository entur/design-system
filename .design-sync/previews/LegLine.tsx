import React from 'react';
import { LegLine } from '@entur/linje';

export const Horizontal = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-large)',
      width: 360,
    }}
  >
    <LegLine
      direction="horizontal"
      pattern="line"
      color="var(--colors-transport-default-train)"
    />
    <LegLine
      direction="horizontal"
      pattern="dashed"
      color="var(--colors-transport-default-bus)"
    />
    <LegLine
      direction="horizontal"
      pattern="dotted"
      color="var(--colors-transport-default-walk)"
    />
    <LegLine
      direction="horizontal"
      pattern="wave"
      color="var(--colors-transport-default-ferry)"
    />
  </div>
);

export const Vertical = () => (
  <div
    style={{ display: 'flex', gap: 'var(--space-extra-large)', height: 160 }}
  >
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <LegLine
        direction="vertical"
        pattern="line"
        color="var(--colors-transport-default-metro)"
      />
    </div>
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <LegLine
        direction="vertical"
        pattern="dashed"
        color="var(--colors-transport-default-bus)"
      />
    </div>
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <LegLine
        direction="vertical"
        pattern="dotted"
        color="var(--colors-transport-default-walk)"
      />
    </div>
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <LegLine
        direction="vertical"
        pattern="wave"
        color="var(--colors-transport-default-ferry)"
      />
    </div>
  </div>
);
