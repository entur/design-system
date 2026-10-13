import React from 'react';
import { VisuallyHidden, IconButton, NotificationBadge } from '@entur/linje';
import { EditIcon } from '@entur/icons';

const note: React.CSSProperties = {
  fontSize: '0.75rem',
  color: 'var(--basecolors-text-subdued, #656782)',
  marginTop: 'var(--space-small, 0.5rem)',
};

export const InBadge = () => (
  <div>
    <NotificationBadge variant="primary">
      3 <VisuallyHidden>nye trafikkmeldinger</VisuallyHidden>
    </NotificationBadge>
    <div style={note}>Skjermleser: «3 nye trafikkmeldinger»</div>
  </div>
);

export const InPrice = () => (
  <div>
    <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>
      <VisuallyHidden>Totalpris: </VisuallyHidden>249 kr
    </div>
    <div style={note}>Skjermleser: «Totalpris: 249 kr»</div>
  </div>
);

export const InIconButton = () => (
  <div>
    <IconButton>
      <EditIcon aria-hidden />
      <VisuallyHidden>Rediger reise Oslo S – Bergen</VisuallyHidden>
    </IconButton>
    <div style={note}>Skjermleser: «Rediger reise Oslo S – Bergen»</div>
  </div>
);
