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
import { formatVariable, formatTokenValue } from '../../utils/formatVariable';
import { flatten } from '../../utils/flatten';
import { CopyButton } from '../CopyButton';
import { useSettings } from '../../providers/SettingsContext';

import { AllTokensTableProps } from './types';

export const TokenTable: React.FC<AllTokensTableProps> = ({
  tokenKey,
  example: Example,
}) => {
  const flattenedTokens = React.useMemo(
    () => flatten(allTokens[tokenKey]),
    [tokenKey],
  );
  const { variableFormat } = useSettings();
  // Outlier, should not be treated as rem/px value
  const isZIndex = tokenKey.startsWith('zIndex');
  return (
    <Table>
      <TableHead>
        <TableRow>
          <HeaderCell>Navn</HeaderCell>
          <HeaderCell>Verdi</HeaderCell>
          {Example && <HeaderCell aria-hidden="true">Eksempel</HeaderCell>}
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.entries(flattenedTokens)
          .filter(obj => !obj[0].includes('rem.')) // Exclude duplicate rem value from list
          .map(([key, value]) => (
            <TableRow key={key}>
              <DataCell>
                <CopyButton
                  textToCopy={formatVariable(
                    `${tokenKey}.${key}`,
                    variableFormat,
                  )}
                >
                  {formatVariable(`${tokenKey}.${key}`, variableFormat)}
                </CopyButton>
              </DataCell>
              <DataCell>
                <CodeText>
                  {!isZIndex ? formatTokenValue(value) : value}
                </CodeText>
              </DataCell>
              {Example && (
                <DataCell aria-hidden="true">
                  <Example value={value} />
                </DataCell>
              )}
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};
