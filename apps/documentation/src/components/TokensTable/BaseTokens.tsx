import React from 'react';
import { Heading4, Heading3 } from '@entur/typography';
import { GridItem } from '@entur/grid';
import {
  formatDotToVariable,
  formatVariableByType,
  formatTokenValue,
  sliceTokenKey,
} from '~/utils/formatVariable';
import { SemanticTokenProps, FlattenedTokens } from './types';
import { CopyableText } from '@entur/alert';

import FillIcon from './icons/FillIcon';
import StrokeIcon from './icons/StrokeIcon';
import ShapeIcon from './icons/ShapeIcon';
import TextIcon from './icons/TextIcon';

const categoryIcons = {
  frame: FillIcon,
  text: TextIcon,
  stroke: StrokeIcon,
  shape: ShapeIcon,
};

type Props = {
  tokens: FlattenedTokens;
};

const BaseToken: React.FC<SemanticTokenProps> = ({
  category,
  formattedVariable,
  value,
  copyValue,
}) => {
  const IconComponent = categoryIcons[category as keyof typeof categoryIcons];

  return (
    <div className="token-table semantic-token">
      <div className="token-table-content__grid-item">
        <div className="token-table semantic-token__icon" id={category}>
          <IconComponent color={value} />
        </div>
        <div className="token-table semantic-token__codetext">
          <CopyableText textToCopy={copyValue}>
            {sliceTokenKey(formattedVariable, 3)}
          </CopyableText>
          {formatTokenValue(value)}
        </div>
      </div>
    </div>
  );
};

const BaseTokenList: React.FC<Props> = ({ tokens }) => {
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
    categories[mainCategory][subCategory].push(
      <BaseToken
        key={formattedVariable}
        category={subCategory}
        formattedVariable={formattedVariable}
        value={value}
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
