import React from 'react';
import {
  SkeletonCircle,
  SkeletonRectangle,
  SkeletonWrapper,
} from '@entur/linje';

export const Default = () => (
  <SkeletonWrapper>
    <SkeletonCircle size="3rem" />
  </SkeletonWrapper>
);

export const Sizes = () => (
  <SkeletonWrapper
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-default, 1rem)',
    }}
  >
    <SkeletonCircle size="1rem" />
    <SkeletonCircle size="2rem" />
    <SkeletonCircle size="4rem" />
  </SkeletonWrapper>
);

export const AvatarRow = () => (
  <SkeletonWrapper
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-default, 1rem)',
      width: 320,
    }}
  >
    <SkeletonCircle size="3rem" />
    <div
      style={{ flex: 1, display: 'grid', gap: 'var(--space-small, 0.5rem)' }}
    >
      <SkeletonRectangle width="60%" />
      <SkeletonRectangle width="90%" />
    </div>
  </SkeletonWrapper>
);
