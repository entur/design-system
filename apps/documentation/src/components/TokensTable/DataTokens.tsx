import React from 'react';
import { TokensTableProps } from './types';
import {
  formatDotToVariable,
  formatVariableByType,
  sliceTokenKey,
} from '../../utils/formatVariable';
import { GridItem } from '@entur/grid';
import { Heading3, Heading4 } from '@entur/typography';
import { useSettings } from '@providers/SettingsContext';
import ColorToken from './ColorToken';

const DataTokenList: React.FC<TokensTableProps> = ({ tokens }) => {
  const { variableFormat } = useSettings();

  const formatTokens = Object.entries(tokens).map(([key, value]) => {
    const formattedVariable = formatDotToVariable(key);
    return [formattedVariable, value] as [string, string];
  });

  const categorizedTokens = formatTokens.reduce((categories, [key, value]) => {
    const formattedVariable = formatDotToVariable(key);
    const parts = formattedVariable.split('-');
    const mainCategory = parts[0];
    const subCategory = parts[1];

    if (!categories[mainCategory]) {
      categories[mainCategory] = [];
    }

    if (!categories[mainCategory][subCategory]) {
      categories[mainCategory][subCategory] = [];
    }

    const formatVariableBySettingsType = formatVariableByType(
      variableFormat,
      sliceTokenKey(formattedVariable, 1),
    );
    const copyValue = formatVariableBySettingsType;
    const showValue = sliceTokenKey(formattedVariable, 2);
    const iconCategory = 'chart';

    categories[mainCategory][subCategory].push(
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

  return (
    <>
      {Object.entries(categorizedTokens).map(([categoryKey, subCategories]) => (
        <React.Fragment key={categoryKey}>
          <Heading3>{categoryKey}</Heading3>
          {Object.entries(subCategories)
            .sort(([keyA], [keyB]) => {
              if (keyA === 'standard') return -1;
              if (keyB === 'standard') return 1;
              return keyA.localeCompare(keyB);
            })
            .map(([subCategoryKey, tokens]) => {
              const dataMode = categoryKey === 'dark' ? 'dark' : 'light';
              const bgColorClass =
                subCategoryKey === 'contrast' ? 'eds-contrast' : '';
              return (
                <React.Fragment key={subCategoryKey}>
                  <GridItem small={12} medium={12} large={12}>
                    <Heading4>{subCategoryKey}</Heading4>
                    <div
                      className={`token-table-content ${bgColorClass}`}
                      data-color-mode={dataMode}
                    >
                      <div className="token-table-content--multi-columns">
                        {tokens}
                      </div>
                    </div>
                  </GridItem>
                </React.Fragment>
              );
            })}
        </React.Fragment>
      ))}
    </>
  );
};

export default DataTokenList;
