import React from 'react';
import classNames from 'classnames';
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
};

type DoDontCardProps = {
  alt?: string;
  children?: React.ReactNode;
  className?: string;
  title?: string;
  src?: string;
  variant: VariantType;
  noPadding: boolean;
  textInBox: boolean;
};

export const DoDontCard = ({
  alt = '',
  children,
  className,
  title,
  src,
  variant = 'success',
  noPadding = false,
  textInBox = false,
}: DoDontCardProps) => {
  const Icon = variantMap[variant].icon;

  const textContent = (
    <div className="do-dont-card__text-content">
      <Icon inline={true} aria-label={variantMap[variant].ariaDescription} />
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
        {!src && textInBox && textContent}
      </div>
      {!textInBox && textContent}
    </article>
  );
};
