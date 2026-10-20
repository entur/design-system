import React from 'react';
import { Heading } from '@entur/typography/beta';
import type { HeadingProps } from '@entur/typography/beta';

type Props = Omit<HeadingProps<'h2'>, 'as' | 'variant'>;

// Heading levels in documentation content, as one place to change the look
export const DocH2 = (props: Props) => (
  <Heading as="h2" variant="title-2" {...props} />
);
export const DocH3 = (props: Props) => (
  <Heading as="h3" variant="subtitle-1" {...props} />
);
export const DocH4 = (props: Props) => (
  <Heading as="h4" variant="subtitle-2" {...props} />
);
export const DocH5 = (props: Props) => (
  <Heading as="h5" variant="section-1" {...props} />
);
