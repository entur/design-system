import React from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  HeaderCell,
  DataCell,
  EditableCell,
  TextField,
} from '@entur/linje';

const Head = () => (
  <TableHead>
    <TableRow>
      <HeaderCell>Fornavn</HeaderCell>
      <HeaderCell>Etternavn</HeaderCell>
      <HeaderCell>Kundenummer</HeaderCell>
    </TableRow>
  </TableHead>
);

export const Default = () => (
  <Table>
    <Head />
    <TableBody>
      <TableRow hover>
        <EditableCell>
          <TextField aria-label="Fornavn" defaultValue="Kari" />
        </EditableCell>
        <EditableCell>
          <TextField aria-label="Etternavn" defaultValue="Nordmann" />
        </EditableCell>
        <DataCell>66162613</DataCell>
      </TableRow>
      <TableRow hover>
        <EditableCell>
          <TextField aria-label="Fornavn" defaultValue="Ola" />
        </EditableCell>
        <EditableCell>
          <TextField aria-label="Etternavn" defaultValue="Hansen" />
        </EditableCell>
        <DataCell>87374061</DataCell>
      </TableRow>
    </TableBody>
  </Table>
);

export const Outlined = () => (
  <Table>
    <Head />
    <TableBody>
      <TableRow>
        <EditableCell outlined>
          <TextField aria-label="Fornavn" defaultValue="Kari" />
        </EditableCell>
        <EditableCell outlined>
          <TextField aria-label="Etternavn" placeholder="Skriv etternavn" />
        </EditableCell>
        <DataCell>66162613</DataCell>
      </TableRow>
    </TableBody>
  </Table>
);

export const Feedback = () => (
  <Table>
    <Head />
    <TableBody>
      <TableRow>
        <EditableCell variant="negative" feedback="Fornavn mangler">
          <TextField aria-label="Fornavn" />
        </EditableCell>
        <EditableCell variant="success">
          <TextField aria-label="Etternavn" defaultValue="Nordmann" />
        </EditableCell>
        <DataCell>66162613</DataCell>
      </TableRow>
    </TableBody>
  </Table>
);
