import React from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  HeaderCell,
  DataCell,
} from '@entur/linje';

const Head = () => (
  <TableHead>
    <TableRow>
      <HeaderCell>Ordrenummer</HeaderCell>
      <HeaderCell>Billett</HeaderCell>
      <HeaderCell>Pris</HeaderCell>
    </TableRow>
  </TableHead>
);

export const Default = () => (
  <Table>
    <Head />
    <TableBody>
      <TableRow>
        <DataCell>EN48123</DataCell>
        <DataCell>Enkeltbillett, sone 1</DataCell>
        <DataCell>44,-</DataCell>
      </TableRow>
      <TableRow>
        <DataCell>EN48159</DataCell>
        <DataCell>30-dagersbillett</DataCell>
        <DataCell>899,-</DataCell>
      </TableRow>
    </TableBody>
  </Table>
);

export const States = () => (
  <Table>
    <Head />
    <TableBody>
      <TableRow hover>
        <DataCell>EN48123</DataCell>
        <DataCell>Enkeltbillett, sone 1</DataCell>
        <DataCell>44,-</DataCell>
      </TableRow>
      <TableRow active>
        <DataCell>EN48159</DataCell>
        <DataCell>Valgt: 30-dagersbillett</DataCell>
        <DataCell>899,-</DataCell>
      </TableRow>
      <TableRow error>
        <DataCell>EN48053</DataCell>
        <DataCell>Betaling feilet</DataCell>
        <DataCell>331,-</DataCell>
      </TableRow>
    </TableBody>
  </Table>
);
