import React from 'react';
import { BreadcrumbNavigation, BreadcrumbItem, Contrast } from '@entur/linje';

export const Default = () => (
  <BreadcrumbNavigation>
    <BreadcrumbItem href="#">Forside</BreadcrumbItem>
    <BreadcrumbItem href="#">Billetter</BreadcrumbItem>
    <BreadcrumbItem href="#">Periodebillett</BreadcrumbItem>
  </BreadcrumbNavigation>
);

export const DeepPath = () => (
  <BreadcrumbNavigation aria-label="Du er her">
    <BreadcrumbItem href="#">Forside</BreadcrumbItem>
    <BreadcrumbItem href="#">Kundeservice</BreadcrumbItem>
    <BreadcrumbItem href="#">Refusjon</BreadcrumbItem>
    <BreadcrumbItem href="#">Forsinkelse</BreadcrumbItem>
    <BreadcrumbItem href="#">Søk om refusjon</BreadcrumbItem>
  </BreadcrumbNavigation>
);

export const OnContrast = () => (
  <Contrast style={{ padding: 'var(--space-default)' }}>
    <BreadcrumbNavigation>
      <BreadcrumbItem href="#">Forside</BreadcrumbItem>
      <BreadcrumbItem href="#">Min side</BreadcrumbItem>
      <BreadcrumbItem href="#">Mine reiser</BreadcrumbItem>
    </BreadcrumbNavigation>
  </Contrast>
);
