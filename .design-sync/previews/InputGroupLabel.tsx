import React from 'react';
import { InputGroupLabel } from '@entur/linje';

export const Default = () => (
  <InputGroupLabel label="Stoppested" labelId="igl-stopp" staticAnimation />
);

export const Required = () => (
  <InputGroupLabel
    label="E-postadresse"
    labelId="igl-epost"
    required
    staticAnimation
  />
);
