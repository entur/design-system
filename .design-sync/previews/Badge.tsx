import React from 'react';
import {
  Badge,
  IconButton,
  Tabs,
  TabList,
  Tab,
  VisuallyHidden,
} from '@entur/linje';
import { BellIcon, UserIcon } from '@entur/icons';

const badgePos: React.CSSProperties = {
  position: 'absolute',
  top: -4,
  right: -10,
};

export const Notification = () => (
  <div
    style={{ display: 'flex', gap: 'var(--space-large)', alignItems: 'center' }}
  >
    <span style={{ position: 'relative', display: 'inline-flex' }}>
      <IconButton aria-label="Varsler">
        <BellIcon />
      </IconButton>
      <Badge variant="primary" type="notification" style={badgePos}>
        3
      </Badge>
    </span>
    <span style={{ position: 'relative', display: 'inline-flex' }}>
      <IconButton aria-label="Min profil">
        <UserIcon />
      </IconButton>
      <Badge variant="negative" type="notification" max={99} style={badgePos}>
        {120}
      </Badge>
    </span>
  </div>
);

export const Bullet = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-small)',
    }}
  >
    <Badge variant="success" type="bullet">
      Aktiv
    </Badge>
    <Badge variant="warning" type="bullet">
      Forsinket
    </Badge>
    <Badge variant="negative" type="bullet">
      Innstilt
    </Badge>
    <Badge variant="information" type="bullet">
      Planlagt
    </Badge>
    <Badge variant="neutral" type="bullet">
      Kladd
    </Badge>
  </div>
);

export const NotificationVariants = () => (
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
      <span key={variant}>
        <Badge variant={variant} type="notification">
          {i + 1}
        </Badge>
      </span>
    ))}
  </div>
);

export const InTabs = () => (
  <Tabs>
    <TabList>
      <Tab style={{ position: 'relative', minWidth: '9rem' }}>Billetter</Tab>
      <Tab style={{ position: 'relative', minWidth: '9rem' }}>
        Reisehistorikk
      </Tab>
      <Tab style={{ position: 'relative', minWidth: '9rem' }}>
        Avvik
        <Badge
          variant="primary"
          type="notification"
          style={{ position: 'absolute', top: 0 }}
        >
          2 <VisuallyHidden>nye avvik</VisuallyHidden>
        </Badge>
      </Tab>
    </TabList>
  </Tabs>
);
