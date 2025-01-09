import React from 'react';
import { Heading5 } from '@entur/typography';
import { GridItem } from '@entur/grid';
import {
  formatVariablePrimitive,
  formatVariableByType,
} from '../../utils/formatVariable';
import { TokensTableProps } from './types';
import { useSettings } from '@providers/SettingsContext';
import ColorToken from './ColorToken';

const PrimitiveTokenList: React.FC<TokensTableProps> = ({
  tokens,
  PrimitiveExample,
}) => {
  const { variableFormat } = useSettings();
  const dontShowCategory = ['white'];

  const formatAndSortTokens = Object.entries(tokens)
    .map(([key, value]) => {
      const formattedVariable = formatVariablePrimitive(key);
      return [formattedVariable, value] as [string, string];
    })
    .sort(([formattedKeyA], [formattedKeyB]) => {
      const numberA = parseInt(formattedKeyA.split('-')[1] || '0', 10);
      const numberB = parseInt(formattedKeyB.split('-')[1] || '0', 10);
      return numberB - numberA;
    });

  const categorizedTokens = formatAndSortTokens.reduce(
    (categories, [key, value]) => {
      const formattedVariable = formatVariablePrimitive(key);
      const parts = formattedVariable.split('-');
      const mainCategory = parts[0];

      if (!categories[mainCategory]) {
        categories[mainCategory] = [];
      }

      const copyValue = formatVariableByType(variableFormat, formattedVariable);
      categories[mainCategory].push(
        <ColorToken
          key={formattedVariable}
          showValue={formattedVariable}
          hexValue={value}
          copyValue={copyValue}
          PrimitiveExample={PrimitiveExample}
        />,
      );

      return categories;
    },
    {} as Record<string, any>,
  );

  return (
    <>
      {Object.entries(categorizedTokens)
        .filter(([categoryKey]) => !dontShowCategory.includes(categoryKey))
        .sort(([categoryKeyA], [categoryKeyB]) =>
          categoryKeyA === 'ebony'
            ? 1
            : categoryKeyB === 'ebony'
            ? -1
            : categoryKeyA.localeCompare(categoryKeyB),
        )
        .map(([categoryKey, tokens]) => (
          <GridItem small={12} medium={12} large={6} key={categoryKey}>
            <div className="token-table-content">
              <Heading5 as="h3">{categoryKey}</Heading5>
              {tokens}
            </div>
          </GridItem>
        ))}
    </>
  );
};

export default PrimitiveTokenList;
