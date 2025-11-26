import React from 'react';
import classNames from 'classnames';
import { GridContainer } from '@entur/grid';
import * as allTokens from '@entur/tokens';
import { CodeText, Heading3 } from '@entur/typography';
import { useSettings } from '@providers/SettingsContext';

import { flatten } from '../../utils/flatten';

import SemanticTokenList from './SemanticTokens';
import PrimitiveTokenList from './PrimitiveTokens';
import PrimitiveSizeTokenList from './PrimitiveSizeTokens';
import DataTokenList from './DataTokens';
import TransportTokenList from './TransportTokens';
import BaseTokenList from './BaseTokens';
import { AllTokensTableProps, FlattenedTokens } from './types';

import { OverflowMenu, OverflowMenuItem } from '@entur/menu';
import { CopyableText, SmallAlertBox } from '@entur/alert';
import { space } from '@entur/tokens';

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
  const { variableFormat, setVariableFormat } = useSettings();

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

  const formatInfoText = React.useMemo(() => {
    if (
      tokenKey === 'base' ||
      tokenKey === 'componentVariables' ||
      tokenKey === 'componentColors'
    ) {
      return (
        <p>
          For å støtte flere fargemoduser er base kun tilgjengelig i{' '}
          <CodeText>css</CodeText>.
        </p>
      );
    }

    return (
      <div>
        Du viser nå{' '}
        <OverflowMenu
          className="token-table__format-menu"
          button={
            <span className="token-table__format-menu-button">
              <CodeText>{variableFormat}</CodeText>
            </span>
          }
        >
          <OverflowMenuItem onClick={() => setVariableFormat('css')}>
            CSS
          </OverflowMenuItem>
          <OverflowMenuItem onClick={() => setVariableFormat('scss')}>
            SCSS
          </OverflowMenuItem>
          <OverflowMenuItem onClick={() => setVariableFormat('less')}>
            LESS
          </OverflowMenuItem>
          <OverflowMenuItem onClick={() => setVariableFormat('js')}>
            JS
          </OverflowMenuItem>
        </OverflowMenu>
        , du kan endre format i innstillinger.
      </div>
    );
  }, [tokenKey, variableFormat, setVariableFormat]);

  const importInstructions = React.useMemo(() => {
    if (tokenKey !== 'primitiveSize') {
      return null;
    }

    const getImportText = () => {
      switch (variableFormat) {
        case 'js':
          return "import { primitive } from '@entur/tokens'";
        case 'scss':
          return '@use "@entur/tokens/dist/primitive.scss" as *';
        case 'css':
          return '@import "@entur/tokens/dist/primitive.css"';
        case 'less':
          return '@import "@entur/tokens/dist/primitive.less"';
        default:
          return '';
      }
    };

    return (
      <div style={{ marginTop: space.large }}>
        For å bruke <CodeText>primitiveSize</CodeText> tokens importer du dem
        slik:{' '}
        <CopyableText style={{ width: 'fit-content', marginTop: space.small }}>
          {getImportText()}
        </CopyableText>
      </div>
    );
  }, [tokenKey, variableFormat]);

  return (
    <>
      <SmallAlertBox variant="information">{formatInfoText}</SmallAlertBox>
      <Heading3>Bruk</Heading3>
      {importInstructions}

      <Heading3>Liste</Heading3>
      <GridContainer className="token-table__grid">
        <TokenListComponent
          tokens={flattenedTokens}
          PrimitiveExample={PrimitiveExample}
        />
      </GridContainer>
    </>
  );
};
