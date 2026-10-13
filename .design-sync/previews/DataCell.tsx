import React from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  HeaderCell,
  DataCell,
  Checkbox,
} from '@entur/linje';

export const Default = () => (
  <Table>
    <TableHead>
      <TableRow>
        <HeaderCell>Linje</HeaderCell>
        <HeaderCell>Fra</HeaderCell>
        <HeaderCell>Til</HeaderCell>
        <HeaderCell>Avgang</HeaderCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <DataCell>L1</DataCell>
        <DataCell>Oslo S</DataCell>
        <DataCell>Spikkestad</DataCell>
        <DataCell>10:04</DataCell>
      </TableRow>
      <TableRow>
        <DataCell>R10</DataCell>
        <DataCell>Oslo S</DataCell>
        <DataCell>Lillehammer</DataCell>
        <DataCell>10:12</DataCell>
      </TableRow>
    </TableBody>
  </Table>
);

const variants = [
  ['success', 'Publisert'],
  ['neutral', 'Kladd'],
  ['negative', 'Utløpt'],
  ['warning', 'Venter på godkjenning'],
  ['information', 'Planlagt'],
  ['primary', 'Aktiv'],
] as const;

export const Variants = () => (
  <Table>
    <TableHead>
      <TableRow>
        <HeaderCell>Billettype</HeaderCell>
        <HeaderCell>Status</HeaderCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {variants.map(([variant, label], i) => (
        <TableRow key={variant}>
          <DataCell>
            {
              [
                'Enkeltbillett',
                'Periodebillett',
                'Honnørbillett',
                'Studentbillett',
                'Sykkelbillett',
                'Nattbillett',
              ][i]
            }
          </DataCell>
          <DataCell variant={variant}>{label}</DataCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export const CheckboxPadding = () => (
  <Table>
    <TableHead>
      <TableRow>
        <HeaderCell padding="checkbox">
          <Checkbox aria-label="Velg alle avganger" />
        </HeaderCell>
        <HeaderCell>Stoppested</HeaderCell>
        <HeaderCell>Plattform</HeaderCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <DataCell padding="checkbox">
          <Checkbox aria-label="Velg Jernbanetorget" defaultChecked />
        </DataCell>
        <DataCell>Jernbanetorget</DataCell>
        <DataCell>A</DataCell>
      </TableRow>
      <TableRow>
        <DataCell padding="checkbox">
          <Checkbox aria-label="Velg Nationaltheatret" />
        </DataCell>
        <DataCell>Nationaltheatret</DataCell>
        <DataCell>C</DataCell>
      </TableRow>
    </TableBody>
  </Table>
);
