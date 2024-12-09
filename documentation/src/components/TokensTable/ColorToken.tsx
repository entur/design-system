import React from 'react';
import { formatTokenValue } from '../../utils/formatVariable';
import { TokenProps } from './types';
import { CopyableText } from '@entur/alert';
import { getTransportStyle } from '@entur/travel/src/utils';

import FillIcon from './icons/FillIcon';
import StrokeIcon from './icons/StrokeIcon';
import ShapeIcon from './icons/ShapeIcon';
import TextIcon from './icons/TextIcon';
import { ChartFilledIcon } from '@entur/icons';

const categoryIcons = {
  chart: ChartFilledIcon,
  frame: FillIcon,
  fill: FillIcon,
  text: TextIcon,
  stroke: StrokeIcon,
  shape: ShapeIcon,
};

const getIconComponent = (
  iconCategory: string | undefined,
  showValue: string,
) => {
  if (!iconCategory) {
    return undefined;
  }

  if (iconCategory === 'transport') {
    const iconNameWords = showValue.split('-');
    const { Icon } = getTransportStyle(iconNameWords[0]);
    return Icon;
  }

  return categoryIcons[iconCategory as keyof typeof categoryIcons];
};

const ColorToken: React.FC<TokenProps> = ({
  iconCategory,
  showValue,
  hexValue,
  copyValue,
  PrimitiveExample,
  className,
}) => {
  const IconComponent = getIconComponent(iconCategory, showValue);
  return (
    <div className="token">
      <div
        className={`token-content ${
          !iconCategory
            ? 'token-content__grid-item--primitive'
            : 'token-content__grid-item'
        }`}
      >
        {IconComponent && iconCategory && (
          <div className="token-content__icon" id={iconCategory}>
            <IconComponent color={hexValue} />
          </div>
        )}

        {PrimitiveExample && (
          <PrimitiveExample className={className} value={hexValue} />
        )}
        <div
          className={`${
            !iconCategory
              ? 'token-content__codetext--primitive'
              : 'token-content__codetext'
          }`}
        >
          <CopyableText textToCopy={copyValue}>{showValue}</CopyableText>
          {formatTokenValue(hexValue)}
        </div>
      </div>
    </div>
  );
};

export default ColorToken;
