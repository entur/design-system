import React from 'react';
import { TravelLeg, TravelTag, Text, Contrast } from '@entur/linje';

export const Vertical = () => (
  <div
    style={{ display: 'flex', gap: 'var(--space-extra-large)', height: 160 }}
  >
    <TravelLeg transport="bus" direction="vertical" />
    <TravelLeg transport="tram" direction="vertical" />
    <TravelLeg transport="metro" direction="vertical" />
    <TravelLeg transport="rail" direction="vertical" />
    <TravelLeg transport="ferry" direction="vertical" />
    <TravelLeg transport="walk" direction="vertical" />
  </div>
);

export const Horizontal = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-default)',
      width: 360,
    }}
  >
    <TravelLeg transport="rail" direction="horizontal" />
    <TravelLeg transport="bus" direction="horizontal" />
    <TravelLeg transport="ferry" direction="horizontal" />
  </div>
);

export const Itinerary = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-extra-small)',
      width: 480,
    }}
  >
    <TravelTag transport="walk" type="duration">
      4
    </TravelTag>
    <div style={{ flex: 1, display: 'flex' }}>
      <TravelLeg transport="walk" direction="horizontal" style={{ flex: 1 }} />
    </div>
    <TravelTag transport="metro">3</TravelTag>
    <div style={{ flex: 2, display: 'flex' }}>
      <TravelLeg transport="metro" direction="horizontal" style={{ flex: 1 }} />
    </div>
    <TravelTag transport="bus">31</TravelTag>
    <div style={{ flex: 2, display: 'flex' }}>
      <TravelLeg transport="bus" direction="horizontal" style={{ flex: 1 }} />
    </div>
  </div>
);

export const TripDetails = () => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'auto 1rem 1fr',
      columnGap: 'var(--space-default)',
      width: 360,
    }}
  >
    <Text variant="label" style={{ gridRow: 1 }}>
      08:12
    </Text>
    <div style={{ gridRow: '1 / 3', gridColumn: 2, display: 'flex' }}>
      <TravelLeg transport="tram" direction="vertical" />
    </div>
    <Text variant="label" style={{ gridRow: 1, gridColumn: 3 }}>
      Jernbanetorget
    </Text>
    <Text
      variant="subparagraph"
      style={{ gridRow: 2, gridColumn: 3, padding: 'var(--space-large) 0' }}
    >
      Trikk 17 mot Rikshospitalet
    </Text>
    <Text variant="label" style={{ gridRow: 3 }}>
      08:24
    </Text>
    <Text variant="label" style={{ gridRow: 3, gridColumn: 3 }}>
      Tullinløkka
    </Text>
  </div>
);

export const OnContrast = () => (
  <Contrast
    style={{
      padding: 'var(--space-large)',
      display: 'flex',
      gap: 'var(--space-extra-large)',
      height: 140,
    }}
  >
    <TravelLeg transport="bus" direction="vertical" />
    <TravelLeg transport="rail" direction="vertical" />
    <TravelLeg transport="ferry" direction="vertical" />
    <TravelLeg transport="walk" direction="vertical" />
  </Contrast>
);
