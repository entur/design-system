import React from 'react';
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
import { formatVariable } from '~/utils/formatVariable';
import { flatten } from '~/utils/flatten';
import { CopyButton } from './CopyButton';
import { useSettings } from './SettingsContext';

type Props = {
  tokenKey: keyof typeof allTokens;
  example?: React.ComponentType<{ value: string }>;
};

const formatValue = (value: string | number) => {
  if (typeof value === 'number') {
    return `${value}px (${value / 16}rem)`;
  }
  return value;
};

export const TokenTable: React.FC<Props> = ({ tokenKey, example: Example }) => {
  const flattenedTokens = React.useMemo(() => flatten(allTokens[tokenKey]), [
    tokenKey,
  ]);
  const { variableFormat } = useSettings();

  return (
    <Table>
      <TableHead>
        <TableRow>
          <HeaderCell>Navn</HeaderCell>
          <HeaderCell>Verdi</HeaderCell>
          {Example && <HeaderCell>Eksempel</HeaderCell>}
          <HeaderCell style={{ textAlign: 'right' }}>Kopier</HeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.entries(flattenedTokens).map(([key, value]) => (
          <TableRow key={key}>
            <DataCell>
              <CodeText>
                {formatVariable(`${tokenKey}.${key}`, variableFormat)}
              </CodeText>
            </DataCell>
            <DataCell>
              <CodeText>{formatValue(value)}</CodeText>
            </DataCell>
            {Example && (
              <DataCell>
                <Example value={value} />
              </DataCell>
            )}
            <DataCell style={{ textAlign: 'right' }}>
              <CopyButton
                textToCopy={formatVariable(
                  `${tokenKey}.${key}`,
                  variableFormat,
                )}
              />
            </DataCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
