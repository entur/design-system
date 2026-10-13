import React from 'react';
import { EmphasizedText, Paragraph } from '@entur/linje';

export const Default = () => (
  <EmphasizedText>Gjelder kun på regiontog</EmphasizedText>
);

export const InContext = () => (
  <Paragraph style={{ maxWidth: 480 }}>
    Sykkel kan tas med på toget mot tillegg,{' '}
    <EmphasizedText>men ikke i rushtiden</EmphasizedText> mellom kl. 07 og 09.
  </Paragraph>
);
