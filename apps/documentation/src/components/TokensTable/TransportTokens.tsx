import React from 'react';
import { TokensTableProps } from './types';
import {
  formatVariableByType,
  formatDotToVariable,
  sliceTokenKey,
} from '~/utils/formatVariable';
import { GridItem } from '@entur/grid';
import { Heading3, Heading5 } from '@entur/typography';
import { useSettings, VariableFormat } from '~/utils/Providers/SettingsContext';
import ColorToken from './ColorToken';

const categorizedTokens = (
  tokens: [string, string][],
  variableFormat: VariableFormat,
): Record<string, any> => {
  return tokens.reduce((categories, [key, value]) => {
    const formattedVariable = formatDotToVariable(key);
    const categoryKey = formattedVariable.includes('standard')
      ? 'standard'
      : formattedVariable.includes('dark')
      ? 'dark'
      : 'contrast';
    const isTransparent = formattedVariable.includes('transparent');
    const subCategoryKey = isTransparent ? 'transparent' : 'standard';

    if (!categories[categoryKey]) {
      categories[categoryKey] = { standard: [], transparent: [] };
    }

    const copyValue = formatVariableByType(variableFormat, formattedVariable);
    const showValue = sliceTokenKey(formattedVariable, 1);
    const iconCategory = 'transport';
    categories[categoryKey][subCategoryKey].push(
      <ColorToken
        key={formattedVariable}
        iconCategory={iconCategory}
        showValue={showValue}
        hexValue={value}
        copyValue={copyValue}
      />,
    );

    return categories;
  }, {} as Record<string, any>);
};

const TransportTokenList: React.FC<TokensTableProps> = ({ tokens }) => {
  const { variableFormat } = useSettings();

  const formatTokens = Object.entries(tokens).map(([key, value]) => {
    const formattedVariable = formatDotToVariable(key);
    return [formattedVariable, value] as [string, string];
  });

  const categorizedItems = categorizedTokens(formatTokens, variableFormat);

  return (
    <>
      {Object.entries(categorizedItems)
        .sort(([keyA], [keyB]) => {
          if (keyA === 'standard') return -1;
          if (keyB === 'standard') return 1;
          return keyA.localeCompare(keyB);
        })
        .map(([categoryKey, subCategories]) => {
          const dataMode = categoryKey === 'dark' ? 'dark' : 'light';
          const bgColorClass = categoryKey === 'contrast' ? 'eds-contrast' : '';

          return (
            <React.Fragment key={categoryKey}>
              <Heading3>{categoryKey}</Heading3>
              {Object.entries(subCategories).map(([subCategoryKey, tokens]) => (
                <GridItem
                  small={12}
                  medium={12}
                  large={12}
                  key={subCategoryKey}
                >
                  {subCategoryKey === 'transparent' && (
                    <Heading5 as="h4">{subCategoryKey}</Heading5>
                  )}
                  <div
                    className={`token-table-content ${bgColorClass}`}
                    data-color-mode={dataMode}
                  >
                    <div className="token-table-content--multi-columns">
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

export default TransportTokenList;
