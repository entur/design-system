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

/** The palette hues are chart fills; the rest are the parts drawn on top of them. */
const getIconCategory = (showValue: string) => {
  if (showValue.startsWith('text')) return 'text';
  if (showValue.startsWith('stroke')) return 'stroke';
  if (showValue.startsWith('icon')) return 'shape';
  return 'chart';
};

const DataTokenList: React.FC<TokensTableProps> = ({ tokens }) => {
  const { variableFormat } = useSettings();

  const formatTokens = Object.entries(tokens).map(([key, value]) => {
    const formattedVariable = formatDotToVariable(key);
    return [formattedVariable, value, key] as [string, string, string];
  });

  const categorizedTokens = formatTokens.reduce(
    (categories, [formattedVariable, value, original]) => {
      const parts = formattedVariable.split('-');
      const mainCategory = parts[0];
      const subCategory = parts[1];

      if (!categories[mainCategory]) {
        categories[mainCategory] = [];
      }

      if (!categories[mainCategory][subCategory]) {
        categories[mainCategory][subCategory] = [];
      }

      // Data tokens are mode-dependent, so they only exist as CSS variables —
      // there is no SCSS or LESS variable to copy.
      const copyValue = formatVariableByType(
        variableFormat === 'js' ? 'js' : 'css',
        sliceTokenKey(formattedVariable, 1),
        original,
        'data',
      );
      const showValue = sliceTokenKey(formattedVariable, 2);
      const iconCategory = getIconCategory(showValue);

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
    },
    {} as Record<string, any>,
  );

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
