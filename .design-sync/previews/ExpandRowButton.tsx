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

const Row = ({
  pay,
  sum,
  initialOpen,
}: {
  pay: string;
  sum: string;
  initialOpen: boolean;
}) => {
  const [open, setOpen] = React.useState(initialOpen);
  return (
    <>
      <TableRow>
        <DataCell padding="radio">
          <ExpandRowButton open={open} onClick={() => setOpen(!open)} />
        </DataCell>
        <DataCell>{pay}</DataCell>
        <DataCell style={{ textAlign: 'right' }}>{sum},-</DataCell>
      </TableRow>
      <ExpandableRow colSpan={3} open={open}>
        <div
          style={{
            padding: 'var(--space-default) 0 var(--space-default) 4.75rem',
          }}
        >
          Ordre EN48123 · 08:25 · 3 331,-
        </div>
      </ExpandableRow>
    </>
  );
};

export const States = () => (
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
      <Row pay="Faktura" sum="20 487" initialOpen={false} />
      <Row pay="Kort" sum="4 487" initialOpen />
    </TableBody>
  </Table>
);
