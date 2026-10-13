import React from 'react';
import { ExpandableText, Paragraph } from '@entur/linje';

export const Closed = () => (
  <div style={{ width: 420, maxWidth: '100%' }}>
    <ExpandableText title="Hva er inkludert i billetten?">
      <Paragraph margin="none">
        Billetten gjelder for alle busser, trikker og T-banen i sone 1 i 60
        minutter.
      </Paragraph>
    </ExpandableText>
  </div>
);

export const Open = () => (
  <div style={{ width: 420, maxWidth: '100%' }}>
    <ExpandableText title="Hva er inkludert i billetten?" defaultOpen>
      <Paragraph margin="none">
        Billetten gjelder for alle busser, trikker og T-banen i sone 1 i 60
        minutter.
      </Paragraph>
    </ExpandableText>
  </div>
);

export const TitleElements = () => (
  <div
    style={{
      width: 420,
      maxWidth: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-default)',
    }}
  >
    <ExpandableText title="Reisevilkår" titleElement="Heading3">
      <Paragraph margin="none">
        Les vilkårene for kjøp og bruk av billetter.
      </Paragraph>
    </ExpandableText>
    <ExpandableText title="Personvern" titleElement="Heading4">
      <Paragraph margin="none">
        Vi lagrer bare nødvendige opplysninger om reisene dine.
      </Paragraph>
    </ExpandableText>
    <ExpandableText title="Vis flere avganger" titleElement="Paragraph">
      <Paragraph margin="none">
        09:12, 09:42 og 10:12 fra Nationaltheatret.
      </Paragraph>
    </ExpandableText>
  </div>
);
