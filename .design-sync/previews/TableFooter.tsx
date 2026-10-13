import React from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableFooter,
  TableRow,
  HeaderCell,
  DataCell,
} from '@entur/linje';

const sales = [
  { pay: 'Faktura', count: 6, sum: '20 487' },
  { pay: 'Kort', count: 4, sum: '4 487' },
  { pay: 'Kontant', count: 3, sum: '13 487' },
];

export const Default = () => (
  <Table>
    <TableHead>
      <TableRow>
        <HeaderCell>Betalingsmåte</HeaderCell>
        <HeaderCell>Antall salg</HeaderCell>
        <HeaderCell style={{ textAlign: 'right' }}>Salgssum</HeaderCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {sales.map(s => (
        <TableRow key={s.pay}>
          <DataCell>{s.pay}</DataCell>
          <DataCell>{s.count}</DataCell>
          <DataCell style={{ textAlign: 'right' }}>{s.sum},-</DataCell>
        </TableRow>
      ))}
    </TableBody>
    <TableFooter>
      <TableRow>
        <DataCell>
          <strong>Totalt</strong>
        </DataCell>
        <DataCell>
          <strong>13</strong>
        </DataCell>
        <DataCell style={{ textAlign: 'right' }}>
          <strong>38 461,-</strong>
        </DataCell>
      </TableRow>
    </TableFooter>
  </Table>
);
