import React from 'react';
import { Heading4, Heading3 } from '@entur/typography';
import { GridItem } from '@entur/grid';
import {
  formatVariableNew,
  formatVariableByType,
  formatTokenValue,
  sliceTokenKey,
} from '~/utils/formatVariable';
import { SemanticTokenProps, FlattenedTokens } from './types';

import { useSettings } from '../SettingsContext';
import { CopyableText } from '@entur/alert';

import FillIcon from './icons/FillIcon';
import StrokeIcon from './icons/StrokeIcon';
import ShapeIcon from './icons/ShapeIcon';
import TextIcon from './icons/TextIcon';

const categoryIcons = {
  fill: FillIcon,
  text: TextIcon,
  stroke: StrokeIcon,
  shape: ShapeIcon,
};

type Props = {
  tokens: FlattenedTokens;
};

const SemanticToken: React.FC<SemanticTokenProps> = ({
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
            {category === 'fill'
              ? sliceTokenKey(formattedVariable, 2)
              : sliceTokenKey(formattedVariable, 1)}
          </CopyableText>
          {formatTokenValue(value)}
        </div>
      </div>
    </div>
  );
};

const SemanticTokenList: React.FC<Props> = ({ tokens }) => {
  const { variableFormat } = useSettings();

  const formatTokens = Object.entries(tokens).map(([key, value]) => {
    const formattedVariable = formatVariableNew(key);
    return [formattedVariable, value] as [string, string];
  });

  const categorizedItems = formatTokens.reduce((categories, [key, value]) => {
    const formattedVariable = formatVariableNew(key);
    const parts = formattedVariable.split('-');
    const mainCategory = parts[0];
    const subCategory = parts[1];

    if (!categories[mainCategory]) {
      categories[mainCategory] = {};
    }
    if (!categories[mainCategory][subCategory]) {
      categories[mainCategory][subCategory] = [];
    }

    const copyValue = formatVariableByType(variableFormat, formattedVariable);
    categories[mainCategory][subCategory].push(
      <SemanticToken
        key={formattedVariable}
        category={mainCategory}
        formattedVariable={formattedVariable}
        value={value}
        copyValue={copyValue}
      />,
    );
    return categories;
  }, {} as Record<string, any>);

  return (
    <div className="token-table-content">
      {Object.entries(categorizedItems).map(([categoryKey, subCategories]) => (
        <React.Fragment key={categoryKey}>
          <Heading3>{categoryKey}</Heading3>

          {categoryKey === 'fill' &&
            Object.entries(subCategories).map(([subCategoryKey, tokens]) => (
              <GridItem small={12} medium={12} large={12} key={subCategoryKey}>
                <Heading4>{subCategoryKey}</Heading4>
                <div className="token-table-content--multi-columns">
                  {tokens}
                </div>
              </GridItem>
            ))}

          {categoryKey !== 'fill' && (
            <GridItem small={12} medium={12} large={12}>
              <div className="token-table-content--multi-columns">
                {Object.values(subCategories).map((value, index) => (
                  <div key={index}>{value}</div>
                ))}
              </div>
            </GridItem>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default SemanticTokenList;
