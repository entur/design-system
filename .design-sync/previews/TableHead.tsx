import React from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  HeaderCell,
  DataCell,
} from '@entur/linje';

export const Default = () => (
  <Table>
    <TableHead>
      <TableRow>
        <HeaderCell>Navn</HeaderCell>
        <HeaderCell>Kassepunkt ID</HeaderCell>
        <HeaderCell>Salgssted</HeaderCell>
        <HeaderCell>Åpnet</HeaderCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <DataCell>Rolf Svendsen</DataCell>
        <DataCell>87374061</DataCell>
        <DataCell>Oslo S</DataCell>
        <DataCell>28.04.25</DataCell>
      </TableRow>
      <TableRow>
        <DataCell>Kari Nordmann</DataCell>
        <DataCell>66162613</DataCell>
        <DataCell>Entur admin</DataCell>
        <DataCell>12.10.25</DataCell>
      </TableRow>
    </TableBody>
  </Table>
);

export const WithCaption = () => (
  <Table>
    <caption
      style={{ textAlign: 'left', paddingBlockEnd: 'var(--space-default)' }}
    >
      Avganger fra Oslo S
    </caption>
    <TableHead>
      <TableRow>
        <HeaderCell>Linje</HeaderCell>
        <HeaderCell>Destinasjon</HeaderCell>
        <HeaderCell>Spor</HeaderCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <DataCell>R10</DataCell>
        <DataCell>Lillehammer</DataCell>
        <DataCell>13</DataCell>
      </TableRow>
    </TableBody>
  </Table>
);
