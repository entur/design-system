import React from 'react';
import { CodeText, Paragraph } from '@entur/linje';

export const Default = () => <CodeText>NSR:StopPlace:337</CodeText>;

export const InContext = () => (
  <Paragraph style={{ maxWidth: 480 }}>
    Oslo S har stoppested-ID <CodeText>NSR:StopPlace:337</CodeText> i Nasjonalt
    stoppestedsregister. Bruk ID-en som verdi for <CodeText>from</CodeText> i
    reisesøket.
  </Paragraph>
);
