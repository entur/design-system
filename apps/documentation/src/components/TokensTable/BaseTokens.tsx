import React, { useState } from 'react';
import { Heading4 } from '@entur/typography';
import { GridItem } from '@entur/grid';
import { SegmentedChoice, SegmentedControl } from '@entur/form';
import {
  formatDotToVariable,
  formatVariableByType,
  sliceTokenKey,
} from '../../utils/formatVariable';

import { TokensTableProps } from './types';
import ColorToken from './ColorToken';
import { useSettings } from '@providers/SettingsContext';

const BaseTokenList: React.FC<TokensTableProps> = ({ tokens }) => {
  const { variableFormat } = useSettings();
  const [colorMode, setColorMode] = useState<'light' | 'dark'>('light');

  const formatTokens = Object.entries(tokens).map(([key, value]) => {
    const formattedVariable = formatDotToVariable(key);
    return [formattedVariable, value, key] as [string, string, string];
  });

  const categorizedTokens = formatTokens
    .filter(([formattedVariable]) => {
      const mode = formattedVariable.split('-')[0];
      return mode === colorMode;
    })
    .reduce((categories, [formattedVariable, value, original]) => {
      const subCategory = formattedVariable.split('-')[2];

      if (!categories[subCategory]) {
        categories[subCategory] = [];
      }

      // Strip light/dark mode prefix — base CSS variables don't include the mode
      const cssFormattedVariable = sliceTokenKey(formattedVariable, 1);

      const formatVariableBySettingsType = formatVariableByType(
        variableFormat === 'js' ? 'js' : 'css',
        cssFormattedVariable,
        original,
        'base',
      );

      const copyValue = formatVariableBySettingsType;
      const showValue = sliceTokenKey(formattedVariable, 3);

      categories[subCategory].push(
        <ColorToken
          key={formattedVariable}
          iconCategory={subCategory}
          showValue={showValue}
          hexValue={value}
          copyValue={copyValue}
        />,
      );

      return categories;
    }, {} as Record<string, React.ReactElement[]>);

  return (
    <>
      <GridItem small={12} medium={12} large={12}>
        <SegmentedControl
          label="Fargemodus"
          selectedValue={colorMode}
          onChange={value => setColorMode(value as 'light' | 'dark')}
          style={{ width: '12rem' }}
        >
          <SegmentedChoice value="light">Standard</SegmentedChoice>
          <SegmentedChoice value="dark">Mørk</SegmentedChoice>
        </SegmentedControl>
      </GridItem>
      <div className="base-token-frame" data-color-mode={colorMode}>
        {Object.entries(categorizedTokens).map(([subCategoryKey, tokens]) => (
          <GridItem small={12} medium={12} large={12} key={subCategoryKey}>
            <Heading4>{subCategoryKey}</Heading4>
            <div className="token-table-content">
              <div className="token-table-content--multi-columns">{tokens}</div>
            </div>
          </GridItem>
        ))}
      </div>
    </>
  );
};

export default BaseTokenList;
