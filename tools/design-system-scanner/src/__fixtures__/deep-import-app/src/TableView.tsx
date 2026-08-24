import React from 'react';
import { Table, TableRow, DataCell } from '@entur/table';
import { Sidebar } from '@entur/layout/beta';

export const TableView: React.FC = () => (
  <Sidebar>
    <Table>
      <TableRow>
        <DataCell>Oslo S</DataCell>
      </TableRow>
    </Table>
  </Sidebar>
);
