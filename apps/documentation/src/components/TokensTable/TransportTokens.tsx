import React from 'react';
import { TransportTokenProps, FlattenedTokens } from './types';
import { VariableFormat } from '~/components/SettingsContext';
import { CopyableText } from '@entur/alert';
import {
  formatVariableByType,
  formatTokenValue,
  formatDotToVariable,
  sliceTokenKey,
} from '~/utils/formatVariable';
import { GridItem } from '@entur/grid';
import { Heading3, Heading5 } from '@entur/typography';
import { useSettings } from '../SettingsContext';
import { getTransportStyle } from '@entur/travel/src/utils';

type Props = {
  tokens: FlattenedTokens;
};

const TransportToken: React.FC<TransportTokenProps> = ({
  formattedVariable,
  value,
  copyValue,
}) => {
  const iconNameWords = formattedVariable.split('-');
  const { Icon } = getTransportStyle(iconNameWords[1]);

  return (
    <div className="token-table data-token">
      <div className="token-table-content__grid-item">
        <div className="token-table data-token__icon">
          <Icon color={value} />
        </div>
        <div className="token-table data-token__codetext">
          <CopyableText textToCopy={copyValue}>
            {sliceTokenKey(formattedVariable, 1)}
          </CopyableText>
          {formatTokenValue(value)}
        </div>
      </div>
    </div>
  );
};

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

    categories[categoryKey][subCategoryKey].push(
      <TransportToken
        key={formattedVariable}
        formattedVariable={formattedVariable}
        value={value}
        copyValue={copyValue}
      />,
    );

    return categories;
  }, {} as Record<string, any>);
};

const TransportTokenList: React.FC<Props> = ({ tokens }) => {
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
