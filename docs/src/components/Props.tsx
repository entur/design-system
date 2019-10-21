import React from 'react';
import { PropsComponentProps } from 'docz';
import { CodeText, Heading4 } from '@entur/typography';
import { CheckIcon } from '@entur/icons';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  HeaderCell,
  DataCell,
} from '@entur/table';
import { useSettings } from './SettingsContext';

function skipUndefinedType(type: string) {
  return type.replace(/\| undefined/g, '');
}

type PropsProps = PropsComponentProps & {
  defaultOpen?: boolean;
};

const Props: React.FC<PropsProps> = ({
  title = 'Props',
  props,
  defaultOpen,
}) => {
  const { userType } = useSettings();
  const hasAnyDefaultValues = Object.values(props).some(
    details => details.defaultValue,
  );
  const isDefaultOpenSet = defaultOpen === undefined;
  return (
    <details open={isDefaultOpenSet ? defaultOpen : userType === 'developer'}>
      <summary>
        <Heading4 as="div" style={{ display: 'inline-block' }}>
          {title}
        </Heading4>
      </summary>
      <Table fixed={true}>
        <TableHead>
          <TableRow>
            <HeaderCell>Navn</HeaderCell>
            <HeaderCell>Type</HeaderCell>
            <HeaderCell>Påkrevd?</HeaderCell>
            {hasAnyDefaultValues && <HeaderCell>Default-verdi</HeaderCell>}
            <HeaderCell>Beskrivelse</HeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(props).map(([propName, details]) => (
            <TableRow key={propName}>
              <DataCell>
                <CodeText>{propName}</CodeText>
              </DataCell>
              <DataCell>
                <CodeText>{skipUndefinedType(details.type.name)}</CodeText>
              </DataCell>
              <DataCell>{details.required && <CheckIcon />}</DataCell>
              {hasAnyDefaultValues && (
                <DataCell>
                  {details.defaultValue ? (
                    <CodeText>{String(details.defaultValue.value)}</CodeText>
                  ) : null}
                </DataCell>
              )}
              <DataCell>{details.description}</DataCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </details>
  );
};

export default Props;
