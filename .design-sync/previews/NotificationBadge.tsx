import React from 'react';
import {
  NotificationBadge,
  IconButton,
  Tabs,
  TabList,
  Tab,
  VisuallyHidden,
} from '@entur/linje';
import { BellIcon } from '@entur/icons';

const badgePos: React.CSSProperties = {
  position: 'absolute',
  top: -4,
  right: -10,
};

export const OnIconButton = () => (
  <span style={{ position: 'relative', display: 'inline-flex' }}>
    <IconButton aria-label="Varsler">
      <BellIcon />
    </IconButton>
    <NotificationBadge variant="primary" style={badgePos}>
      4 <VisuallyHidden>uleste varsler</VisuallyHidden>
    </NotificationBadge>
  </span>
);

export const Variants = () => (
  <div
    style={{ display: 'flex', gap: 'var(--space-large)', alignItems: 'center' }}
  >
    {(
      [
        'primary',
        'success',
        'warning',
        'negative',
        'information',
        'neutral',
      ] as const
    ).map((variant, i) => (
      <span
        key={variant}
        style={{ position: 'relative', display: 'inline-flex' }}
      >
        <IconButton aria-label={`Varsler ${variant}`}>
          <BellIcon />
        </IconButton>
        <NotificationBadge variant={variant} style={badgePos}>
          {i + 1}
        </NotificationBadge>
      </span>
    ))}
  </div>
);

export const MaxValue = () => (
  <span style={{ position: 'relative', display: 'inline-flex' }}>
    <IconButton aria-label="Meldinger">
      <BellIcon />
    </IconButton>
    <NotificationBadge variant="negative" max={9} style={badgePos}>
      {27}
    </NotificationBadge>
  </span>
);

export const InTabs = () => (
  <Tabs>
    <TabList>
      <Tab style={{ position: 'relative', minWidth: '9rem' }}>Ordre</Tab>
      <Tab style={{ position: 'relative', minWidth: '9rem' }}>Historikk</Tab>
      <Tab style={{ position: 'relative', minWidth: '9rem' }}>
        Merknader
        <NotificationBadge
          variant="primary"
          style={{ position: 'absolute', top: 0 }}
          max={10}
        >
          1 <VisuallyHidden>notifikasjon</VisuallyHidden>
        </NotificationBadge>
      </Tab>
    </TabList>
  </Tabs>
);
