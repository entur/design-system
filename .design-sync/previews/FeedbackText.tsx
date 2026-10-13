import React from 'react';
import { FeedbackText } from '@entur/linje';

export const Negative = () => (
  <FeedbackText variant="negative">Velg et gyldig stoppested</FeedbackText>
);

export const Variants = () => (
  <div
    style={{ display: 'grid', gap: 'var(--space-default, 1rem)', width: 360 }}
  >
    <FeedbackText variant="negative">Avgangen er innstilt</FeedbackText>
    <FeedbackText variant="warning">Forsinkelser på Bergensbanen</FeedbackText>
    <FeedbackText variant="success">Billetten er kjøpt</FeedbackText>
    <FeedbackText variant="information">
      Husk å ha billetten klar ved kontroll
    </FeedbackText>
  </div>
);

export const WithoutIcon = () => (
  <FeedbackText variant="negative" hideIcon>
    Reisedato kan ikke være tilbake i tid
  </FeedbackText>
);
