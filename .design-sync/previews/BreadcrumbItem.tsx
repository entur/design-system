import React from 'react';
import { BreadcrumbNavigation, BreadcrumbItem } from '@entur/linje';

export const Default = () => (
  <BreadcrumbNavigation>
    <BreadcrumbItem href="#">Forside</BreadcrumbItem>
    <BreadcrumbItem href="#">Reiseplanlegger</BreadcrumbItem>
    <BreadcrumbItem href="#">Oslo S – Bergen stasjon</BreadcrumbItem>
  </BreadcrumbNavigation>
);

export const TwoLevels = () => (
  <BreadcrumbNavigation>
    <BreadcrumbItem href="#">Forside</BreadcrumbItem>
    <BreadcrumbItem href="#">Kundeservice</BreadcrumbItem>
  </BreadcrumbNavigation>
);
