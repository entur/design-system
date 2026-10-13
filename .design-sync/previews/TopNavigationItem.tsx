import React from 'react';
import { TopNavigationItem, Logo, Contrast } from '@entur/linje';

export const Default = () => (
  <nav aria-label="Hovedmeny" style={{ display: 'flex' }}>
    <TopNavigationItem href="#" active>
      Reiseplanlegger
    </TopNavigationItem>
    <TopNavigationItem href="#">Billetter</TopNavigationItem>
    <TopNavigationItem href="#">Min side</TopNavigationItem>
    <TopNavigationItem href="#">Kundeservice</TopNavigationItem>
  </nav>
);

export const InHeader = () => (
  <Contrast
    as="header"
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-large)',
      padding: '0 var(--space-large)',
    }}
  >
    <Logo href="#" size="small" />
    <nav aria-label="Hovedmeny" style={{ display: 'flex' }}>
      <TopNavigationItem href="#">Reiseplanlegger</TopNavigationItem>
      <TopNavigationItem href="#" active>
        Billetter
      </TopNavigationItem>
      <TopNavigationItem href="#">Min side</TopNavigationItem>
      <TopNavigationItem href="#">Kundeservice</TopNavigationItem>
    </nav>
  </Contrast>
);
