import React from 'react';
import { SegmentedControl, SegmentedChoice } from '@entur/linje';
import { BusIcon, TrainIcon, FerryIcon } from '@entur/icons';

export const Default = () => (
  <div style={{ width: 280 }}>
    <SegmentedControl label="Vis avganger for" defaultValue="i-dag">
      <SegmentedChoice value="i-dag">I dag</SegmentedChoice>
      <SegmentedChoice value="i-morgen">I morgen</SegmentedChoice>
    </SegmentedControl>
  </div>
);

// Transport icons carry their transport colour by default; inside a control
// they take the base text colour via color="currentColor".
const withIcon = (Icon: React.ElementType, label: string) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-extra-small)',
    }}
  >
    <Icon color="currentColor" aria-hidden />
    {label}
  </span>
);

export const WithIcons = () => (
  <div style={{ width: 360 }}>
    <SegmentedControl label="Transportmiddel" defaultValue="tog">
      <SegmentedChoice value="buss">
        {withIcon(BusIcon, 'Buss')}
      </SegmentedChoice>
      <SegmentedChoice value="tog">
        {withIcon(TrainIcon, 'Tog')}
      </SegmentedChoice>
      <SegmentedChoice value="bat">
        {withIcon(FerryIcon, 'Båt')}
      </SegmentedChoice>
    </SegmentedControl>
  </div>
);
