import React from 'react';
import classNames from 'classnames';
import { GridContainer } from '@entur/grid';
import * as allTokens from '@entur/tokens';

import { flatten } from '../../utils/flatten';

import SemanticTokenList from './SemanticTokens';
import PrimitiveTokenList from './PrimitiveTokens';
import PrimitiveSizeTokenList from './PrimitiveSizeTokens';
import DataTokenList from './DataTokens';
import TransportTokenList from './TransportTokens';
import BaseTokenList from './BaseTokens';
import { AllTokensTableProps, FlattenedTokens } from './types';

import './TokenTable.scss';

interface ExampleProps {
  value: string;
  className?: string;
}

export const TokenTable: React.FC<AllTokensTableProps> = ({ tokenKey }) => {
  // For primitiveSize, we need to use the primitive tokens but filter for size tokens
  const actualTokenKey = tokenKey === 'primitiveSize' ? 'primitive' : tokenKey;

  const flattenedTokens = React.useMemo<FlattenedTokens>(
    () => flatten(allTokens[actualTokenKey]),
    [actualTokenKey],
  );

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
    case 'primitiveSize':
      TokenListComponent = PrimitiveSizeTokenList;
      break;
    case 'base':
      TokenListComponent = BaseTokenList;
      break;
    case 'transport':
      TokenListComponent = TransportTokenList;
      break;
  }

  const PrimitiveExample: React.FC<ExampleProps> = ({ value, className }) => (
    <div
      aria-hidden="true"
      className={classNames('token-content__example', className)}
      style={{
        backgroundColor: value,
      }}
    />
  );

  return (
    <GridContainer className="token-table__grid">
      <TokenListComponent
        tokens={flattenedTokens}
        PrimitiveExample={PrimitiveExample}
      />
    </GridContainer>
  );
};
