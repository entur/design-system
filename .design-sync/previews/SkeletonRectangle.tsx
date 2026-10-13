import React from 'react';
import { SkeletonRectangle, SkeletonWrapper } from '@entur/linje';

export const Default = () => (
  <SkeletonWrapper style={{ width: 320 }}>
    <SkeletonRectangle />
  </SkeletonWrapper>
);

export const TextLines = () => (
  <SkeletonWrapper
    style={{ width: 320, display: 'grid', gap: 'var(--space-small, 0.5rem)' }}
  >
    <SkeletonRectangle width="40%" height="1.5rem" />
    <SkeletonRectangle width="100%" />
    <SkeletonRectangle width="85%" />
    <SkeletonRectangle width="60%" />
  </SkeletonWrapper>
);

export const ImageBlock = () => (
  <SkeletonWrapper style={{ width: 320 }}>
    <SkeletonRectangle width="100%" height="160px" />
  </SkeletonWrapper>
);
