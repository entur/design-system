import React from 'react';
import { TransportTokenProps, FlattenedTokens } from './types';

import { CopyableText } from '@entur/alert';
import {
  formatVariableByType,
  formatTokenValue,
  formatVariableNew,
  sliceTokenKey,
} from '~/utils/formatVariable';
import { GridItem } from '@entur/grid';
import { Heading3 } from '@entur/typography';
import { useSettings } from '../SettingsContext';

import { getTransportStyle } from '@entur/travel/src/utils';

type Props = {
  tokens: FlattenedTokens;
};

const TransportToken: React.FC<TransportTokenProps> = ({
  formattedVariable: variableName,
  value,
  copyValue,
}) => {
  const iconNameWords = variableName.split('-');
  const { Icon } = getTransportStyle(iconNameWords[1]);

  return (
    <div className="token-table data-token">
      <div className="token-table-content__grid-item">
        <div className="token-table data-token__icon">
          <Icon color={value} />
        </div>
        <div className="token-table data-token__codetext">
          <CopyableText textToCopy={copyValue}>
            {sliceTokenKey(variableName, 1)}
          </CopyableText>
          {formatTokenValue(value)}
        </div>
      </div>
    </div>
  );
};

const TransportTokenList: React.FC<Props> = ({ tokens }) => {
  const { variableFormat } = useSettings();

  const formatTokens = Object.entries(tokens).map(([key, value]) => {
    const formattedVariable = formatVariableNew(key);
    return [formattedVariable, value] as [string, string];
  });

  const categorizedItems = formatTokens.reduce((categories, [key, value]) => {
    const formattedVariable = formatVariableNew(key);
    const parts = formattedVariable.split('-');
    const mainCategory = parts[0];

    if (!categories[mainCategory]) {
      categories[mainCategory] = [];
    }

    const copyValue = formatVariableByType(variableFormat, formattedVariable);

    categories[mainCategory].push(
      <TransportToken
        key={formattedVariable}
        formattedVariable={formattedVariable}
        value={value}
        copyValue={copyValue}
      />,
    );

    return categories;
  }, {} as Record<string, any>);

  return (
    <>
      {Object.entries(categorizedItems).map(([categoryKey, tokens]) => (
        <React.Fragment key={categoryKey}>
          <GridItem small={12} medium={12} large={12} key={categoryKey}>
            <div className="token-table-content">
              <Heading3>{categoryKey}</Heading3>
              <div className="token-table-content--multi-columns">{tokens}</div>
            </div>
          </GridItem>
        </React.Fragment>
      ))}
    </>
  );
};

export default TransportTokenList;
