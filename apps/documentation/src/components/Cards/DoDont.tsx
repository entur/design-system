import React from 'react';
import classNames from 'classnames';
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image';

import {
  ValidationErrorIcon,
  ValidationExclamationIcon,
  ValidationInfoIcon,
  ValidationSuccessIcon,
} from '@entur/icons';
import { VariantType } from '@entur/utils';

import './DoDont.scss';

type DoDontGroupProps = { children: React.ReactNode; className?: string };

export const DoDontGroup = ({ children, className }: DoDontGroupProps) => (
  <section className={classNames('do-dont-group', className)}>
    {children}
  </section>
);

const variantMap = {
  success: {
    icon: ValidationSuccessIcon,
    ariaDescription: 'korrekt-ikon',
  },
  information: { icon: ValidationInfoIcon, ariaDescription: 'Infomelding' },
  warning: {
    icon: ValidationExclamationIcon,
    ariaDescription: 'advarselikon',
  },
  negative: { icon: ValidationErrorIcon, ariaDescription: 'feil-ikon' },
  none: { icon: null, ariaDescription: '' },
};

type DoDontCardProps = {
  alt?: string;
  children?: React.ReactNode;
  className?: string;
  title?: string;
  src?: string;
  imgSource?: IGatsbyImageData | null;
  /** Anything rendered in the box in place of an image, e.g. an inline chart */
  media?: React.ReactNode;
  variant?: VariantType | 'none';
  noPadding?: boolean;
  textInBox?: boolean;
  'aria-hidden'?: boolean;
};

export const DoDontCard = ({
  alt = '',
  children,
  className,
  title,
  src,
  imgSource,
  media,
  variant = 'success',
  noPadding = false,
  textInBox = false,
  'aria-hidden': ariaHidden,
}: DoDontCardProps) => {
  const Icon = variantMap[variant].icon;

  const textContent = (
    <div className="do-dont-card__text-content">
      {variant !== 'none' && Icon && (
        <Icon aria-label={variantMap[variant].ariaDescription} size="24px" />
      )}
      <div>
        {title !== undefined && (
          <div className="do-dont-card__text-content__title">{title}</div>
        )}
        {children !== undefined && (
          <div className="do-dont-card__text-content__body">{children}</div>
        )}
      </div>
    </div>
  );

  const hasImage = src !== undefined || !!imgSource || media !== undefined;

  return (
    <article
      className={classNames(
        'do-dont-card',
        `do-dont-card--${variant}`,
        className,
      )}
    >
      <div
        className={classNames('do-dont-card__box', {
          'do-dont-card__box--no-padding': noPadding,
        })}
      >
        {src !== undefined && (
          <img src={src} alt={alt} className="do-dont-card__box__image" />
        )}
        {imgSource && (
          <GatsbyImage
            image={imgSource}
            alt={alt}
            className="do-dont-card__box__image"
            aria-hidden={ariaHidden}
          />
        )}
        {media}
        {!hasImage && textInBox && textContent}
      </div>
      {!textInBox && textContent}
    </article>
  );
};
