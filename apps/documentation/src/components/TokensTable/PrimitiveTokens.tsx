import React from 'react';
import { Heading5 } from '@entur/typography';
import { GridItem } from '@entur/grid';

import {
  formatVariablePrimitive,
  formatVariableByType,
  formatTokenValue,
} from '~/utils/formatVariable';
import { PrimitiveTokenProps, FlattenedTokens } from './types';
import { CopyableText } from '@entur/alert';
import { useSettings } from '../SettingsContext';

type Props = {
  tokens: FlattenedTokens;
  Example?: React.ComponentType<{ value: string; className?: string }>;
};

const PrimitiveToken: React.FC<PrimitiveTokenProps> = ({
  formattedVariable,
  value,
  copyValue,
  className,
  Example,
}) => (
  <div className="token-table">
    <div className="token-table-content__grid-item">
      {Example && <Example className={className} value={value} />}
      <div className="token-table-content__codetext">
        {formatTokenValue(value)}
      </div>
      <CopyableText textToCopy={copyValue}>{formattedVariable}</CopyableText>
    </div>
  </div>
);

const PrimitiveTokenList: React.FC<Props> = ({ tokens, Example }) => {
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
        <PrimitiveToken
          key={formattedVariable}
          formattedVariable={formattedVariable}
          value={value}
          copyValue={copyValue}
          Example={Example}
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
