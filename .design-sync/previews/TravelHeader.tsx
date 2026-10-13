import React from 'react';
import { TravelHeader } from '@entur/linje';

export const Large = () => <TravelHeader from="Bergen" to="Oslo" />;

export const Medium = () => (
  <TravelHeader size="medium" from="Trondheim S" to="Bodø stasjon" />
);

export const NoWrap = () => (
  <TravelHeader noWrap from="Jernbanetorget" to="Majorstuen" />
);

export const Truncated = () => (
  <div style={{ width: 170 }}>
    <TravelHeader
      size="medium"
      from="Stavanger lufthavn Sola"
      to="Kristiansand busstasjon"
    />
  </div>
);
