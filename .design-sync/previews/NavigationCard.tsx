import React from 'react';
import { NavigationCard } from '@entur/linje';
import { MapIcon, UserIcon, ClockIcon } from '@entur/icons';

export const Default = () => (
  <NavigationCard
    title="Reiseplanlegger"
    titleIcon={<MapIcon />}
    href="#"
    style={{ width: 320 }}
  >
    Finn raskeste vei med buss, tog, trikk og båt i hele Norge.
  </NavigationCard>
);

export const Compact = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-default)',
      width: 320,
    }}
  >
    <NavigationCard title="Mine billetter" compact href="#" />
    <NavigationCard title="Reisekort og profil" compact href="#" />
  </div>
);

export const LandingPage = () => (
  <div style={{ display: 'flex', gap: 'var(--space-large)', flexWrap: 'wrap' }}>
    <NavigationCard
      title="Avgangstider"
      titleIcon={<ClockIcon />}
      href="#"
      style={{ width: 260 }}
    >
      Se sanntid for avganger fra ditt nærmeste stoppested.
    </NavigationCard>
    <NavigationCard
      title="Min profil"
      titleIcon={<UserIcon />}
      href="#"
      style={{ width: 260 }}
    >
      Administrer betalingskort, reisekort og kvitteringer.
    </NavigationCard>
  </div>
);
