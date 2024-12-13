import React from 'react';
import * as allTokens from '@entur/tokens';
import { flatten } from '../../utils/flatten';
import { GridContainer } from '@entur/grid';
import { useSettings } from '@providers/SettingsContext';
import SemanticTokenList from './SemanticTokens';
import PrimitiveTokenList from './PrimitiveTokens';
import DataTokenList from './DataTokens';
import TransportTokenList from './TransportTokens';
import BaseTokenList from './BaseTokens';
import { CodeText } from '@entur/typography';
import { AllTokensTableProps, FlattenedTokens } from './types';

import './TokenTable.scss';

interface ExampleProps {
  value: string;
  className?: string;
}

export const TokensTableColor: React.FC<AllTokensTableProps> = ({
  tokenKey,
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
    case 'base':
      TokenListComponent = BaseTokenList;
      break;
    case 'transport':
      TokenListComponent = TransportTokenList;
  }

  const PrimitiveExample: React.FC<ExampleProps> = ({ value, className }) => (
    <div
      aria-hidden="true"
      className={`token-content__example ${className}`}
      style={{
        backgroundColor: value,
      }}
    />
  );

  return (
    <>
      <p>
        Du viser nå <CodeText>{variableFormat}</CodeText>, du kan endre format i
        innstillinger.
      </p>
      <GridContainer className="token-table__grid">
        <TokenListComponent
          tokens={flattenedTokens}
          PrimitiveExample={PrimitiveExample}
        />
      </GridContainer>
    </>
  );
};
