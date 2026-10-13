import React from 'react';
import {
  BulletBadge,
  Table,
  TableHead,
  TableBody,
  TableRow,
  HeaderCell,
  DataCell,
} from '@entur/linje';

export const Default = () => <BulletBadge variant="success">Aktiv</BulletBadge>;

export const Variants = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-small)',
    }}
  >
    <BulletBadge variant="primary">Ny</BulletBadge>
    <BulletBadge variant="success">I rute</BulletBadge>
    <BulletBadge variant="warning">Forsinket</BulletBadge>
    <BulletBadge variant="negative">Innstilt</BulletBadge>
    <BulletBadge variant="information">Planlagt arbeid</BulletBadge>
    <BulletBadge variant="neutral">Kladd</BulletBadge>
  </div>
);

export const InTable = () => (
  <Table>
    <TableHead>
      <TableRow>
        <HeaderCell>Avgang</HeaderCell>
        <HeaderCell>Til</HeaderCell>
        <HeaderCell>Status</HeaderCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <DataCell>14:32</DataCell>
        <DataCell>Bergen</DataCell>
        <DataCell>
          <BulletBadge variant="success">I rute</BulletBadge>
        </DataCell>
      </TableRow>
      <TableRow>
        <DataCell>14:47</DataCell>
        <DataCell>Lillehammer</DataCell>
        <DataCell>
          <BulletBadge variant="warning">Forsinket</BulletBadge>
        </DataCell>
      </TableRow>
      <TableRow>
        <DataCell>15:05</DataCell>
        <DataCell>Drammen</DataCell>
        <DataCell>
          <BulletBadge variant="negative">Innstilt</BulletBadge>
        </DataCell>
      </TableRow>
    </TableBody>
  </Table>
);
