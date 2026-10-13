import React from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  HeaderCell,
  DataCell,
  ExpandRowButton,
  ExpandableRow,
} from '@entur/linje';

const data = [
  {
    pay: 'Faktura',
    sum: '20 487',
    transactions: [
      { time: '08:25', id: 'EN48123', sum: '3 331' },
      { time: '11:37', id: 'EN48159', sum: '6 368' },
      { time: '14:12', id: 'EN48053', sum: '1 331' },
    ],
  },
  {
    pay: 'Kort',
    sum: '4 487',
    transactions: [
      { time: '21:50', id: 'EN41123', sum: '931' },
      { time: '11:55', id: 'EN48239', sum: '1 681' },
    ],
  },
];

const Summary = ({ rows }: { rows: (typeof data)[number]['transactions'] }) => (
  <div style={{ paddingTop: 'var(--space-small)' }}>
    <Table spacing="middle">
      <TableHead>
        <TableRow>
          <HeaderCell style={{ paddingLeft: '4.5rem' }}>Tidspunkt</HeaderCell>
          <HeaderCell>Ordrenummer</HeaderCell>
          <HeaderCell style={{ textAlign: 'right', paddingRight: '1.5rem' }}>
            Pris
          </HeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map(r => (
          <TableRow key={r.id}>
            <DataCell style={{ paddingLeft: '4.5rem' }}>{r.time}</DataCell>
            <DataCell>{r.id}</DataCell>
            <DataCell style={{ textAlign: 'right', paddingRight: '1.5rem' }}>
              {r.sum},-
            </DataCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

const Row = ({
  item,
  initialOpen,
}: {
  item: (typeof data)[number];
  initialOpen: boolean;
}) => {
  const [open, setOpen] = React.useState(initialOpen);
  return (
    <>
      <TableRow>
        <DataCell padding="radio">
          <ExpandRowButton open={open} onClick={() => setOpen(!open)} />
        </DataCell>
        <DataCell>
          {item.pay} ({item.transactions.length})
        </DataCell>
        <DataCell style={{ textAlign: 'right' }}>{item.sum},-</DataCell>
      </TableRow>
      <ExpandableRow colSpan={3} open={open}>
        <Summary rows={item.transactions} />
      </ExpandableRow>
    </>
  );
};

const Sales = ({ openFirst }: { openFirst: boolean }) => (
  <Table>
    <TableHead>
      <TableRow>
        <HeaderCell padding="radio" aria-label="Utvid">
          {''}
        </HeaderCell>
        <HeaderCell>Betalingsmåte</HeaderCell>
        <HeaderCell style={{ textAlign: 'right' }}>Salgssum</HeaderCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {data.map((item, i) => (
        <Row key={item.pay} item={item} initialOpen={openFirst && i === 0} />
      ))}
    </TableBody>
  </Table>
);

export const Open = () => <Sales openFirst />;
export const Closed = () => <Sales openFirst={false} />;
