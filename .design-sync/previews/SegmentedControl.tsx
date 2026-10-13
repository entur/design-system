import React from 'react';
import { SegmentedControl, SegmentedChoice } from '@entur/linje';

export const Default = () => (
  <div style={{ width: 360 }}>
    <SegmentedControl label="Velg reisetidspunkt" defaultValue="avreise">
      <SegmentedChoice value="na">Nå</SegmentedChoice>
      <SegmentedChoice value="avreise">Avreise</SegmentedChoice>
      <SegmentedChoice value="ankomst">Ankomst</SegmentedChoice>
    </SegmentedControl>
  </div>
);

export const Sizes = () => (
  <div
    style={{ display: 'grid', gap: 'var(--space-large, 1.5rem)', width: 320 }}
  >
    <SegmentedControl label="Medium" name="size-medium" defaultValue="sone">
      <SegmentedChoice value="sone">Sone</SegmentedChoice>
      <SegmentedChoice value="strekning">Strekning</SegmentedChoice>
    </SegmentedControl>
    <SegmentedControl
      label="Stor"
      name="size-large"
      size="large"
      defaultValue="sone"
    >
      <SegmentedChoice value="sone">Sone</SegmentedChoice>
      <SegmentedChoice value="strekning">Strekning</SegmentedChoice>
    </SegmentedControl>
  </div>
);

export const NoSelection = () => (
  <div style={{ width: 200 }}>
    <SegmentedControl label="Velg påslag eller avslag" name="pris">
      <SegmentedChoice value="prosent">%</SegmentedChoice>
      <SegmentedChoice value="kroner">Kr</SegmentedChoice>
    </SegmentedControl>
  </div>
);
