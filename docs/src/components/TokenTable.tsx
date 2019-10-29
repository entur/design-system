import React from 'react';
import { useToast } from '@entur/alert';
import * as allTokens from '@entur/tokens';
import {
  Table,
  TableRow,
  TableHead,
  TableBody,
  DataCell,
  HeaderCell,
} from '@entur/table';
import { CodeText } from '@entur/typography';
import { useFormatVariable } from 'src/utils/formatVariable';
import { flatten } from 'src/utils/flatten';
import { CopyButton } from './CopyButton';

type Props = {
  tokenKey: keyof typeof allTokens;
  renderExample?: (value: string) => React.ReactNode;
};

const formatValue = (value: string | number) => {
  if (typeof value === 'number') {
    return `${value}px (${value / 16}rem)`;
  }
  return value;
};

export const TokenTable: React.FC<Props> = ({ tokenKey, renderExample }) => {
  const flattenedTokens = React.useMemo(() => flatten(allTokens[tokenKey]), [
    tokenKey,
    allTokens,
  ]);
  const variableFormatter = useFormatVariable();

  return (
    <Table>
      <TableHead>
        <TableRow>
          <HeaderCell>Navn</HeaderCell>
          <HeaderCell>Verdi</HeaderCell>
          {renderExample && <HeaderCell>Eksempel</HeaderCell>}
          <HeaderCell>Kopier</HeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.entries(flattenedTokens).map(([key, value]) => (
          <TableRow key={key}>
            <DataCell>
              <CodeText>{variableFormatter(`${tokenKey}.${key}`)}</CodeText>
            </DataCell>
            <DataCell>
              <CodeText>{formatValue(value)}</CodeText>
            </DataCell>
            {renderExample && <DataCell>{renderExample(value)}</DataCell>}
            <DataCell>
              <CopyButton
                textToCopy={variableFormatter(`${tokenKey}.${key}`)}
              />
            </DataCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
