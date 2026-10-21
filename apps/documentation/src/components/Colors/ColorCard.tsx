import React from 'react';
import './ColorCard.scss';
import { Heading, Text } from '@entur/typography/beta';
import { CopyableText } from '@entur/alert';
import classNames from 'classnames';

type ColorCardProps = {
  colorTitle: string;
  hex?: string;
  rgb?: string;
  cmyk?: string;
  pmsC?: string;
  className?: string;
};

export const ColorCard: React.FC<ColorCardProps> = ({
  colorTitle,
  hex,
  rgb,
  cmyk,
  pmsC,
  className,
}) => {
  return (
    <div className={classNames('color-card', className)}>
      <div className="color-card__swatch" style={{ backgroundColor: hex }} />
      <div className="color-card__content">
        <Heading as="h4" variant="subtitle-2" className="color-card__title">
          {colorTitle}
          <CopyableText textToCopy={hex}></CopyableText>
        </Heading>

        <div className="color-card__value">
          <Text variant="subparagraph">HEX</Text> <span>{hex}</span>
        </div>
        {rgb && (
          <div className="color-card__value">
            <Text variant="subparagraph">RGB</Text> <span>{rgb}</span>
          </div>
        )}
        {cmyk && (
          <div className="color-card__value">
            <Text variant="subparagraph">CMYK</Text> <span>{cmyk}</span>
          </div>
        )}
        {pmsC && (
          <div className="color-card__value">
            <Text variant="subparagraph">PMS-C</Text> <span>{pmsC}</span>
          </div>
        )}
      </div>
    </div>
  );
};
