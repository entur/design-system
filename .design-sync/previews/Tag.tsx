import React from 'react';
import { Tag } from '@entur/linje';
import { ClockIcon, TrainIcon } from '@entur/icons';

export const Default = () => (
  <div
    style={{
      display: 'flex',
      gap: 'var(--space-default)',
      flexWrap: 'wrap',
      alignItems: 'center',
    }}
  >
    <Tag>Kollektivselskap</Tag>
    <Tag>
      <ClockIcon aria-label="Tidspunkt:" />
      14:32
    </Tag>
    <Tag>
      <TrainIcon aria-hidden />
      Regiontog
    </Tag>
  </div>
);

export const Status = () => (
  <div style={{ display: 'flex', gap: 'var(--space-small)', flexWrap: 'wrap' }}>
    <Tag variant="neutral">Kladd</Tag>
    <Tag variant="success">Betalt</Tag>
    <Tag variant="warning">Forsinket</Tag>
    <Tag variant="negative">Innstilt</Tag>
    <Tag variant="information">Nytt spor</Tag>
  </div>
);

export const Categories = () => (
  <div
    style={{
      display: 'flex',
      gap: 'var(--space-small)',
      flexWrap: 'wrap',
      maxWidth: 420,
    }}
  >
    <Tag variant="blue">Buss</Tag>
    <Tag variant="spring">Sykkel</Tag>
    <Tag variant="jungle">Tog</Tag>
    <Tag variant="lilac">Trikk</Tag>
    <Tag variant="lavender">T-bane</Tag>
    <Tag variant="coral">Fly</Tag>
    <Tag variant="peach">Ferge</Tag>
    <Tag variant="lime">Gange</Tag>
    <Tag variant="mystic">Taxi</Tag>
  </div>
);

export const Sizes = () => (
  <div
    style={{
      display: 'flex',
      gap: 'var(--space-default)',
      alignItems: 'center',
    }}
  >
    <Tag size="small" variant="information">
      Liten
    </Tag>
    <Tag size="medium" variant="information">
      Medium
    </Tag>
    <Tag size="large" variant="information">
      Stor
    </Tag>
  </div>
);
