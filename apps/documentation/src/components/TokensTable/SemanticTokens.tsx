import React from 'react';
import { Heading } from '@entur/typography/beta';
import { GridItem } from '@entur/grid';
import {
  formatDotToVariable,
  formatVariableByType,
  sliceTokenKey,
} from '../../utils/formatVariable';
import { TokensTableProps } from './types';
import { useSettings } from '@providers/SettingsContext';
import ColorToken from './ColorToken';

const SemanticTokenList: React.FC<TokensTableProps> = ({ tokens }) => {
  const { variableFormat } = useSettings();
  const formatTokens = Object.entries(tokens).map(([key, token]) => {
    const formattedVariable = formatDotToVariable(key);
    return [formattedVariable, token, key] as [string, string, string];
  });

  const categorizedTokens = formatTokens.reduce(
    (categories, [key, token, original]) => {
      const formattedVariable = formatDotToVariable(key);
      const parts = formattedVariable.split('-');
      const mainCategory = parts[0];
      const subCategory = parts[1];

      if (!categories[mainCategory]) {
        categories[mainCategory] = {};
      }
      if (!categories[mainCategory][subCategory]) {
        categories[mainCategory][subCategory] = [];
      }

      const copyValue = formatVariableByType(
        variableFormat,
        formattedVariable,
        original,
      );
      const showValue =
        mainCategory === 'fill'
          ? sliceTokenKey(formattedVariable, 2)
          : sliceTokenKey(formattedVariable, 1);

      categories[mainCategory][subCategory].push(
        <ColorToken
          key={formattedVariable}
          iconCategory={mainCategory}
          showValue={showValue}
          hexValue={token}
          copyValue={copyValue}
        />,
      );
      return categories;
    },
    {} as Record<string, any>,
  );

  return (
    <>
      {Object.entries(categorizedTokens).map(([categoryKey, subCategories]) => (
        <React.Fragment key={categoryKey}>
          <Heading as="h3" variant="subtitle-1">
            {categoryKey}
          </Heading>

          {categoryKey === 'fill' &&
            Object.entries(subCategories).map(([subCategoryKey, tokens]) => (
              <GridItem small={12} medium={12} large={12} key={subCategoryKey}>
                <Heading as="h4" variant="subtitle-2">
                  {subCategoryKey}
                </Heading>
                <div className="token-table-content">
                  <div className="token-table-content--multi-columns">
                    {tokens}
                  </div>
                </div>
              </GridItem>
            ))}

          {categoryKey !== 'fill' && (
            <GridItem small={12} medium={12} large={12}>
              <div className="token-table-content">
                <div className="token-table-content--multi-columns">
                  {Object.values(subCategories).map(token => (
                    <div key={subCategories}>{token}</div>
                  ))}
                </div>
              </div>
            </GridItem>
          )}
        </React.Fragment>
      ))}
    </>
  );
};

export default SemanticTokenList;
