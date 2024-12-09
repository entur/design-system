import React from 'react';
import { Heading4, Heading3 } from '@entur/typography';
import { GridItem } from '@entur/grid';
import {
  formatDotToVariable,
  formatVariableByType,
  sliceTokenKey,
} from '../../utils/formatVariable';

import { TokensTableProps } from './types';
import ColorToken from './ColorToken';

const BaseTokenList: React.FC<TokensTableProps> = ({ tokens }) => {
  const formatTokens = Object.entries(tokens).map(([key, value]) => {
    const formattedVariable = formatDotToVariable(key);
    return [formattedVariable, value] as [string, string];
  });

  const categorizedTokens = formatTokens.reduce((categories, [key, value]) => {
    const formattedVariable = formatDotToVariable(key);
    const parts = formattedVariable.split('-');
    const mainCategory = parts[0];
    const subCategory = parts[2];

    if (!categories[mainCategory]) {
      categories[mainCategory] = {};
    }
    if (!categories[mainCategory][subCategory]) {
      categories[mainCategory][subCategory] = [];
    }

    const formatVariableBySettingsType = formatVariableByType(
      'css', // Base tokens are always CSS
      sliceTokenKey(formattedVariable, 1),
    );

    const copyValue = formatVariableBySettingsType;
    const showValue = sliceTokenKey(formattedVariable, 3);

    categories[mainCategory][subCategory].push(
      <ColorToken
        key={formattedVariable}
        iconCategory={subCategory}
        showValue={showValue}
        hexValue={value}
        copyValue={copyValue}
      />,
    );

    return categories;
  }, {} as Record<string, any>);

  return (
    <>
      {Object.entries(categorizedTokens).map(([categoryKey, subCategories]) => {
        const dataMode = categoryKey === 'dark' ? 'dark' : 'light';
        return (
          <React.Fragment key={categoryKey}>
            <Heading3>{categoryKey}</Heading3>
            {Object.entries(subCategories).map(([subCategoryKey, tokens]) => (
              <GridItem small={12} medium={12} large={12} key={subCategoryKey}>
                <Heading4>{subCategoryKey}</Heading4>
                <div className="token-table-content">
                  <div
                    className="token-table-content--multi-columns"
                    data-color-mode={dataMode}
                  >
                    {tokens}
                  </div>
                </div>
              </GridItem>
            ))}
          </React.Fragment>
        );
      })}
    </>
  );
};

export default BaseTokenList;
