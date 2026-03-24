import React from 'react';
import { GridItem } from '@entur/grid';
import { CopyableText } from '@entur/alert';
import BaseCardDesignEntur from '@components/Cards/BaseCardDesignEntur';
import { useSettings } from '@providers/SettingsContext';
import {
  formatVariableByType,
  formatVariablePrimitive,
} from '../../utils/formatVariable';
import { TokensTableProps } from './types';

type SizeTokenProps = {
  showValue: string;
  sizeValue: string;
  copyValue: string;
  pixelValue: number;
};

const SizeToken: React.FC<SizeTokenProps> = ({
  showValue,
  sizeValue,
  copyValue,
  pixelValue,
}) => {
  return (
    <BaseCardDesignEntur className="primitive-size-token-card">
      <div className="primitive-size-token__header">
        <div className="primitive-size-token__name">{showValue}</div>

        <CopyableText className="primitive-size-token__copy-button">
          {copyValue}
        </CopyableText>
      </div>

      <div className="primitive-size-token__visual">
        <div
          className="primitive-size-token__visual-leg"
          style={{ width: sizeValue }}
        />
        <div className="primitive-size-token__meta">
          <span className="primitive-size-token__meta__value">{sizeValue}</span>
          <span className="primitive-size-token__meta__separator">•</span>
          <span className="primitive-size-token__meta__px">{pixelValue}px</span>
        </div>
      </div>
    </BaseCardDesignEntur>
  );
};

const PrimitiveSizeTokenList: React.FC<TokensTableProps> = ({ tokens }) => {
  const { variableFormat } = useSettings();

  const formatAndSortTokens = Object.entries(tokens)
    .filter(([key]) => key.startsWith('size')) // Only include size tokens
    .map(([key, value]) => {
      // Start from generic primitive formatting
      let formattedVariable = formatVariablePrimitive(key);

      // Size tokens are named size0, size1, ..., but CSS vars are --size-0, --size-1, ...
      const sizeMatch = key.match(/^size(\d+)$/);
      if (sizeMatch) {
        formattedVariable = `size-${sizeMatch[1]}`;
      }

      return [formattedVariable, value, key] as [string, string, string];
    })
    .sort(([, , keyA], [, , keyB]) => {
      // Sort by the numeric part of the size token (size0, size1, size2, etc.)
      const numberA = parseInt(keyA.replace('size', ''), 10);
      const numberB = parseInt(keyB.replace('size', ''), 10);
      return numberA - numberB;
    });

  if (formatAndSortTokens.length === 0) {
    return null; // No size tokens to display
  }

  // Convert rem values to pixels for display (assuming 1rem = 16px)
  const getPixelValue = (value: string) => {
    if (value.includes('rem')) {
      const remValue = parseFloat(value.replace('rem', ''));
      return Math.round(remValue * 16);
    }
    return parseInt(value) || 0;
  };

  return (
    <GridItem small={12} medium={12} large={12}>
      <div className="token-table-content">
        <div className="primitive-size-token-grid">
          {formatAndSortTokens.map(([formattedVariable, value, original]) => {
            const pixelValue = getPixelValue(value);
            const copyValue = formatVariableByType(
              variableFormat,
              formattedVariable,
              original,
              'primitive',
            );

            return (
              <SizeToken
                key={formattedVariable}
                showValue={formattedVariable}
                sizeValue={value}
                copyValue={copyValue}
                pixelValue={pixelValue}
              />
            );
          })}
        </div>
      </div>
    </GridItem>
  );
};

export default PrimitiveSizeTokenList;
