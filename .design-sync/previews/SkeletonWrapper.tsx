import React from 'react';
import {
  SkeletonWrapper,
  SkeletonCircle,
  SkeletonRectangle,
} from '@entur/linje';

export const Default = () => (
  <SkeletonWrapper
    style={{ width: 360, display: 'grid', gap: 'var(--space-small, 0.5rem)' }}
  >
    <SkeletonCircle size="5em" />
    <SkeletonRectangle width="30%" />
    <SkeletonRectangle width="70%" />
    <SkeletonRectangle />
  </SkeletonWrapper>
);

export const DepartureList = () => (
  <SkeletonWrapper
    loadingAriaLabel="Laster inn avganger …"
    style={{ width: 360, display: 'grid', gap: 'var(--space-default, 1rem)' }}
  >
    {[0, 1, 2].map(i => (
      <div
        key={i}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-default, 1rem)',
        }}
      >
        <SkeletonCircle size="2rem" />
        <div
          style={{
            flex: 1,
            display: 'grid',
            gap: 'var(--space-extra-small, 0.25rem)',
          }}
        >
          <SkeletonRectangle width="50%" />
          <SkeletonRectangle width="80%" height="0.75rem" />
        </div>
        <SkeletonRectangle width="3rem" height="1.25rem" />
      </div>
    ))}
  </SkeletonWrapper>
);

export const TicketCard = () => (
  <SkeletonWrapper
    loadingAriaLabel="Laster inn billett …"
    style={{
      width: 320,
      padding: 'var(--space-default, 1rem)',
      border: '1px solid var(--basecolors-stroke-subdued, #d7d7e0)',
      borderRadius: 4,
      display: 'grid',
      gap: 'var(--space-small, 0.5rem)',
    }}
  >
    <SkeletonRectangle width="100%" height="120px" />
    <SkeletonRectangle width="60%" height="1.25rem" />
    <SkeletonRectangle width="40%" />
  </SkeletonWrapper>
);
