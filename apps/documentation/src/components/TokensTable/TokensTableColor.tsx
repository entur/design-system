import React from 'react';
import * as allTokens from '@entur/tokens';
//import { primitive, semantic, data, transport } from '@entur/tokens';
import { flatten } from '~/utils/flatten';
import { GridContainer } from '@entur/grid';
import { useSettings } from '../SettingsContext';
import SemanticTokenList from './SemanticTokens';
import PrimitiveTokenList from './PrimitiveTokens';
import DataTokenList from './DataTokens';
import TransportTokenList from './TransportTokens';
import { CodeText } from '@entur/typography';
import { Props, FlattenedTokens } from './types';

import './TokenTable.scss';

export const TokensTableColor: React.FC<Props> = ({
  tokenKey,
  example: Example,
}) => {
  const flattenedTokens = React.useMemo<FlattenedTokens>(
    () => flatten(allTokens[tokenKey]),
    [tokenKey],
  );
  const { variableFormat } = useSettings();

  let TokenListComponent: React.ComponentType<any> = PrimitiveTokenList; // Initialize with a default value

  switch (tokenKey) {
    case 'semantic':
      TokenListComponent = SemanticTokenList;
      break;
    case 'data':
      TokenListComponent = DataTokenList;
      break;
    case 'primitive':
      TokenListComponent = PrimitiveTokenList;
      break;
    case 'transport':
      TokenListComponent = TransportTokenList;
      break;
  }

  return (
    <>
      <p>
        Du viser nå <CodeText>{variableFormat}</CodeText>, du kan endre format i
        innstillinger.
      </p>
      <GridContainer className="token-table__grid">
        <TokenListComponent tokens={flattenedTokens} Example={Example} />
      </GridContainer>
    </>
  );
};
