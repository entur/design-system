import React from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  HeaderCell,
  DataCell,
  BulletBadge,
} from '@entur/linje';

const rows = [
  {
    desc: 'Kan Entur vise reklame i mobilappen?',
    status: 'success',
    label: 'Aktiv',
    period: '01.04.2020 – 01.01.2022',
    by: 'Entur',
  },
  {
    desc: 'Kan Entur sende deg tilbud og nyheter på e-post?',
    status: 'neutral',
    label: 'Kladd',
    period: '–',
    by: 'Entur',
  },
  {
    desc: 'Kan Kringom sende deg e-post med kvitteringer?',
    status: 'negative',
    label: 'Utløpt',
    period: '02.02.2020',
    by: 'Kringom',
  },
] as const;

const Consents = ({
  spacing,
}: {
  spacing?: 'default' | 'middle' | 'small';
}) => (
  <Table spacing={spacing}>
    <TableHead>
      <TableRow>
        <HeaderCell>Beskrivelse</HeaderCell>
        <HeaderCell>Status</HeaderCell>
        <HeaderCell>Publisering</HeaderCell>
        <HeaderCell>Opprettet av</HeaderCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {rows.map(r => (
        <TableRow key={r.desc}>
          <DataCell>{r.desc}</DataCell>
          <DataCell>
            <BulletBadge variant={r.status}>{r.label}</BulletBadge>
          </DataCell>
          <DataCell>{r.period}</DataCell>
          <DataCell>{r.by}</DataCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export const Default = () => <Consents />;
export const SpacingMiddle = () => <Consents spacing="middle" />;
export const SpacingSmall = () => <Consents spacing="small" />;
