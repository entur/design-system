import React from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  HeaderCell,
  DataCell,
} from '@entur/linje';

const departures = [
  { line: 'L1', to: 'Spikkestad', time: '10:04' },
  { line: 'R11', to: 'Skien', time: '10:08' },
  { line: 'L2', to: 'Stabekk', time: '10:15' },
];

export const Default = () => (
  <Table>
    <TableHead>
      <TableRow>
        <HeaderCell>Linje</HeaderCell>
        <HeaderCell>Destinasjon</HeaderCell>
        <HeaderCell>Avgang</HeaderCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {departures.map(d => (
        <TableRow key={d.line}>
          <DataCell>{d.line}</DataCell>
          <DataCell>{d.to}</DataCell>
          <DataCell>{d.time}</DataCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

const SortableTable = ({ order }: { order: 'ascending' | 'descending' }) => {
  const sortConfig = { key: 'time', order } as const;
  const rows = order === 'ascending' ? departures : [...departures].reverse();
  const btn = { onClick: () => undefined };
  return (
    <Table>
      <TableHead>
        <TableRow>
          <HeaderCell
            sortable
            name="line"
            sortConfig={sortConfig}
            sortableButtonProps={btn}
          >
            Linje
          </HeaderCell>
          <HeaderCell
            sortable
            name="to"
            sortConfig={sortConfig}
            sortableButtonProps={btn}
          >
            Destinasjon
          </HeaderCell>
          <HeaderCell
            sortable
            name="time"
            sortConfig={sortConfig}
            sortableButtonProps={btn}
          >
            Avgang
          </HeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map(d => (
          <TableRow key={d.line}>
            <DataCell>{d.line}</DataCell>
            <DataCell>{d.to}</DataCell>
            <DataCell>{d.time}</DataCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export const SortedAscending = () => <SortableTable order="ascending" />;
export const SortedDescending = () => <SortableTable order="descending" />;
