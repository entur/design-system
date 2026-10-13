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
        <HeaderCell>Stoppested</HeaderCell>
        <HeaderCell>Kommune</HeaderCell>
        <HeaderCell>Transportmiddel</HeaderCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <DataCell>Oslo S</DataCell>
        <DataCell>Oslo</DataCell>
        <DataCell>Tog, buss, trikk</DataCell>
      </TableRow>
      <TableRow>
        <DataCell>Bergen busstasjon</DataCell>
        <DataCell>Bergen</DataCell>
        <DataCell>Buss</DataCell>
      </TableRow>
      <TableRow>
        <DataCell>Trondheim S</DataCell>
        <DataCell>Trondheim</DataCell>
        <DataCell>Tog, buss</DataCell>
      </TableRow>
    </TableBody>
  </Table>
);

export const TopAligned = () => (
  <Table>
    <TableHead>
      <TableRow>
        <HeaderCell>Beskrivelse</HeaderCell>
        <HeaderCell>Publisering</HeaderCell>
      </TableRow>
    </TableHead>
    <TableBody style={{ verticalAlign: 'top' }}>
      <TableRow>
        <DataCell>
          Innstilte avganger på Gjøvikbanen
          <br />
          grunnet sporarbeid
        </DataCell>
        <DataCell>12.05.2025</DataCell>
      </TableRow>
      <TableRow>
        <DataCell>Buss for tog mellom Drammen og Kongsberg</DataCell>
        <DataCell>
          01.06.2025 –<br />
          15.06.2025
        </DataCell>
      </TableRow>
    </TableBody>
  </Table>
);
