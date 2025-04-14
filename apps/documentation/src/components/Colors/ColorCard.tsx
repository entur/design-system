import React from 'react';
import './ColorCard.scss';
import { Heading4, SubParagraph } from '@entur/typography';
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
        <Heading4 className="color-card__title">
          {colorTitle}
          <CopyableText textToCopy={hex}></CopyableText>
        </Heading4>

        <div className="color-card__value">
          <SubParagraph>HEX</SubParagraph> <span>{hex}</span>
        </div>
        {rgb && (
          <div className="color-card__value">
            <SubParagraph>RGB</SubParagraph> <span>{rgb}</span>
          </div>
        )}
        {cmyk && (
          <div className="color-card__value">
            <SubParagraph>CMYK</SubParagraph> <span>{cmyk}</span>
          </div>
        )}
        {pmsC && (
          <div className="color-card__value">
            <SubParagraph>PMS-C</SubParagraph> <span>{pmsC}</span>
          </div>
        )}
      </div>
    </div>
  );
};
